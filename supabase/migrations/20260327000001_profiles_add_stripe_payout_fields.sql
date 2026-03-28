-- Add Stripe payout/charges status fields to profiles.
-- These are written by the service-role client (stripe-sync helper and webhook)
-- and read server-side to determine payout readiness without a live Stripe API
-- call on every dashboard load.

alter table public.profiles
  add column if not exists stripe_payouts_enabled  boolean not null default false,
  add column if not exists stripe_charges_enabled  boolean not null default false;
