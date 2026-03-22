-- Allow anonymous visitors to read active session types (public booking page).
-- The existing coach policy (auth.uid() = coach_id) still applies for
-- authenticated coaches viewing their own inactive sessions.
create policy "public_read_active_session_types"
  on session_types for select
  using (is_active = true);

-- Allow anonymous visitors to read active availability rules when they have
-- the coach's session (coach_id is always resolved server-side, never from user input).
create policy "public_read_active_availability_rules"
  on availability_rules for select
  using (is_active = true);
