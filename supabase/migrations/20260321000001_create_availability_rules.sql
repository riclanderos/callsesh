create table availability_rules (
  id          uuid        primary key default gen_random_uuid(),
  coach_id    uuid        not null references auth.users(id) on delete cascade,
  day_of_week smallint    not null check (day_of_week between 0 and 6),
  start_time  time        not null,
  end_time    time        not null,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now(),

  constraint end_after_start check (end_time > start_time)
);

alter table availability_rules enable row level security;

create policy "coaches_select_own"
  on availability_rules for select
  using (auth.uid() = coach_id);

create policy "coaches_insert_own"
  on availability_rules for insert
  with check (auth.uid() = coach_id);

create policy "coaches_update_own"
  on availability_rules for update
  using (auth.uid() = coach_id);

create policy "coaches_delete_own"
  on availability_rules for delete
  using (auth.uid() = coach_id);
