import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  let body: { movieId?: unknown; episodeId?: unknown; positionSeconds?: unknown; completed?: unknown };
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { movieId, episodeId, positionSeconds, completed = false } = body ?? {};
  if ((!!movieId === !!episodeId) ||
      (movieId != null && (typeof movieId !== 'string' || !uuid.test(movieId))) ||
      (episodeId != null && (typeof episodeId !== 'string' || !uuid.test(episodeId))) ||
      typeof positionSeconds !== 'number' || !Number.isFinite(positionSeconds) ||
      positionSeconds < 0 || positionSeconds > 86400 || typeof completed !== 'boolean') {
    return json({ error: 'Invalid progress' }, 400);
  }
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: 'Unauthorized' }, 401);

  const column = movieId ? 'movie_id' : 'episode_id';
  const id = (movieId ?? episodeId) as string;
  const { data: previous, error: lookupError } = await supabase.from('watch_history')
    .select('id').eq('profile_id', user.id).eq(column, id).maybeSingle();
  if (lookupError) return json({ error: 'Progress lookup failed' }, 500);
  const progress = { progress_seconds: Math.floor(positionSeconds), completed, updated_at: new Date().toISOString() };
  const result = previous
    ? await supabase.from('watch_history').update(progress).eq('id', previous.id)
    : await supabase.from('watch_history').insert({ profile_id: user.id, [column]: id, ...progress });
  if (result.error) return json({ error: 'Progress save failed' }, 500);
  return json({ ok: true });
});
