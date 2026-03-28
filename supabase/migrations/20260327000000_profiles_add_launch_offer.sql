-- Launch-offer fields on profiles.
-- Each row tracks whether this coach was granted the launch offer, how many
-- covered sessions remain, and when the offer expires.

alter table public.profiles
  add column if not exists launch_offer_eligible            boolean     not null default false,
  add column if not exists launch_offer_sessions_remaining  integer     not null default 0,
  add column if not exists launch_offer_granted_at          timestamptz,
  add column if not exists launch_offer_expires_at          timestamptz;

-- ── Counter table ────────────────────────────────────────────────────────────
-- Single row that records how many launch offers have been granted so far.
-- The CHECK constraint (grants_used <= 10) is a safety net; the actual gate is
-- inside try_grant_launch_offer() which uses an atomic UPDATE to prevent
-- concurrent over-granting.

create table if not exists public.launch_offer_counter (
  id          integer primary key default 1,
  grants_used integer not null default 0,
  constraint single_row       check (id = 1),
  constraint grants_used_range check (grants_used >= 0 and grants_used <= 10)
);

insert into public.launch_offer_counter (id, grants_used)
values (1, 0)
on conflict (id) do nothing;

-- RLS: no direct user access. All reads and writes are via the
-- SECURITY DEFINER function which runs under the owner role.
alter table public.launch_offer_counter enable row level security;

-- ── Grant function ───────────────────────────────────────────────────────────
-- Atomically grants the launch offer to a new coach if capacity remains.
-- Returns TRUE when the offer was granted, FALSE when the cap was already reached.
--
-- Concurrency safety: the UPDATE on launch_offer_counter acquires a row-level
-- write lock. Two concurrent calls can never both pass the WHERE grants_used < 10
-- gate — the second will wait for the first to commit, then see grants_used = 10
-- and correctly return false.

create or replace function public.try_grant_launch_offer(p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_count integer;
begin
  -- Atomically claim a slot. If grants_used is already 10 this UPDATE matches
  -- no row, v_new_count stays null, and we fall through to the else branch.
  update launch_offer_counter
     set grants_used = grants_used + 1
   where id = 1 and grants_used < 10
  returning grants_used into v_new_count;

  if v_new_count is not null then
    -- Slot secured — write offer fields to this coach's profile row.
    insert into profiles (
      id,
      launch_offer_eligible,
      launch_offer_sessions_remaining,
      launch_offer_granted_at,
      launch_offer_expires_at
    ) values (
      p_user_id,
      true,
      10,
      now(),
      now() + interval '14 days'
    )
    on conflict (id) do update set
      launch_offer_eligible           = true,
      launch_offer_sessions_remaining = 10,
      launch_offer_granted_at         = now(),
      launch_offer_expires_at         = now() + interval '14 days';

    return true;

  else
    -- Cap already reached — ensure a profile row exists with no offer.
    insert into profiles (id, launch_offer_eligible, launch_offer_sessions_remaining)
    values (p_user_id, false, 0)
    on conflict (id) do nothing;

    return false;
  end if;
end;
$$;
