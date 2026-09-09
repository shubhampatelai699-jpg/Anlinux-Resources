ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE series_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

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

CREATE POLICY "Users manage own watchlist" ON watchlist FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own history" ON watch_history FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'display_name', COALESCE(NEW.raw_app_meta_data ->> 'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
