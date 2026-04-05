-- Long-term client notes stored per coach_client row.
-- Separate from per-session coach_notes on bookings.
alter table coach_clients
  add column if not exists notes text;
