-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playback_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Contents
CREATE POLICY "Published contents are viewable" ON contents FOR SELECT USING (published = TRUE AND archived = FALSE);
CREATE POLICY "Admins can manage contents" ON contents FOR ALL USING ((auth.jwt() ->> 'app_metadata')::JSONB ->> 'role' = 'admin');

-- Genres / Languages
CREATE POLICY "Genres are readable" ON genres FOR SELECT USING (TRUE);
CREATE POLICY "Languages are readable" ON languages FOR SELECT USING (TRUE);

-- Watchlists
CREATE POLICY "Users can manage own watchlist" ON watchlists FOR ALL USING (auth.uid() = profile_id);

-- Playback progress
CREATE POLICY "Users can manage own playback progress" ON playback_progress FOR ALL USING (auth.uid() = profile_id);

-- Subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = profile_id);

-- Helper trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, COALESCE((NEW.raw_app_meta_data ->> 'role'), 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
