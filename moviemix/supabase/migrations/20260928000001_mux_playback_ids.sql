-- An asset ID cannot be used as a signed playback ID.
ALTER TABLE movies ADD COLUMN IF NOT EXISTS mux_playback_id TEXT;
ALTER TABLE episodes ADD COLUMN IF NOT EXISTS mux_playback_id TEXT;
