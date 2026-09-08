# MovieMix Implementation Plan

## Phase 1 — Foundation (Weeks 1–4)
- Expo SDK 51 + Expo Router v3 scaffold.
- Supabase project setup: migrations, RLS, storage buckets.
- Shared libs (supabase, queryClient, storage, api, tmdb).
- Theme tokens, typography, ThemeProvider.
- Auth screens and Zustand auth store.
- TMDB proxy Edge Function.

## Phase 2 — Browse & Discovery (Weeks 5–10)
- HeroBanner + HorizontalRail + MovieCard.
- Trending screen + cron Edge Function.
- Search + search-suggest Edge Function.
- Detail screens: movie, series, person, genre, language.
- Watchlist grid and actions.

## Phase 3 — Playback & Subscriptions (Weeks 11–16)
- Player screen with expo-video and Mux HLS.
- Heartbeat Edge Function.
- Razorpay webhook + subscription UI.
- Player settings store.

## Phase 4 — Admin CMS (Weeks 17–20)
- Next.js 14 admin app.
- Role-gated login, dashboard, movies table.
- admin-promote Edge Function.

## Phase 5 — Polish & Compliance (Weeks 21–24)
- Attribution and compliance docs.
- Performance tuning (MMKV caching, query stale time).
- Tests and EAS production build.
