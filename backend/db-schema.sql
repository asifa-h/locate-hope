-- PostgreSQL schema for LocateHope

CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user', -- user | admin | ngo
  trust_score INTEGER NOT NULL DEFAULT 0,
  total_reports INTEGER NOT NULL DEFAULT 0,
  verified_reports INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organizations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- NGO | Shelter | OldAgeHome | RehabCenter | FoodBank | CommunityCenter
  phone TEXT,
  capacity_total INTEGER DEFAULT 0,
  capacity_available INTEGER DEFAULT 0,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS organizations_location_idx
  ON organizations USING gist (ll_to_earth(latitude, longitude));

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  description TEXT NOT NULL,
  urgency TEXT NOT NULL, -- low | medium | emergency
  notes TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  media_path TEXT,
  media_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected | assigned | in_progress | resolved
  assigned_ngo_id INTEGER REFERENCES organizations(id),
  rejection_reason TEXT,
  is_duplicate_of INTEGER REFERENCES reports(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS reports_user_idx ON reports(user_id);
CREATE INDEX IF NOT EXISTS reports_location_idx
  ON reports USING gist (ll_to_earth(latitude, longitude));

CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  coupon_code TEXT,
  sponsor TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  total_available INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  reward_id INTEGER NOT NULL REFERENCES rewards(id),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

