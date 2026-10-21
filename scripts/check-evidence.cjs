const fs = require('node:fs');
const assert = require('node:assert/strict');
const registry = JSON.parse(fs.readFileSync('knowledge/source-registry.json', 'utf8'));
const types = ['professions', 'materials', 'processes', 'dictionary'];
const records = {};
for (const type of types) {
  const dataset = JSON.parse(fs.readFileSync('knowledge/' + type + '.json', 'utf8'));
  const key = type === 'dictionary' ? 'term' : 'id';
  records[type] = new Map(dataset.items.map(item => [item[key], item]));
}
assert.ok(Array.isArray(registry.sources), 'sources must be an array');
assert.ok(Array.isArray(registry.recordEvidence), 'recordEvidence must be an array');
const sourceIds = new Set();
for (const source of registry.sources) {
  for (const field of registry.policy.requiredFields) {
    assert.ok(typeof source[field] === 'string' && source[field].trim(), 'missing source field: ' + field);
  }
  const url = new URL(source.url);
  assert.equal(url.protocol, 'https:', 'source URL must use HTTPS');
  assert.ok(!sourceIds.has(source.sourceId), 'duplicate source: ' + source.sourceId);
  sourceIds.add(source.sourceId);
}
const allowed = new Set(registry.policy.allowedVerificationStatuses);
const seen = new Set();
for (const evidence of registry.recordEvidence) {
  assert.ok(records[evidence.recordType], 'unknown type: ' + evidence.recordType);
  const item = records[evidence.recordType].get(evidence.recordId);
  assert.ok(item, 'unknown record: ' + evidence.recordId);
  assert.ok(sourceIds.has(evidence.sourceId), 'unknown source: ' + evidence.sourceId);
  assert.ok(allowed.has(evidence.verificationStatus), 'unsupported status');
  assert.ok(typeof evidence.claimPath === 'string' && Object.hasOwn(item, evidence.claimPath),
    'unknown record field: ' + evidence.recordType + '/' + evidence.recordId + '/' + evidence.claimPath);
  assert.ok(typeof evidence.claimScope === 'string' && evidence.claimScope.trim(), 'claim scope missing');
  const key = [evidence.recordType, evidence.recordId, evidence.claimPath, evidence.sourceId].join(':');
  assert.ok(!seen.has(key), 'duplicate evidence link: ' + key);
  seen.add(key);
}
const uniqueLinkedRecords = new Set(registry.recordEvidence.map(e => e.recordType + '/' + e.recordId));
const total = types.reduce((n, type) => n + records[type].size, 0);
console.log('Source metadata valid: ' + sourceIds.size + ' sources, ' + seen.size + ' evidence links.');
console.log('Record coverage: ' + uniqueLinkedRecords.size + '/' + total + ' with >=1 evidence link (links do not imply factual verification).');
