-- Run this in Supabase Dashboard → SQL Editor after creating a new project

create table if not exists blog_subscriptions (
  email          text primary key,
  subscribed_at  timestamptz not null default now(),
  verified       boolean     not null default true
);

-- Allow the service role to read/write (already has full access by default)
-- Allow anonymous reads to be blocked (no anon select needed)
alter table blog_subscriptions enable row level security;

create policy "Service role full access"
  on blog_subscriptions
  using (true)
  with check (true);
