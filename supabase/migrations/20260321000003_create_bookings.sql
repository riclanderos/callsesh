create table bookings (
  id               uuid        primary key default gen_random_uuid(),
  coach_id         uuid        not null references auth.users(id) on delete cascade,
  session_type_id  uuid        not null references session_types(id) on delete cascade,
  guest_name       text        not null,
  guest_email      text        not null,
  booking_date     date        not null,
  start_time       time        not null,
  end_time         time        not null,
  status           text        not null default 'confirmed'
                               check (status in ('confirmed', 'cancelled', 'completed')),
  created_at       timestamptz not null default now()
);

alter table bookings enable row level security;

-- Coaches can view their own bookings
create policy "coaches_select_own"
  on bookings for select
  using (auth.uid() = coach_id);

-- Public (unauthenticated) users can create bookings.
-- coach_id is always set server-side from the session_type row, never from user input.
create policy "public_insert"
  on bookings for insert
  with check (true);
