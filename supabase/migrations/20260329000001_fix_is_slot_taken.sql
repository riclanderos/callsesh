-- Replace status <> 'cancelled' with an explicit allowlist so that any future
-- non-terminal statuses (e.g. 'pending') never accidentally block slot availability.

create or replace function is_slot_taken(
  p_coach_id     uuid,
  p_booking_date date,
  p_start_time   time,
  p_end_time     time
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
      and  status       in ('confirmed', 'completed')
  );
$$;

-- Rebuild the double-book guard index to match the same explicit status list.
drop index if exists bookings_no_double_book;
create unique index bookings_no_double_book
  on bookings (coach_id, booking_date, start_time)
  where (status in ('confirmed', 'completed'));
