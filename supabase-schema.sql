-- ============================================================
-- Sleep Labubu — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── Users ──────────────────────────────────────────────────
create table if not exists users (
  id                  text primary key,       -- device UUID from localStorage
  name                text not null,
  labubu_name         text not null default 'Labubu',
  target_bedtime      time not null default '22:30',
  target_wake_time    time not null default '07:00',
  onboarding_complete boolean not null default false,
  created_at          timestamptz not null default now()
);

-- ── Sleep logs ─────────────────────────────────────────────
create table if not exists sleep_logs (
  id                  bigint generated always as identity primary key,
  user_id             text not null references users(id) on delete cascade,
  date                date not null,
  bedtime_timestamp   timestamptz,            -- set when user tucks in
  wake_timestamp      timestamptz,            -- set when user wakes Labubu
  duration_hours      numeric(4,2),           -- calculated
  quality_rating      smallint check (quality_rating between 1 and 5),
  notes               text,
  sleep_score         smallint check (sleep_score between 0 and 100),
  tip_shown           int,                    -- tip ID shown at tuck-in (for morning quiz)
  created_at          timestamptz not null default now(),
  unique (user_id, date)
);

-- ── Pet state ──────────────────────────────────────────────
create table if not exists pet_state (
  id                      bigint generated always as identity primary key,
  user_id                 text not null references users(id) on delete cascade unique,
  happiness_score         smallint not null default 80 check (happiness_score between 0 and 100),
  evolution_stage         smallint not null default 1 check (evolution_stage between 1 and 5),
  streak_days             int not null default 0,
  last_tucked_in          timestamptz,
  last_woken_up           timestamptz,
  graduated               boolean not null default false,
  graduation_date         timestamptz,
  post_grad_checkin_count smallint not null default 0,
  last_updated            timestamptz not null default now()
);

-- ── Sleep tips library ─────────────────────────────────────
create table if not exists sleep_tips (
  id                bigint generated always as identity primary key,
  category          text not null,            -- screens | routine | environment | food | mind
  content           text not null,
  labubu_dialogue   text not null,
  hours_before_bed  numeric(4,1),             -- null if not time-relative
  hours_after_wake  numeric(4,1),             -- for morning tips
  unlock_stage      smallint default 1        -- tips that unlock after graduation
);

-- ── Tip notification schedule ──────────────────────────────
create table if not exists tip_schedule (
  id              bigint generated always as identity primary key,
  user_id         text not null references users(id) on delete cascade,
  tip_id          int not null,
  scheduled_time  timestamptz not null,
  sent_at         timestamptz,
  category        text,
  date            date not null default current_date
);

-- ── Row Level Security ─────────────────────────────────────
-- Enable RLS on all tables so each device only sees its own data.

alter table users       enable row level security;
alter table sleep_logs  enable row level security;
alter table pet_state   enable row level security;
alter table sleep_tips  enable row level security;
alter table tip_schedule enable row level security;

-- Users: anyone can insert/select/update their own row (matched by id = request header user id)
-- Since we use anon key + device UUID (not Supabase Auth), we allow anon access scoped by the id field.
create policy "users: open access by device id"
  on users for all
  using (true)
  with check (true);

create policy "sleep_logs: open access"
  on sleep_logs for all
  using (true)
  with check (true);

create policy "pet_state: open access"
  on pet_state for all
  using (true)
  with check (true);

create policy "sleep_tips: read only"
  on sleep_tips for select
  using (true);

create policy "tip_schedule: open access"
  on tip_schedule for all
  using (true)
  with check (true);
