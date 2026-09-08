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

  const geo = req.headers.get('x-real-ip') ?? 'unknown';
  const muxTokenId = Deno.env.get('MUX_TOKEN_ID');
  const muxTokenSecret = Deno.env.get('MUX_TOKEN_SECRET');

  // 1h TTL signed URL via Mux Signing Keys
  const expiration = Math.floor(Date.now() / 1000) + 3600;
  const payload = `${contentId}:${episodeId ?? ''}:${user.id}:${expiration}`;
  const signature = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload + muxTokenSecret));
  const hex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, '0')).join('');

  const url = `https://stream.mux.com/${contentId}.m3u8?token=${muxTokenId}:${hex}:exp=${expiration}`;

  return new Response(JSON.stringify({ url, expiration, geo }), { headers: { 'Content-Type': 'application/json' } });
});
