import { supabase } from './supabase';
import type { Database } from '@/src/types/database';

export type Movie = Database['public']['Tables']['movies']['Row'];
export type Series = Database['public']['Tables']['series']['Row'];
export type Episode = Database['public']['Tables']['episodes']['Row'];

export async function fetchFeaturedMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return (data ?? []) as Movie[];
}

export async function fetchMovies(limit = 20) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Movie[];
}

export async function fetchSeries(limit = 20) {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Series[];
}

export async function fetchMovie(id: string) {
  const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Movie;
}

export async function fetchSeriesWithEpisodes(id: string) {
  const { data: series, error: seriesError } = await supabase.from('series').select('*').eq('id', id).single();
  if (seriesError) throw seriesError;
  const { data: seasons, error: seasonsError } = await supabase
    .from('seasons')
    .select('*, episodes(*)')
    .eq('series_id', id)
    .order('season_number', { ascending: true });
  if (seasonsError) throw seasonsError;
  return { series: series as Series, seasons: seasons ?? [] };
}

export async function getSignedPlaybackUrl(contentId: string) {
  const { data, error } = await supabase.functions.invoke('signed-playback', { body: { contentId } });
  if (error) throw error;
  return data as { url: string; expiration: number };
}

export async function addToWatchlist({ movieId, seriesId }: { movieId?: string; seriesId?: string }) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Unauthorized');
  const { error } = await supabase.from('watchlist').upsert(
    { user_id: userData.user.id, movie_id: movieId ?? null, series_id: seriesId ?? null },
    { onConflict: 'user_id, movie_id, series_id' }
  );
  if (error) throw error;
}

export async function removeFromWatchlist({ movieId, seriesId }: { movieId?: string; seriesId?: string }) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Unauthorized');
  let query = supabase.from('watchlist').delete().eq('user_id', userData.user.id);
  if (movieId) query = query.eq('movie_id', movieId);
  if (seriesId) query = query.eq('series_id', seriesId);
  const { error } = await query;
  if (error) throw error;
}

export async function fetchWatchlist() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Unauthorized');
  const { data, error } = await supabase
    .from('watchlist')
    .select('movie_id, series_id, movies(*), series(*)')
    .eq('user_id', userData.user.id);
  if (error) throw error;
  return data ?? [];
}
