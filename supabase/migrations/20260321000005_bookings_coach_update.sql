-- Coaches need UPDATE permission to cancel their own bookings.
-- The using + with check clauses both restrict to the owning coach,
-- preventing any coach from modifying another coach's bookings.
create policy "coaches_update_own"
  on bookings for update
  using (auth.uid() = coach_id)
  with check (auth.uid() = coach_id);
