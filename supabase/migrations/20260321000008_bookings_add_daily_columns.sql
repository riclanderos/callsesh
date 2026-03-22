-- Daily video room columns. Nullable: rooms are created after payment
-- confirmation, so existing rows and any failed-creation rows will be null.
alter table bookings
  add column daily_room_name text,
  add column daily_room_url  text;
