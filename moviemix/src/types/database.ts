// Regenerate via: npm run db:types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          role: 'user' | 'admin';
          subscription_status: 'inactive' | 'active' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
      };
      contents: {
        Row: {
          id: string;
          title: string;
          type: 'movie' | 'series';
          poster_url: string | null;
          backdrop_url: string | null;
          published: boolean;
          created_at: string;
        };
      };
      watchlists: {
        Row: {
          profile_id: string;
          content_id: string;
          watched: boolean;
          created_at: string;
        };
      };
    };
  };
}
