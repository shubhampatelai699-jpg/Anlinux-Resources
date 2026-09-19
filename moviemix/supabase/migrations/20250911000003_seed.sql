INSERT INTO genres (name, slug) VALUES
  ('Action', 'action'),
  ('Adventure', 'adventure'),
  ('Animation', 'animation'),
  ('Comedy', 'comedy'),
  ('Crime', 'crime'),
  ('Documentary', 'documentary'),
  ('Drama', 'drama'),
  ('Horror', 'horror'),
  ('Romance', 'romance'),
  ('Science Fiction', 'science-fiction')
ON CONFLICT (slug) DO NOTHING;
