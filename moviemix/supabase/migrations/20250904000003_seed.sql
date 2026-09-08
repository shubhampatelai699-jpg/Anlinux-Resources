INSERT INTO genres (slug, name) VALUES
  ('action', 'Action'),
  ('adventure', 'Adventure'),
  ('animation', 'Animation'),
  ('comedy', 'Comedy'),
  ('crime', 'Crime'),
  ('documentary', 'Documentary'),
  ('drama', 'Drama'),
  ('horror', 'Horror'),
  ('romance', 'Romance'),
  ('sci-fi', 'Science Fiction')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO languages (code, name) VALUES
  ('en', 'English'),
  ('hi', 'Hindi'),
  ('es', 'Spanish'),
  ('fr', 'French'),
  ('de', 'German'),
  ('ja', 'Japanese'),
  ('ko', 'Korean'),
  ('zh', 'Chinese'),
  ('ta', 'Tamil'),
  ('te', 'Telugu'),
  ('mr', 'Marathi'),
  ('bn', 'Bengali'),
  ('ml', 'Malayalam'),
  ('kn', 'Kannada')
ON CONFLICT (code) DO NOTHING;
