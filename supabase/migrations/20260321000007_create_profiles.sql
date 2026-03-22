-- One profile row per coach, currently holds timezone preference.
-- Upserted by the coach on first save (trigger not required; upsert handles
-- missing rows for existing users).
create table profiles (
  id         uuid        primary key references auth.users(id) on delete cascade,
  timezone   text        not null default 'UTC',
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

-- Coaches read and write their own profile.
create policy "coaches_select_own"
  on profiles for select
  using (auth.uid() = id);

create policy "coaches_insert_own"
  on profiles for insert
  with check (auth.uid() = id);

create policy "coaches_update_own"
  on profiles for update
  using (auth.uid() = id);

-- No public SELECT policy. The public booking page and server actions
-- read coach timezone via the service-role client (server-side only).
