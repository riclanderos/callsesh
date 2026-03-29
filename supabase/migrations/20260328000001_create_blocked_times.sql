create table blocked_times (
  id            uuid        primary key default gen_random_uuid(),
  coach_id      uuid        not null references public.profiles(id) on delete cascade,
  day_of_week   smallint    check (day_of_week between 0 and 6),
  specific_date date,
  start_time    time        not null,
  end_time      time        not null,
  created_at    timestamptz not null default now(),

  constraint end_after_start check (end_time > start_time),
  constraint day_or_date check (
    (day_of_week is not null and specific_date is null) or
    (day_of_week is null     and specific_date is not null)
  )
);

alter table blocked_times enable row level security;

create policy "coaches_select_own"
  on blocked_times for select
  using (auth.uid() = coach_id);

create policy "coaches_insert_own"
  on blocked_times for insert
  with check (auth.uid() = coach_id);

create policy "coaches_delete_own"
  on blocked_times for delete
  using (auth.uid() = coach_id);
