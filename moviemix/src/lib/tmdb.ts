import Constants from 'expo-constants';

const TMDB_API_KEY = Constants.expoConfig?.extra?.tmdbApiKey ?? process.env.EXPO_PUBLIC_TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

export function tmdbAttribution() {
  return 'This product uses the TMDB API but is not endorsed or certified by TMDB.';
}

export async function tmdbFetch(path: string, params?: Record<string, string>) {
  const search = new URLSearchParams({ api_key: TMDB_API_KEY as string, ...params });
  const res = await fetch(`${TMDB_BASE}${path}?${search.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}
