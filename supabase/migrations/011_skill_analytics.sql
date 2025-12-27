-- Migration: 011_skill_analytics.sql
-- Description: Adds tables for tracking skill views, downloads, and usage events.

-- 1. Raw Events Table (Immutable Log)
DO $$ BEGIN
    CREATE TYPE analytics_event_type AS ENUM ('view', 'download', 'copy', 'edit');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists public.skill_analytics_events (
  id uuid primary key default extensions.uuid_generate_v4(),
  skill_id uuid references public.user_skills(id) on delete cascade not null,
  event_type analytics_event_type not null,
  user_id uuid references auth.users(id) on delete set null, -- Nullable for anon visitors
  metadata jsonb default '{}'::jsonb, -- Store minimal context (e.g. { source: 'web' })
  created_at timestamptz default now() not null
);

-- Index for time-series queries (safe check)
create index if not exists idx_analytics_skill_date on public.skill_analytics_events(skill_id, created_at desc);

-- 2. Aggregated Stats Table (Fast Read)
create table if not exists public.skill_stats (
  skill_id uuid primary key references public.user_skills(id) on delete cascade,
  view_count int default 0 not null,
  download_count int default 0 not null,
  copy_count int default 0 not null,
  updated_at timestamptz default now() not null
);

-- 4. Trigger Usage: Auto-increment stats on INSERT
create or replace function public.handle_analytics_event()
returns trigger as $$
begin
  -- Upsert stats row (create if not exists, then increment)
  insert into public.skill_stats (skill_id, view_count, download_count, copy_count)
  values (
    new.skill_id,
    case when new.event_type = 'view' then 1 else 0 end,
    case when new.event_type = 'download' then 1 else 0 end,
    case when new.event_type = 'copy' then 1 else 0 end
  )
  on conflict (skill_id) do update set
    view_count = skill_stats.view_count + (case when new.event_type = 'view' then 1 else 0 end),
    download_count = skill_stats.download_count + (case when new.event_type = 'download' then 1 else 0 end),
    copy_count = skill_stats.copy_count + (case when new.event_type = 'copy' then 1 else 0 end),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Safe Trigger Creation
drop trigger if exists on_analytics_event on public.skill_analytics_events;
create trigger on_analytics_event
  after insert on public.skill_analytics_events
  for each row execute procedure public.handle_analytics_event();

-- 5. RLS Policies

-- Enable RLS (safe to run multiple times)
alter table public.skill_analytics_events enable row level security;
alter table public.skill_stats enable row level security;

-- Policy: Events (INSERT)
drop policy if exists "Anyone can insert events" on public.skill_analytics_events;
create policy "Anyone can insert events"
  on public.skill_analytics_events for insert
  with check (true);

-- Policy: Events (SELECT)
drop policy if exists "Owners view their own skill events" on public.skill_analytics_events;
create policy "Owners view their own skill events"
  on public.skill_analytics_events for select
  using (
    exists (
      select 1 from public.user_skills
      where user_skills.id = skill_analytics_events.skill_id
      and user_skills.user_id = auth.uid()
    )
  );

-- Policy: Stats (SELECT)
drop policy if exists "Anyone can view skill stats" on public.skill_stats;
create policy "Anyone can view skill stats"
  on public.skill_stats for select
  using (true);
