-- E-passes and gate check-in for the event page.
-- Run in the Supabase SQL editor. It is safe to run again, and it upgrades a table made by an
-- earlier version of this file. Then set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server-only
-- env vars, never NEXT_PUBLIC_) in .env.local and in the hosting dashboard.

create table if not exists public.epass_issues (
  id            text primary key
                constraint epass_issues_id_format check (id ~ '^RWS26-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$'),
  name          text not null
                constraint epass_issues_name_check check (char_length(name) between 2 and 60 and name = btrim(name)),
  guests        int  not null default 1 check (guests between 1 and 4),
  days          text not null default 'both' check (days in ('both', 'day1', 'day2')),
  created_at    timestamptz not null default now(),
  -- When the party was checked in at the gate, per evening (null = not yet)
  admitted_day1 timestamptz,
  admitted_day2 timestamptz
);

-- Upgrading a table created by an earlier version of this file.
alter table public.epass_issues add column if not exists days text not null default 'both' check (days in ('both', 'day1', 'day2'));
alter table public.epass_issues add column if not exists admitted_day1 timestamptz;
alter table public.epass_issues add column if not exists admitted_day2 timestamptz;

do $$
begin
  -- Pass IDs as the site makes them (no 0, 1, I or O), checked on every new row.
  if not exists (select 1 from pg_constraint where conname = 'epass_issues_id_format') then
    alter table public.epass_issues
      add constraint epass_issues_id_format check (id ~ '^RWS26-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$') not valid;
  end if;
end $$;

-- The page only talks to this table from the server with the service-role key.
-- RLS on with no policies, and no grants for the public roles, means the anon key reads and writes nothing.
alter table public.epass_issues enable row level security;
revoke all on public.epass_issues from anon, authenticated;

create index if not exists epass_issues_created_at_idx on public.epass_issues (created_at desc);

-- For the organisers (Table editor or SQL editor): passes and people per evening choice, and how many are in.
-- security_invoker makes the view obey the table's RLS, so it is not a way round it for the anon key.
create or replace view public.epass_summary
with (security_invoker = on) as
select
  days,
  count(*)                                                as passes,
  coalesce(sum(guests), 0)                                as people,
  count(admitted_day1)                                    as admitted_day1_passes,
  count(admitted_day2)                                    as admitted_day2_passes,
  coalesce(sum(guests) filter (where admitted_day1 is not null), 0) as admitted_day1_people,
  coalesce(sum(guests) filter (where admitted_day2 is not null), 0) as admitted_day2_people
from public.epass_issues
group by days;

revoke all on public.epass_summary from anon, authenticated;
