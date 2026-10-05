import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const RATE_LIMIT = 9; // requests per second
const ipMap = new Map<string, number[]>();

function isValidPath(path: string) {
  return path.startsWith('/') && !path.includes('@') && !path.includes('://') && !path.includes('\0');
}

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path || !isValidPath(path)) return new Response('Invalid path', { status: 400 });

  const ip = req.headers.get('x-real-ip') ?? 'anonymous';
  const now = Date.now();
  let hits = ipMap.get(ip) ?? [];
  hits = hits.filter((t) => now - t < 1000);
  if (hits.length >= RATE_LIMIT) return new Response('Rate limit exceeded', { status: 429 });
  hits.push(now);
  ipMap.set(ip, hits);

  const tmdbKey = Deno.env.get('TMDB_API_KEY');
  if (!tmdbKey) return new Response('TMDB not configured', { status: 500 });

  const tmdbUrl = new URL(path, 'https://api.themoviedb.org/3/');
  url.searchParams.forEach((v, k) => {
    if (k !== 'path') tmdbUrl.searchParams.set(k, v);
  });
  tmdbUrl.searchParams.set('api_key', tmdbKey);

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
