-- Secure random token that grants unauthenticated guests access to their
-- booking's session page and Daily meeting token endpoint.
-- Generated at booking creation time (Stripe webhook INSERT).
-- Nullable so existing rows and failed-generation rows are safe.
alter table bookings
  add column guest_access_token text;
