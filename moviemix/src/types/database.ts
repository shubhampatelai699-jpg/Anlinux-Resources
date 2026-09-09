export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'admin';
          created_at: string;
        };
      };
      movies: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          release_year: number | null;
          runtime: number | null;
          rating: number | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          created_at: string;
        };
      };
      series: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          release_year: number | null;
          rating: number | null;
          status: 'draft' | 'published' | 'archived';
          featured: boolean;
          created_at: string;
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
          duration: number | null;
          video_url: string | null;
          subtitle_data: Json | null;
        };
      };
      genres: {
        Row: { id: string; name: string };
      };
      movie_genres: {
        Row: { movie_id: string; genre_id: string };
      };
      series_genres: {
        Row: { series_id: string; genre_id: string };
      };
      watchlist: {
        Row: {
          user_id: string;
          movie_id: string | null;
          series_id: string | null;
          created_at: string;
        };
      };
      watch_history: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string | null;
          episode_id: string | null;
          progress_seconds: number;
          completed: boolean;
          updated_at: string;
        };
      };
    };
  };
}
