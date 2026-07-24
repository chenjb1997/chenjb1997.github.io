-- Research Vault: one encrypted document, readable by the public and writable
-- only by its authenticated owner. Plaintext and the vault password must never
-- be stored in this table.

create table if not exists public.research_vault (
  id text primary key constraint research_vault_primary_row check (id = 'primary'),
  owner_id uuid not null references auth.users (id) on delete restrict,
  payload jsonb not null constraint research_vault_payload_is_object
    check (jsonb_typeof(payload) = 'object'),
  revision bigint not null default 1 constraint research_vault_revision_positive
    check (revision > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.research_vault is
  'The single encrypted Research Vault document. The public can read ciphertext; only the owner can update it.';
comment on column public.research_vault.payload is
  'AES-GCM encrypted payload JSON. Never store decrypted Research data here.';
comment on column public.research_vault.revision is
  'Monotonic revision used for optimistic concurrency control.';

-- Keep encrypted snapshots of the previous document. The current document
-- remains in research_vault; this table stores up to 50 older ciphertexts.
create table if not exists public.research_vault_versions (
  id bigint generated always as identity primary key,
  vault_id text not null references public.research_vault (id) on delete cascade,
  revision bigint not null constraint research_vault_versions_revision_positive
    check (revision > 0),
  payload jsonb not null constraint research_vault_versions_payload_is_object
    check (jsonb_typeof(payload) = 'object'),
  archived_at timestamptz not null default now(),
  constraint research_vault_versions_vault_revision_unique
    unique (vault_id, revision)
);

create index if not exists research_vault_versions_vault_archived_idx
  on public.research_vault_versions (vault_id, archived_at desc);

comment on table public.research_vault_versions is
  'Automatic encrypted history for Research Vault. Only the current vault owner can read it.';
comment on column public.research_vault_versions.payload is
  'A previous AES-GCM encrypted payload. Never store decrypted Research data here.';

-- Every update must be based on the current revision and advance it exactly
-- once. The client also filters by the revision it loaded; a stale save then
-- updates zero rows instead of overwriting newer work.
create or replace function public.enforce_research_vault_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.revision is distinct from old.revision + 1 then
    raise exception 'research_vault.revision must increase by exactly 1';
  end if;

  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists research_vault_enforce_revision on public.research_vault;
create trigger research_vault_enforce_revision
before update on public.research_vault
for each row
execute function public.enforce_research_vault_revision();

revoke all on function public.enforce_research_vault_revision()
  from public, anon, authenticated;

-- Archive the old ciphertext only after the current row has passed all update
-- checks. The archive and the update share one transaction, so either both
-- succeed or neither does. Keep the latest 50 historical snapshots per vault.
create or replace function public.archive_research_vault_version()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.research_vault_versions (
    vault_id,
    revision,
    payload,
    archived_at
  )
  values (
    old.id,
    old.revision,
    old.payload,
    now()
  )
  on conflict (vault_id, revision) do nothing;

  delete from public.research_vault_versions as version_to_delete
  using (
    select old_version.id
    from public.research_vault_versions as old_version
    where old_version.vault_id = old.id
    order by old_version.revision desc, old_version.id desc
    offset 50
  ) as expired_version
  where version_to_delete.id = expired_version.id;

  return new;
end;
$$;

drop trigger if exists research_vault_archive_version on public.research_vault;
create trigger research_vault_archive_version
after update on public.research_vault
for each row
execute function public.archive_research_vault_version();

-- Trigger functions are internal database machinery, not frontend RPCs.
revoke all on function public.archive_research_vault_version()
  from public, anon, authenticated;

alter table public.research_vault enable row level security;
alter table public.research_vault_versions enable row level security;

-- Keep table privileges explicit. The frontend uses a publishable/anon key;
-- neither role can insert/delete rows or change ownership.
revoke all on table public.research_vault from anon, authenticated;
grant select (id, payload, revision, updated_at)
  on table public.research_vault to anon, authenticated;
grant update (payload, revision, updated_at)
  on table public.research_vault to authenticated;

-- History is private to whichever user currently owns the vault. A small
-- security-definer predicate lets the policy verify owner_id without granting
-- frontend users access to that column.
create or replace function public.is_research_vault_owner(target_vault_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.research_vault as vault
    where vault.id = target_vault_id
      and vault.owner_id = (select auth.uid())
  );
$$;

revoke all on function public.is_research_vault_owner(text)
  from public, anon, authenticated;
grant execute on function public.is_research_vault_owner(text)
  to authenticated;

revoke all on table public.research_vault_versions from anon, authenticated;
grant select (id, vault_id, revision, payload, archived_at)
  on table public.research_vault_versions to authenticated;

drop policy if exists "Public can read encrypted Research Vault" on public.research_vault;
create policy "Public can read encrypted Research Vault"
on public.research_vault
for select
to anon, authenticated
using (id = 'primary');

drop policy if exists "Owner can update encrypted Research Vault" on public.research_vault;
create policy "Owner can update encrypted Research Vault"
on public.research_vault
for update
to authenticated
using (
  id = 'primary'
  and owner_id = (select auth.uid())
)
with check (
  id = 'primary'
  and owner_id = (select auth.uid())
);

drop policy if exists "Owner can read encrypted Research Vault history"
  on public.research_vault_versions;
create policy "Owner can read encrypted Research Vault history"
on public.research_vault_versions
for select
to authenticated
using (public.is_research_vault_owner(vault_id));
