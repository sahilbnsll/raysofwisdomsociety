-- E-passes and gate check-in for the event page.
-- Run once in the Supabase SQL editor (safe to run again), then set SUPABASE_URL and
-- SUPABASE_SERVICE_ROLE_KEY (server-only env vars, never NEXT_PUBLIC_) in .env.local / the hosting dashboard.

create table if not exists public.epass_issues (
  id            text primary key,
  name          text not null check (char_length(name) between 2 and 60),
  guests        int  not null default 1 check (guests between 1 and 4),
  days          text not null default 'both' check (days in ('both', 'day1', 'day2')),
  created_at    timestamptz not null default now(),
  -- When the party was checked in at the gate, per evening (null = not yet)
  admitted_day1 timestamptz,
  admitted_day2 timestamptz
);

-- Upgrading a table created by an earlier version of this file:
alter table public.epass_issues add column if not exists days text not null default 'both' check (days in ('both', 'day1', 'day2'));
alter table public.epass_issues add column if not exists admitted_day1 timestamptz;
alter table public.epass_issues add column if not exists admitted_day2 timestamptz;

-- The page only talks to this table from the server with the service-role key.
-- RLS on with no policies means the public anon key can read and write nothing.
alter table public.epass_issues enable row level security;

create index if not exists epass_issues_created_at_idx on public.epass_issues (created_at desc);

-- For the organisers: passes and people per evening choice, and how many are in.
create or replace view public.epass_summary as
select
  days,
  count(*) as passes,
  coalesce(sum(guests), 0) as people,
  count(admitted_day1) as admitted_day1_passes,
  count(admitted_day2) as admitted_day2_passes
from public.epass_issues
group by days;
