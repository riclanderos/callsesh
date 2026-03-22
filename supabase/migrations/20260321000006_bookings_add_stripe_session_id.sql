-- Stores the Stripe Checkout Session ID so the webhook can be processed
-- idempotently. A unique constraint means a duplicate webhook event (Stripe
-- retries) will fail with a 23505 violation, which the webhook handler
-- treats as a no-op 200 rather than an error.
alter table bookings
  add column stripe_checkout_session_id text unique;
