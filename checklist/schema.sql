-- Список дел «Ева · Дима · Кася» — установка базы Supabase.
-- Начальное значение access_hash является заглушкой; после создания базы замените его SHA-256 от семейного ключа.
-- Действующий семейный ключ в репозиторий НЕ добавлять. Уже развёрнутая база настроена отдельно.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.household_checklist_private (
  id text primary key check (id = 'family-v1'),
  access_hash text not null check (access_hash ~ '^[0-9a-f]{64}$'),
  revision bigint not null default 0 check (revision >= 0),
  payload jsonb not null
);

alter table public.household_checklist_private enable row level security;
revoke all on public.household_checklist_private from public, anon, authenticated;

insert into public.household_checklist_private (id, access_hash, revision, payload)
values (
  'family-v1',
  '0000000000000000000000000000000000000000000000000000000000000000',
  0,
  '{"version":1,"lists":{"eva":[],"dima":[],"kasya":[]}}'::jsonb
)
on conflict (id) do nothing;

create or replace function public.household_checklist_get(p_secret text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_revision bigint;
  current_payload jsonb;
begin
  if p_secret is null or length(p_secret) < 32 or length(p_secret) > 200 then
    raise exception 'Неверный ключ семейного списка' using errcode = 'PT401';
  end if;
  select s.revision, s.payload into current_revision, current_payload
  from public.household_checklist_private as s
  where s.id = 'family-v1'
    and s.access_hash = pg_catalog.encode(extensions.digest(pg_catalog.convert_to(p_secret, 'UTF8'), 'sha256'), 'hex');
  if not found then
    raise exception 'Неверный ключ семейного списка' using errcode = 'PT401';
  end if;
  return pg_catalog.jsonb_build_object('revision', current_revision, 'data', current_payload);
end;
$$;

create or replace function public.household_checklist_put(p_secret text, p_revision bigint, p_data jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  next_revision bigint;
begin
  if p_secret is null or length(p_secret) < 32 or length(p_secret) > 200 then
    raise exception 'Неверный ключ семейного списка' using errcode = 'PT401';
  end if;
  if p_revision is null or p_revision < 0 or p_data is null
     or pg_catalog.jsonb_typeof(p_data) <> 'object'
     or p_data->>'version' <> '1'
     or pg_catalog.jsonb_typeof(p_data->'lists') <> 'object'
     or pg_catalog.jsonb_typeof(p_data->'lists'->'eva') <> 'array'
     or pg_catalog.jsonb_typeof(p_data->'lists'->'dima') <> 'array'
     or pg_catalog.jsonb_typeof(p_data->'lists'->'kasya') <> 'array'
     or pg_catalog.octet_length(p_data::text) > 250000 then
    raise exception 'Неверные или слишком большие данные' using errcode = 'PT400';
  end if;
  update public.household_checklist_private as s
  set revision = s.revision + 1, payload = p_data
  where s.id = 'family-v1'
    and s.access_hash = pg_catalog.encode(extensions.digest(pg_catalog.convert_to(p_secret, 'UTF8'), 'sha256'), 'hex')
    and s.revision = p_revision
  returning s.revision into next_revision;
  if found then
    return pg_catalog.jsonb_build_object('saved', true, 'revision', next_revision);
  end if;
  if exists (
    select 1 from public.household_checklist_private as s
    where s.id = 'family-v1'
      and s.access_hash = pg_catalog.encode(extensions.digest(pg_catalog.convert_to(p_secret, 'UTF8'), 'sha256'), 'hex')
  ) then
    raise exception 'На другом устройстве появились новые изменения' using errcode = 'PT409';
  end if;
  raise exception 'Неверный ключ семейного списка' using errcode = 'PT401';
end;
$$;

revoke execute on function public.household_checklist_get(text) from public, anon, authenticated;
revoke execute on function public.household_checklist_put(text, bigint, jsonb) from public, anon, authenticated;
grant execute on function public.household_checklist_get(text) to anon, authenticated;
grant execute on function public.household_checklist_put(text, bigint, jsonb) to anon, authenticated;
