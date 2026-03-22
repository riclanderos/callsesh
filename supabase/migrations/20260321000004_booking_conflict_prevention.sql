-- Partial unique index: prevents two non-cancelled bookings from sharing the
-- exact same (coach, date, start_time). Acts as a hard database-level backstop
-- against the race condition window between the application conflict check and
-- the INSERT.
create unique index bookings_no_double_book
  on bookings (coach_id, booking_date, start_time)
  where (status <> 'cancelled');

-- SECURITY DEFINER function: checks for any overlapping non-cancelled booking
-- for a given coach on a given date without exposing booking rows to the public.
-- Overlap condition: existing.start_time < new.end_time
--               AND existing.end_time   > new.start_time
--
-- Called via supabase.rpc('is_slot_taken', { ... }) from the server action.
-- Returns true if the slot is already taken, false if it is free.
create or replace function is_slot_taken(
  p_coach_id    uuid,
  p_booking_date date,
  p_start_time  time,
  p_end_time    time
)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from   bookings
    where  coach_id     = p_coach_id
      and  booking_date = p_booking_date
      and  start_time   < p_end_time
      and  end_time     > p_start_time
      and  status      <> 'cancelled'
  );
$$;
