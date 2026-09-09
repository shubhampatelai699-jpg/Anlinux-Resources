-- MovieMix v1.0 — Rollback Initial PostgreSQL Schema
-- Migration: 001_initial_schema.down.sql

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS playback_sessions;
DROP TABLE IF EXISTS watch_history;
DROP TABLE IF EXISTS watch_progress;
DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS audio_tracks;
DROP TABLE IF EXISTS subtitle_assets;
DROP TABLE IF EXISTS video_assets;
DROP TABLE IF EXISTS media_assets;
DROP TABLE IF EXISTS episodes;
DROP TABLE IF EXISTS seasons;
DROP TABLE IF EXISTS series_genres;
DROP TABLE IF EXISTS series;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS oauth_accounts;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS asset_status;
DROP TYPE IF EXISTS asset_type;
DROP TYPE IF EXISTS playback_protocol;
DROP TYPE IF EXISTS streaming_protocol;
DROP TYPE IF EXISTS content_type;
DROP TYPE IF EXISTS content_status;
DROP TYPE IF EXISTS user_status;
DROP TYPE IF EXISTS user_role;
