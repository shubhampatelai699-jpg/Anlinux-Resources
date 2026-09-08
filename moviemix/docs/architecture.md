# MovieMix Architecture

## 4-Layer System

```
┌─────────────────────────────────────────────┐
│  Presentation (Expo / Next.js Admin CMS)   │
├─────────────────────────────────────────────┤
│  State & Cache (Zustand + TanStack Query)   │
├─────────────────────────────────────────────┤
│  API & Sync (Supabase PostgREST / EdgeFns)  │
├─────────────────────────────────────────────┤
│  Data (Postgres + Storage + Mux + TMDB)     │
└─────────────────────────────────────────────┘
```

## Data Flow

1. Mobile app requests rails/search/details via Supabase client or Edge Functions.
2. Server-side TMDB proxy fetches TMDB data with rate-limiting and attribution.
3. Mux signed-playback Edge Function issues geo-aware 1h signed playback URLs.
4. Heartbeat Edge Function upserts playback progress every 10s.
5. Razorpay webhook syncs subscription state into `subscriptions`/`profiles`.
