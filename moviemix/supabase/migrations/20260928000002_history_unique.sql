-- Keep one progress record per user and title, including concurrent devices.
DELETE FROM watch_history a USING watch_history b
WHERE a.profile_id = b.profile_id AND a.movie_id = b.movie_id
  AND a.movie_id IS NOT NULL AND (a.updated_at, a.id) < (b.updated_at, b.id);
DELETE FROM watch_history a USING watch_history b
WHERE a.profile_id = b.profile_id AND a.episode_id = b.episode_id
  AND a.episode_id IS NOT NULL AND (a.updated_at, a.id) < (b.updated_at, b.id);
CREATE UNIQUE INDEX watch_history_one_movie ON watch_history(profile_id, movie_id) WHERE movie_id IS NOT NULL;
CREATE UNIQUE INDEX watch_history_one_episode ON watch_history(profile_id, episode_id) WHERE episode_id IS NOT NULL;
