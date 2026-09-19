export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          subscription_status: 'inactive' | 'active' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          profile_id: string;
          provider: string;
          provider_subscription_id: string | null;
          status: 'active' | 'cancelled' | 'past_due';
          current_period_end: string | null;
          created_at: string;
        };
      };
      genres: {
        Row: { id: string; name: string; slug: string };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          trailer_url: string | null;
          release_year: number | null;
          runtime_minutes: number | null;
          rating: number | null;
          language_code: string | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          video_asset_id: string | null;
          hls_manifest_url: string | null;
          drm_required: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      series: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          trailer_url: string | null;
          release_year: number | null;
          rating: number | null;
          language_code: string | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      seasons: {
        Row: {
          id: string;
          series_id: string;
          season_number: number;
          title: string | null;
        };
      };
      episodes: {
        Row: {
          id: string;
          season_id: string;
          episode_number: number;
          title: string | null;
          description: string | null;
          thumbnail_url: string | null;
          duration_seconds: number | null;
          video_asset_id: string | null;
          hls_manifest_url: string | null;
        };
      };
      movie_genres: {
        Row: { movie_id: string; genre_id: string };
      };
      series_genres: {
        Row: { series_id: string; genre_id: string };
      };
      cast_members: {
        Row: { id: string; name: string; photo_url: string | null; bio: string | null };
      };
      movie_cast: {
        Row: { movie_id: string; cast_member_id: string; role_name: string | null };
      };
      series_cast: {
        Row: { series_id: string; cast_member_id: string; role_name: string | null };
      };
      watchlist: {
        Row: {
          profile_id: string;
          content_id: string;
          content_type: 'movie' | 'series';
          created_at: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          profile_id: string;
          movie_id: string | null;
          episode_id: string | null;
          progress_seconds: number;
          completed: boolean;
          updated_at: string;
        };
      };
      content_availability: {
        Row: {
          id: string;
          content_id: string;
          content_type: 'movie' | 'series';
          region_code: string;
          available_from: string;
          available_until: string | null;
        };
      };
    };
  };
}
