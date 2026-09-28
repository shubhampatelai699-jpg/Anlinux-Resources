import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';
import { signMuxPlaybackToken } from './mux-token.ts';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  let body: { contentId?: unknown; episodeId?: unknown };
  try { body = await req.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }
  const { contentId, episodeId } = body ?? {};
  if (typeof contentId !== 'string' || !uuid.test(contentId) ||
      (episodeId != null && (typeof episodeId !== 'string' || !uuid.test(episodeId)))) {
    return json({ error: 'Invalid content ID' }, 400);
  }
  const authorization = req.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401);
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return json({ error: 'Unauthorized' }, 401);

  let playbackId: string | null = null;
  let duration = 0;
  if (episodeId) {
    const { data: episode, error } = await supabase.from('episodes')
      .select('season_id,mux_playback_id,duration_seconds').eq('id', episodeId).maybeSingle();
    if (error) return json({ error: 'Playback lookup failed' }, 500);
    if (!episode) return json({ error: 'Episode unavailable' }, 404);
    const { data: season, error: seasonError } = await supabase.from('seasons')
      .select('series_id').eq('id', episode.season_id).maybeSingle();
    if (seasonError) return json({ error: 'Playback lookup failed' }, 500);
    if (season?.series_id !== contentId) return json({ error: 'Episode unavailable' }, 404);
    const { data: series, error: seriesError } = await supabase.from('series')
      .select('status').eq('id', contentId).maybeSingle();
    if (seriesError) return json({ error: 'Playback lookup failed' }, 500);
    if (series?.status !== 'published') return json({ error: 'Series unavailable' }, 404);
    playbackId = episode.mux_playback_id;
    duration = episode.duration_seconds ?? 0;
  } else {
    const { data: movie, error } = await supabase.from('movies')
      .select('status,mux_playback_id,runtime_minutes,drm_required').eq('id', contentId).maybeSingle();
    if (error) return json({ error: 'Playback lookup failed' }, 500);
    if (movie?.status !== 'published') return json({ error: 'Movie unavailable' }, 404);
    if (movie.drm_required) return json({ error: 'Protected playback is not configured' }, 409);
    playbackId = movie.mux_playback_id;
    duration = (movie.runtime_minutes ?? 0) * 60;
  }
  if (!playbackId || !/^[A-Za-z0-9_-]+$/.test(playbackId)) {
    return json({ error: 'Playback asset unavailable' }, 404);
  }
  const keyId = Deno.env.get('MUX_SIGNING_KEY_ID');
  const privateKey = Deno.env.get('MUX_SIGNING_PRIVATE_KEY');
  if (!keyId || !privateKey) return json({ error: 'Playback signing not configured' }, 503);
  const expiration = Math.floor(Date.now() / 1000) + Math.max(14400, duration + 900);
  try {
    const token = signMuxPlaybackToken(playbackId, keyId, privateKey, expiration);
    return json({ url: `https://stream.mux.com/${playbackId}.m3u8?token=${token}`, expiration });
  } catch {
    return json({ error: 'Playback signing failed' }, 503);
  }
});
