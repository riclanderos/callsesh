-- Coach-client identity table. Provides stable UUID identity for each unique
-- guest per coach, replacing email-as-identifier in URL routes and queries.
-- normalized_email = lower(trim(guest_email)) is the dedup key.

create table coach_clients (
  id               uuid        primary key default gen_random_uuid(),
  coach_id         uuid        not null references auth.users(id) on delete cascade,
  email            text        not null,
  normalized_email text        not null,
  name             text,
  created_at       timestamptz not null default now()
);

-- One client row per (coach, email) — case-insensitive.
create unique index coach_clients_coach_email_unique
  on coach_clients (coach_id, normalized_email);

alter table coach_clients enable row level security;

-- Coaches read and write their own client rows.
create policy "coaches_select_own"
  on coach_clients for select
  using (auth.uid() = coach_id);

create policy "coaches_insert_own"
  on coach_clients for insert
  with check (auth.uid() = coach_id);

create policy "coaches_update_own"
  on coach_clients for update
  using (auth.uid() = coach_id);

-- Foreign key on bookings to the stable client identity.
-- set null on delete so a client record deletion never loses booking history.
alter table bookings
  add column coach_client_id uuid references coach_clients(id) on delete set null;

create index bookings_coach_client_id
  on bookings (coach_client_id);

-- Backfill: one coach_clients row per unique (coach_id, normalized_email).
-- DISTINCT ON ordered by newest booking picks the canonical email casing and
-- latest non-empty guest_name in one pass.
insert into coach_clients (coach_id, email, normalized_email, name)
select
  coach_id,
  guest_email,
  lower(trim(guest_email)),
  nullif(trim(guest_name), '')
from (
  select distinct on (coach_id, lower(trim(guest_email)))
    coach_id,
    guest_email,
    guest_name
  from bookings
  order by coach_id, lower(trim(guest_email)), booking_date desc, created_at desc
) latest
on conflict (coach_id, normalized_email) do nothing;

-- Backfill coach_client_id on all existing bookings.
update bookings b
set coach_client_id = cc.id
from coach_clients cc
where cc.coach_id         = b.coach_id
  and cc.normalized_email = lower(trim(b.guest_email));
