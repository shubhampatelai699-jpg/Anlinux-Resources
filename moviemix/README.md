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

For playback, apply the Supabase migrations and populate `movies.mux_playback_id` or
`episodes.mux_playback_id` with the **signed** Mux playback ID of each licensed title.
Configure the `signed-playback` Edge Function with `MUX_SIGNING_KEY_ID` and
`MUX_SIGNING_PRIVATE_KEY` (base64-encoded PEM private key), then deploy that function
and `heartbeat`. The mobile player authenticates both functions with its Supabase session.
The former NestJS `/playback/signed-url` route is disabled because its HMAC URL is
not a valid Mux signed playback URL. Do not reuse Mux asset IDs as playback IDs.

To verify JWT signing locally with Node 24 or newer:

```bash
node --test supabase/functions/signed-playback/mux-token.test.mjs
```

## Compliance

- TMDB attribution required on all public surfaces.
- Mux playback uses RS256 signed URLs with an expiry long enough for the title.
- Razorpay webhooks verify HMAC signatures.
