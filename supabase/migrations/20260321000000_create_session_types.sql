create table session_types (
  id               uuid        primary key default gen_random_uuid(),
  coach_id         uuid        not null references auth.users(id) on delete cascade,
  title            text        not null,
  description      text,
  duration_minutes integer     not null,
  price_cents      integer     not null,
  slug             text        not null,
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now(),

  unique (coach_id, slug)
);

alter table session_types enable row level security;

create policy "coaches_select_own"
  on session_types for select
  using (auth.uid() = coach_id);

create policy "coaches_insert_own"
  on session_types for insert
  with check (auth.uid() = coach_id);

create policy "coaches_update_own"
  on session_types for update
  using (auth.uid() = coach_id);

create policy "coaches_delete_own"
  on session_types for delete
  using (auth.uid() = coach_id);
