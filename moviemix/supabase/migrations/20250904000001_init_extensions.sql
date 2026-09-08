-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";

-- Genres
CREATE TABLE IF NOT EXISTS genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Languages
CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_status TEXT NOT NULL DEFAULT 'inactive' CHECK (subscription_status IN ('inactive', 'active', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contents (movies/series)
CREATE TABLE IF NOT EXISTS contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('movie', 'series')),
  title TEXT NOT NULL,
  overview TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  release_date DATE,
  runtime INTEGER CHECK (runtime >= 0),
  language_code TEXT REFERENCES languages(code),
  published BOOLEAN DEFAULT FALSE,
  archived BOOLEAN DEFAULT FALSE,
  vote_average NUMERIC(3,1) CHECK (vote_average BETWEEN 0 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content genres junction
CREATE TABLE IF NOT EXISTS content_genres (
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, genre_id)
);

-- Seasons
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  number INTEGER NOT NULL CHECK (number > 0),
  title TEXT,
  UNIQUE (content_id, number)
);

-- Episodes
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID REFERENCES seasons(id) ON DELETE CASCADE,
  number INTEGER NOT NULL CHECK (number > 0),
  title TEXT,
  synopsis TEXT,
  duration INTEGER CHECK (duration >= 0),
  mux_asset_id TEXT,
  UNIQUE (season_id, number)
);

-- People
CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  profile_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credits
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('actor', 'director', 'writer', 'producer')),
  character_name TEXT,
  UNIQUE (content_id, person_id, role)
);

-- Watchlists
CREATE TABLE IF NOT EXISTS watchlists (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, content_id)
);

-- Playback progress
CREATE TABLE IF NOT EXISTS playback_progress (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  position_seconds INTEGER NOT NULL DEFAULT 0 CHECK (position_seconds >= 0),
  completed BOOLEAN DEFAULT FALSE,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (profile_id, content_id, COALESCE(episode_id, '00000000-0000-0000-0000-000000000000'::UUID))
);

-- Trending scores
CREATE TABLE IF NOT EXISTS trending_scores (
  content_id UUID PRIMARY KEY REFERENCES contents(id) ON DELETE CASCADE,
  score_24h NUMERIC DEFAULT 0,
  score_7d NUMERIC DEFAULT 0,
  score_30d NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FTS indexes
CREATE INDEX IF NOT EXISTS contents_title_fts ON contents USING GIN (to_tsvector('english', title || ' ' || COALESCE(overview, '')));
CREATE INDEX IF NOT EXISTS people_name_trgm ON people USING GIN (name gin_trgm_ops);

-- Updated at trigger helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER contents_updated_at BEFORE UPDATE ON contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RPC helpers
CREATE OR REPLACE FUNCTION search_movies_series_people(query_text TEXT)
RETURNS TABLE (id UUID, type TEXT, title TEXT, poster_url TEXT, rank REAL) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, 'content'::TEXT, c.title, c.poster_url,
         ts_rank(to_tsvector('english', c.title || ' ' || COALESCE(c.overview, '')), plainto_tsquery('english', query_text))::REAL AS rank
  FROM contents c
  WHERE c.published = TRUE
    AND to_tsvector('english', c.title || ' ' || COALESCE(c.overview, '')) @@ plainto_tsquery('english', query_text)
  UNION ALL
  SELECT p.id, 'person'::TEXT, p.name, p.profile_url,
         similarity(p.name, query_text)::REAL AS rank
  FROM people p
  WHERE p.name % query_text
  ORDER BY rank DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql STABLE;
