import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

serve(async (req) => {
  const { movieId, episodeId, positionSeconds, completed = false } = await req.json();
  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  const { error } = await supabase.from('watch_history').upsert({
    user_id: user.id,
    movie_id: movieId ?? null,
    episode_id: episodeId ?? null,
    progress_seconds: Math.max(0, positionSeconds),
    completed,
    updated_at: new Date().toISOString(),
  }, {
    onConflict: 'id',
    ignoreDuplicates: false,
  });

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
