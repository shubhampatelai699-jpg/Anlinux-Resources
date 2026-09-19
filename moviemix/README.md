# MovieMix

A streaming platform prototype built with Expo SDK 51, Supabase, Mux, Zustand, and TanStack Query.

## Quick Start

```bash
cd moviemix
cp .env.example .env
npm install
npx expo start
```

## Folder Map

```
app/              Expo Router v3 typed routes
src/components    Reusable UI components
src/lib           Supabase client, API, storage, query client, TMDB
src/store         Zustand stores (auth, ui, player)
src/theme         Design tokens, typography, ThemeProvider
src/types         Database types stub
supabase/         Config, migrations, Edge Functions
admin/            Next.js 14 admin CMS
.github/workflows CI workflow
docs/             Architecture, spec, compliance, plan
```

## Environment Variables

See `.env.example` for required keys. Never hardcode secrets.

## Compliance

- TMDB attribution required on all public surfaces.
- Mux playback uses signed URLs with 1h TTL.
- Razorpay webhooks verify HMAC signatures.
