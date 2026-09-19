import { supabase } from './supabase';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';

// DTO types matching the NestJS backend (Prisma camelCase serialization).
export type Movie = {
  id: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  releaseYear: number | null;
  runtimeMinutes: number | null;
  rating: string | number | null;
  languageCode: string | null;
  status: string;
  featured: boolean;
  videoAssetId: string | null;
  hlsManifestUrl: string | null;
  drmRequired: boolean;
};

export type Series = {
  id: string;
  title: string;
  description: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerUrl: string | null;
  releaseYear: number | null;
  rating: string | number | null;
  languageCode: string | null;
  status: string;
  featured: boolean;
};

export type Episode = {
  id: string;
  seasonId: string;
  episodeNumber: number;
  title: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  videoAssetId: string | null;
  hlsManifestUrl: string | null;
};

export type Season = {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string | null;
  episodes: Episode[];
};

export type SeriesDetail = Series & { seasons: Season[] };

export type Genre = { id: string; name: string; slug: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(`${API_BASE}/api/v1${path}`, { ...init, headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function fetchFeaturedMovies(): Promise<Movie[]> {
  return api('/movies/featured');
}

export async function fetchFeaturedSeries(): Promise<Series[]> {
  return api('/series/featured');
}

export async function fetchMovies(
  limit = 20,
  genreId?: string,
  languageCode?: string,
): Promise<Movie[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (genreId) params.set('genre', genreId);
  if (languageCode) params.set('language', languageCode);
  return api(`/movies?${params.toString()}`);
}

export async function fetchSeries(
  limit = 20,
  genreId?: string,
  languageCode?: string,
): Promise<Series[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (genreId) params.set('genre', genreId);
  if (languageCode) params.set('language', languageCode);
  return api(`/series?${params.toString()}`);
}

export async function fetchGenres(): Promise<Genre[]> {
  return api('/genres');
}

export async function fetchMovie(id: string): Promise<Movie> {
  return api(`/movies/${id}`);
}

export async function fetchSeriesWithEpisodes(
  id: string,
): Promise<SeriesDetail> {
  return api(`/series/${id}`);
}

export async function getSignedPlaybackUrl(
  contentId: string,
): Promise<{ url: string; expiration: number }> {
  return api('/playback/signed-url', {
    method: 'POST',
    body: JSON.stringify({ contentId }),
  });
}

export async function addToWatchlist({
  movieId,
  seriesId,
}: {
  movieId?: string;
  seriesId?: string;
}) {
  const contentId = movieId ?? seriesId;
  if (!contentId) throw new Error('No content id');
  return api('/watchlist', {
    method: 'POST',
    body: JSON.stringify({
      contentId,
      contentType: movieId ? 'movie' : 'series',
    }),
  });
}

export async function removeFromWatchlist({
  movieId,
  seriesId,
}: {
  movieId?: string;
  seriesId?: string;
}) {
  const contentId = movieId ?? seriesId;
  if (!contentId) throw new Error('No content id');
  return api(`/watchlist/${movieId ? 'movie' : 'series'}/${contentId}`, {
    method: 'DELETE',
  });
}

export type WatchlistItem = {
  contentId: string;
  contentType: 'movie' | 'series';
  createdAt: string;
  movie: { title: string; posterUrl: string | null } | null;
  series: { title: string; posterUrl: string | null } | null;
};

export async function fetchWatchlist(): Promise<WatchlistItem[]> {
  return api('/watchlist');
}

export type SearchResults = { movies: Movie[]; series: Series[] };

export async function searchMoviesAndSeries(
  q: string,
  type?: 'movie' | 'series',
  limit = 20,
): Promise<SearchResults> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  if (type) params.set('type', type);
  return api(`/search?${params.toString()}`);
}
