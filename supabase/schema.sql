-- Sleep Labubu — Supabase schema
-- Run this in the Supabase SQL editor to initialise the database.

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  UUID        PRIMARY KEY,           -- device UUID from localStorage
  name                TEXT        NOT NULL,
  labubu_name         TEXT        NOT NULL,
  target_bedtime      TEXT        NOT NULL,              -- "HH:MM" e.g. "22:30"
  target_wake_time    TEXT        NOT NULL,              -- "HH:MM" e.g. "07:00"
  onboarding_complete BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Pet state ────────────────────────────────────────────────────────────────
-- One row per user; upserted on every tuck-in / rise & shine.
CREATE TABLE IF NOT EXISTS pet_state (
  user_id         UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  happiness_score INTEGER     NOT NULL DEFAULT 80   CHECK (happiness_score BETWEEN 0 AND 100),
  evolution_stage INTEGER     NOT NULL DEFAULT 1    CHECK (evolution_stage BETWEEN 1 AND 5),
  streak_days     INTEGER     NOT NULL DEFAULT 0,
  last_tucked_in  TIMESTAMPTZ,
  last_woken_up   TIMESTAMPTZ,
  graduated       BOOLEAN     NOT NULL DEFAULT FALSE,
  last_updated    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Sleep logs ───────────────────────────────────────────────────────────────
-- One row per user per calendar date.
CREATE TABLE IF NOT EXISTS sleep_logs (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date                DATE        NOT NULL,
  bedtime_timestamp   TIMESTAMPTZ,
  wake_timestamp      TIMESTAMPTZ,
  quality_rating      SMALLINT    CHECK (quality_rating BETWEEN 1 AND 5),
  notes               TEXT,
  duration_hours      NUMERIC(4,2),
  sleep_score         SMALLINT    CHECK (sleep_score BETWEEN 0 AND 100),
  tip_shown           INTEGER,
  UNIQUE (user_id, date)
);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- The app identifies users by a device UUID — no Supabase Auth is used.
-- Policies are permissive so the anon key can read/write freely.
-- Application-level WHERE clauses (eq('user_id', ...)) provide data isolation.

ALTER TABLE users      ENABLE ROW LEVEL SECURITY;
ALTER TABLE pet_state  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon full access" ON users      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON pet_state  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon full access" ON sleep_logs FOR ALL TO anon USING (true) WITH CHECK (true);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS sleep_logs_user_date ON sleep_logs (user_id, date DESC);
