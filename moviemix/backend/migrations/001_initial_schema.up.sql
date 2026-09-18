-- MovieMix v1.0 — Initial PostgreSQL Schema
-- Migration: 001_initial_schema.up.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Core enums
-- ---------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');
CREATE TYPE content_status AS ENUM ('DRAFT', 'PROCESSING', 'READY', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');
CREATE TYPE content_type AS ENUM ('MOVIE', 'SERIES', 'EPISODE');
CREATE TYPE streaming_protocol AS ENUM ('HLS', 'DASH');
CREATE TYPE asset_type AS ENUM ('POSTER', 'BACKDROP', 'THUMBNAIL', 'TRAILER', 'VIDEO', 'SUBTITLE', 'AUDIO');
CREATE TYPE asset_status AS ENUM ('UPLOADING', 'PROCESSING', 'READY', 'FAILED');
CREATE TYPE playback_protocol AS ENUM ('HLS', 'DASH');

-- ---------------------------------------------------------------------------
-- Users & identity
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,
    password_hash TEXT,
    display_name VARCHAR(120),
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'USER',
    status user_status NOT NULL DEFAULT 'ACTIVE',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE oauth_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(provider, provider_user_id)
);

CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- ---------------------------------------------------------------------------
-- Catalog: genres
-- ---------------------------------------------------------------------------
CREATE TABLE genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_genres_slug ON genres(slug);

-- ---------------------------------------------------------------------------
-- Catalog: movies
-- ---------------------------------------------------------------------------
CREATE TABLE movies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    runtime_seconds INTEGER,
    age_rating VARCHAR(20),
    language VARCHAR(20),
    country VARCHAR(100),
    rating NUMERIC(3,1),
    content_tier VARCHAR(30) NOT NULL DEFAULT 'FREE',
    status content_status NOT NULL DEFAULT 'DRAFT',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_movies_status ON movies(status);
CREATE INDEX idx_movies_featured ON movies(featured);
CREATE INDEX idx_movies_published_at ON movies(published_at);
CREATE INDEX idx_movies_slug ON movies(slug);

CREATE TABLE movie_genres (
    movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (movie_id, genre_id)
);

CREATE INDEX idx_movie_genres_genre_id ON movie_genres(genre_id);

-- ---------------------------------------------------------------------------
-- Catalog: series, seasons, episodes
-- ---------------------------------------------------------------------------
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) UNIQUE NOT NULL,
    description TEXT,
    release_date DATE,
    age_rating VARCHAR(20),
    language VARCHAR(20),
    country VARCHAR(100),
    rating NUMERIC(3,1),
    content_tier VARCHAR(30) NOT NULL DEFAULT 'FREE',
    status content_status NOT NULL DEFAULT 'DRAFT',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_series_status ON series(status);
CREATE INDEX idx_series_featured ON series(featured);
CREATE INDEX idx_series_slug ON series(slug);

CREATE TABLE series_genres (
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id) ON DELETE CASCADE,
    PRIMARY KEY (series_id, genre_id)
);

CREATE INDEX idx_series_genres_genre_id ON series_genres(genre_id);

CREATE TABLE seasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    season_number INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(series_id, season_number)
);

CREATE INDEX idx_seasons_series_id ON seasons(series_id);

CREATE TABLE episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    runtime_seconds INTEGER,
    release_date DATE,
    content_tier VARCHAR(30) NOT NULL DEFAULT 'FREE',
    status content_status NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(season_id, episode_number)
);

CREATE INDEX idx_episodes_season_id ON episodes(season_id);
CREATE INDEX idx_episodes_status ON episodes(status);

-- ---------------------------------------------------------------------------
-- Media assets
-- ---------------------------------------------------------------------------
CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type content_type NOT NULL,
    owner_id UUID NOT NULL,
    asset_type asset_type NOT NULL,
    storage_key TEXT NOT NULL,
    cdn_url TEXT,
    mime_type VARCHAR(150),
    file_size_bytes BIGINT,
    width INTEGER,
    height INTEGER,
    duration_seconds INTEGER,
    language VARCHAR(20),
    status asset_status NOT NULL DEFAULT 'READY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_assets_owner ON media_assets(owner_type, owner_id);
CREATE INDEX idx_media_assets_asset_type ON media_assets(asset_type);

CREATE TABLE video_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
    protocol playback_protocol NOT NULL,
    manifest_url TEXT NOT NULL,
    drm_type VARCHAR(30),
    status asset_status NOT NULL DEFAULT 'READY',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_video_assets_media_asset_id ON video_assets(media_asset_id);

CREATE TABLE subtitle_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_asset_id UUID NOT NULL REFERENCES video_assets(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(100),
    format VARCHAR(20) NOT NULL,
    storage_key TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_subtitle_assets_video_asset_id ON subtitle_assets(video_asset_id);

CREATE TABLE audio_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_asset_id UUID NOT NULL REFERENCES video_assets(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    label VARCHAR(100),
    codec VARCHAR(50),
    is_default BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_audio_tracks_video_asset_id ON audio_tracks(video_asset_id);

-- ---------------------------------------------------------------------------
-- User engagement
-- ---------------------------------------------------------------------------
CREATE TABLE watchlist (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    content_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY(user_id, content_type, content_id),
    CHECK (content_type IN ('MOVIE', 'SERIES'))
);

CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);

CREATE TABLE watch_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    content_id UUID NOT NULL,
    position_seconds BIGINT NOT NULL DEFAULT 0,
    duration_seconds BIGINT,
    percentage NUMERIC(5,2),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, content_type, content_id),
    CHECK (content_type IN ('MOVIE', 'EPISODE'))
);

CREATE INDEX idx_watch_progress_user_id ON watch_progress(user_id);
CREATE INDEX idx_watch_progress_content ON watch_progress(content_type, content_id);

CREATE TABLE watch_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    content_id UUID NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (content_type IN ('MOVIE', 'EPISODE'))
);

CREATE INDEX idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX idx_watch_history_watched_at ON watch_history(watched_at DESC);

-- ---------------------------------------------------------------------------
-- Playback sessions
-- ---------------------------------------------------------------------------
CREATE TABLE playback_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type content_type NOT NULL,
    content_id UUID NOT NULL,
    manifest_url TEXT,
    protocol playback_protocol,
    device_id VARCHAR(255),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_heartbeat_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (content_type IN ('MOVIE', 'EPISODE'))
);

CREATE INDEX idx_playback_sessions_user_id ON playback_sessions(user_id);
CREATE INDEX idx_playback_sessions_active ON playback_sessions(user_id, ended_at) WHERE ended_at IS NULL;

-- ---------------------------------------------------------------------------
-- Audit logs
-- ---------------------------------------------------------------------------
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
