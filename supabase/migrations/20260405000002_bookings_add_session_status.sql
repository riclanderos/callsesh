-- Track whether a session actually occurred.
-- 'scheduled' = booked but not yet joined; 'completed' = participants joined.
-- Uses IF NOT EXISTS so it is safe to run against a DB that already has the columns.

alter table bookings
  add column if not exists session_status text not null default 'scheduled'
    check (session_status in ('scheduled', 'completed'));

alter table bookings
  add column if not exists session_completed_at timestamptz;
