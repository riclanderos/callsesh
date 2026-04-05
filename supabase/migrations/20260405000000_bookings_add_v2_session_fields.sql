-- V2 Tier 1: session notes, recap, transcript consent, and the index needed
-- for lightweight query-based client profiles (no dedicated clients table).
--
-- All fields added to bookings because every piece of data is scoped to a
-- single booking/session and coach_id ownership is already enforced there.
-- Client profiles are derived at query time via (coach_id, guest_email).

-- Session notes: free-form text the coach writes during or after a session.
alter table bookings
  add column coach_notes text;

-- Recap: structured post-session summary the coach fills in manually.
-- key_points and action_steps stored as text arrays (ordered list, no join table needed).
alter table bookings
  add column recap_summary      text,
  add column recap_key_points   text[],
  add column recap_action_steps text[],
  add column recap_created_at   timestamptz;

-- Transcript consent: coach enables transcript per booking; client must
-- explicitly consent in-app before the session join gate.
-- States: not_requested → pending → consented | declined
-- transcript_enabled is set by the coach; consent_status is set by the client.
alter table bookings
  add column transcript_enabled        boolean     not null default false,
  add column transcript_consent_status text        not null default 'not_requested'
    check (transcript_consent_status in
      ('not_requested', 'pending', 'consented', 'declined')),
  add column transcript_consent_at     timestamptz;

-- Index for client profile queries: list all sessions for a given guest under
-- a given coach, and aggregate distinct clients per coach efficiently.
create index bookings_coach_guest_email
  on bookings (coach_id, guest_email);
