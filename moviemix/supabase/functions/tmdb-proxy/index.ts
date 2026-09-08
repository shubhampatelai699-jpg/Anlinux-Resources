import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RATE_LIMIT = 9; // requests per second
const ipMap = new Map<string, number[]>();

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) return new Response('Missing path', { status: 400 });

  const ip = req.headers.get('x-real-ip') ?? 'anonymous';
  const now = Date.now();
  const hits = ipMap.get(ip) ?? [];
  const recent = hits.filter((t) => now - t < 1000);
  if (recent.length >= RATE_LIMIT) return new Response('Rate limit exceeded', { status: 429 });
  recent.push(now);
  ipMap.set(ip, recent);

  const tmdbKey = Deno.env.get('TMDB_API_KEY');
  const tmdbUrl = new URL(`https://api.themoviedb.org/3${path}`);
  url.searchParams.forEach((v, k) => {
    if (k !== 'path') tmdbUrl.searchParams.set(k, v);
  });
  tmdbUrl.searchParams.set('api_key', tmdbKey!);

  const res = await fetch(tmdbUrl.toString());
  const body = await res.text();

  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type': 'application/json',
      'X-TMDB-Attribution': 'This product uses the TMDB API but is not endorsed or certified by TMDB.',
    },
  });
});
