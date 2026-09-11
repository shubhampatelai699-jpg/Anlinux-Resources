ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE cast_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Published movies are viewable" ON movies FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage movies" ON movies FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Published series are viewable" ON series FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage series" ON series FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Seasons of published series viewable" ON seasons FOR SELECT USING (
  EXISTS (SELECT 1 FROM series WHERE series.id = seasons.series_id AND series.status = 'published')
);
CREATE POLICY "Admins manage seasons" ON seasons FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Episodes of published series viewable" ON episodes FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM seasons JOIN series ON series.id = seasons.series_id
    WHERE seasons.id = episodes.season_id AND series.status = 'published'
  )
);
CREATE POLICY "Admins manage episodes" ON episodes FOR ALL USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Genres are readable" ON genres FOR SELECT USING (TRUE);
CREATE POLICY "Movie genres readable" ON movie_genres FOR SELECT USING (TRUE);
CREATE POLICY "Series genres readable" ON series_genres FOR SELECT USING (TRUE);
CREATE POLICY "Cast members readable" ON cast_members FOR SELECT USING (TRUE);
CREATE POLICY "Movie cast readable" ON movie_cast FOR SELECT USING (TRUE);
CREATE POLICY "Series cast readable" ON series_cast FOR SELECT USING (TRUE);

CREATE POLICY "Users manage own watchlist" ON watchlist FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Users manage own history" ON watch_history FOR ALL USING (auth.uid() = profile_id);

CREATE POLICY "Availability readable" ON content_availability FOR SELECT USING (TRUE);
