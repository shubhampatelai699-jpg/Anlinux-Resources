# Compliance

## TMDB
- All TMDB requests are routed through the `tmdb-proxy` Edge Function.
- Attribution footer appears on auth screens and in API headers.
- Poster/backdrop assets are served from TMDB image CDN with attribution.

## DRM / Playback
- Mux signed URLs expire after 1 hour.
- Geo-aware licensing enforced by `signed-playback` Edge Function.
- Playback tokens are never stored client-side.

## IAP / Subscriptions
- Razorpay webhook verifies HMAC signatures before updating state.
- Subscription status lives in `profiles.subscription_status`.
- Admin role is stored in JWT `app_metadata.role`, never in `profiles.role` directly.
