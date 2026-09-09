INSERT INTO genres (name) VALUES
  ('Action'),
  ('Adventure'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Documentary'),
  ('Drama'),
  ('Horror'),
  ('Romance'),
  ('Science Fiction')
ON CONFLICT (name) DO NOTHING;
