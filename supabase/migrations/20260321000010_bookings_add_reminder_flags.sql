-- Track whether scheduled reminder emails have been sent for each booking.
-- Default false so existing confirmed bookings are caught on the first cron run.
alter table bookings
  add column reminder_24h_sent boolean not null default false,
  add column reminder_1h_sent  boolean not null default false;
