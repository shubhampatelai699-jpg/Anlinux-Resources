import { supabase } from './supabase';
import type { Database } from '@/src/types/database';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

export type Movie = Database['public']['Tables']['movies']['Row'];
export type Series = Database['public']['Tables']['series']['Row'];
export type Episode = Database['public']['Tables']['episodes']['Row'];

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const authHeader = token ? { Authorization: 'Bearer ' + token } : {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeader,
  };
  const res = await fetch(`${API_BASE}/api/v1${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function fetchFeaturedMovies(): Promise<Movie[]> {
  return api('/movies/featured');
}

export async function fetchMovies(limit = 20): Promise<Movie[]> {
  return api(`/movies?limit=${limit}`);
}

export async function fetchSeries(limit = 20): Promise<Series[]> {
  return api(`/series?limit=${limit}`);
}

export async function fetchMovie(id: string): Promise<Movie> {
  return api(`/movies/${id}`);
}

export async function fetchSeriesWithEpisodes(id: string): Promise<{ series: Series; seasons: any[] }> {
  return api(`/series/${id}`);
}

export async function getSignedPlaybackUrl(contentId: string): Promise<{ url: string; expiration: number }> {
  return api('/playback/signed-url', { method: 'POST', body: JSON.stringify({ contentId }) });
}

export async function addToWatchlist({ movieId, seriesId }: { movieId?: string; seriesId?: string }) {
  const contentId = movieId ?? seriesId;
  if (!contentId) throw new Error('No content id');
  return api('/watchlist', {
    method: 'POST',
    body: JSON.stringify({ contentId, contentType: movieId ? 'movie' : 'series' }),
  });
}

export async function removeFromWatchlist({ movieId, seriesId }: { movieId?: string; seriesId?: string }) {
  const contentId = movieId ?? seriesId;
  if (!contentId) throw new Error('No content id');
  return api(`/watchlist/${movieId ? 'movie' : 'series'}/${contentId}`, { method: 'DELETE' });
}

export async function fetchWatchlist() {
  return api('/watchlist');
}

export async function searchMoviesAndSeries(q: string, type?: 'movie' | 'series', limit = 20) {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (type) params.set('type', type);
  return api(`/search?${params.toString()}`);
}
