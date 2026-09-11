import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.0';

serve(async (req) => {
  const { contentId, episodeId } = await req.json();
  const authHeader = req.headers.get('Authorization')!;
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return new Response('Unauthorized', { status: 401 });

  const muxTokenSecret = Deno.env.get('MUX_TOKEN_SECRET');
  if (!muxTokenSecret) return new Response('Playback signing not configured', { status: 500 });

  const geo = req.headers.get('x-real-ip') ?? 'unknown';
  const expiration = Math.floor(Date.now() / 1000) + 3600;
  const payload = `${contentId}:${episodeId ?? ''}:${user.id}:${expiration}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(muxTokenSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const token = btoa(String.fromCharCode(...new Uint8Array(signature)));

  const url = `${Deno.env.get('CDN_BASE_URL')}/${contentId}.m3u8?token=${encodeURIComponent(token)}&exp=${expiration}`;

  return new Response(JSON.stringify({ url, expiration, geo }), { headers: { 'Content-Type': 'application/json' } });
});
