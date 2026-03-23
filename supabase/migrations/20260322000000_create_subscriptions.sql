create table public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null references auth.users(id) on delete cascade,
  stripe_customer_id      text        not null,
  stripe_subscription_id  text        not null,
  plan_key                text        not null default 'free'
                                      check (plan_key in ('free', 'starter', 'pro')),
  status                  text        not null,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- One active subscription record per user (upsert conflict target)
create unique index subscriptions_user_id_idx
  on public.subscriptions (user_id);

-- Fast webhook lookups by Stripe IDs
create index subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);

create index subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

alter table public.subscriptions enable row level security;

-- Coaches can read their own subscription (e.g. to show plan status in the dashboard)
create policy "users_select_own_subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- All writes (insert / update) go through the service role key in the webhook handler.
-- No authenticated-user write policies are needed.
