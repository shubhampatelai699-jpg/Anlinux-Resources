-- Follow-up fixes addressing review feedback:
-- 1) Restrict profile reads to the owning user (no more public email exposure).
-- 2) Define the recompute_trending RPC invoked by the trending-recompute Edge Function.

DROP POLICY IF EXISTS "Profiles are viewable" ON profiles;
CREATE POLICY "Users view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON profiles FOR SELECT USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Trending recompute: simple rating-based heuristic over published content.
-- Kept in the database (not the Edge Function) so the scheduled job stays a thin RPC caller.
CREATE OR REPLACE FUNCTION recompute_trending()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE movies
  SET featured = (rating >= 7.5)
  WHERE status = 'published';

  UPDATE series
  SET featured = (rating >= 7.5)
  WHERE status = 'published';
END;
$$;

-- Only the service role (Edge Function) may execute the recompute.
REVOKE ALL ON FUNCTION recompute_trending() FROM PUBLIC;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION recompute_trending() FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON FUNCTION recompute_trending() FROM authenticated';
  END IF;
END $$;
