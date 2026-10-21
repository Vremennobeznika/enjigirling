import crypto from 'node:crypto';
import { Driver } from '@ydbjs/core';
import { query } from '@ydbjs/query';
import { MetadataCredentialsProvider } from '@ydbjs/auth/metadata';

// Cloud Functions, Node.js 22. Deploy with a service account granted ydb.editor
// ONLY for the dedicated YDB database. Never publish the shared secret.
const ORIGIN = 'https://vremennobeznika.github.io';
const BODY_LIMIT = 250000;
const ID = 'personal';
let connection;

function json(statusCode, value) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': ORIGIN,
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Token',
      'Cache-Control': 'no-store',
      'Vary': 'Origin'
    },
    body: JSON.stringify(value)
  };
}
function digest(x) { return crypto.createHash('sha256').update(x, 'utf8').digest(); }
function authorized(event) {
  const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([key, value]) => [key.toLowerCase(), String(value)]));
  const expected = process.env.SYNC_TOKEN;
  if (!expected || expected.length < 32) return false;
  const supplied = headers['x-sync-token'] || '';
  return crypto.timingSafeEqual(digest(expected), digest(supplied));
}
async function getDb() {
  if (!connection) connection = (async () => {
    if (!process.env.YDB_CONNECTION_STRING) throw Error('YDB_CONNECTION_STRING is missing');
    const driver = new Driver(process.env.YDB_CONNECTION_STRING, {
      credentialsProvider: new MetadataCredentialsProvider()
    });
    await driver.ready();
    return query(driver);
  })().catch(err => { connection = null; throw err; });
  return connection;
}
function normalize(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error('bad_data');
  if (!data.calendar || typeof data.calendar !== 'object' || Array.isArray(data.calendar)) throw Error('bad_calendar');
  for (const name of ['shopping', 'tasks', 'pantry']) if (!Array.isArray(data[name])) throw Error('bad_' + name);
  return {
    calendar: data.calendar,
    shopping: data.shopping,
    tasks: data.tasks,
    pantry: data.pantry
  };
}
export async function handler(event) {
  const method = event.httpMethod || 'GET';
  const origin = Object.entries(event.headers || {}).find(([key]) => key.toLowerCase() === 'origin')?.[1];
  if (origin && origin !== ORIGIN) return json(403, {error: 'Origin forbidden'});
  if (method === 'OPTIONS') return json(204, {});
  if (!['GET', 'PUT'].includes(method)) return json(405, {error: 'Method not allowed'});
  if (!authorized(event)) return json(401, {error: 'Неверный секрет синхронизации'});
  try {
    const sql = await getDb();
    if (method === 'GET') {
      const rows = await sql`SELECT payload, revision FROM app_state WHERE id = ${ID}`;
      const row = rows?.[0]?.[0];
      if (!row) return json(200, {revision: 0, data: null});
      return json(200, {revision: Number(row.revision), data: JSON.parse(row.payload)});
    }
    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64').toString('utf8')
      : (event.body || '');
    if (Buffer.byteLength(body, 'utf8') > BODY_LIMIT) return json(413, {error: 'Список превышает лимит 250 КБ'});
    let req;
    try { req = JSON.parse(body); }
    catch { return json(400, {error: 'Неверный JSON'}); }
    const baseRevision = req?.revision;
    if (!Number.isSafeInteger(baseRevision) || baseRevision < 0) return json(400, {error: 'Неверная версия'});
    let data;
    try { data = normalize(req.data); }
    catch { return json(400, {error: 'Неверная структура данных'}); }
    // Serializable transaction prevents silent overwrites when two devices edit at once.
    const result = await sql.begin(async (tx) => {
      const rows = await tx`SELECT revision FROM app_state WHERE id = ${ID}`;
      const existingRevision = Number(rows?.[0]?.[0]?.revision || 0);
      if (baseRevision !== existingRevision) return {conflict: true, revision: existingRevision};
      const next = existingRevision + 1;
      await tx`UPSERT INTO app_state (id, payload, revision)
               VALUES (${ID}, ${JSON.stringify(data)}, ${BigInt(next)})`;
      return {revision: next};
    });
    return result.conflict
      ? json(409, {error: 'В облаке есть более новая версия. Сначала скачай её.', revision: result.revision})
      : json(200, {saved: true, revision: result.revision});
  } catch (error) {
    console.error('YDB sync failed:', error?.name || 'Error');
    return json(503, {error: 'Облачная база недоступна. Локальные данные сохранены.'});
  }
}
