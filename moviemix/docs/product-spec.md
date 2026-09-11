# MovieMix Product Spec v1.0 (Locked)

## Core Experience
- **Authentication**: email/password, Google OAuth, password reset.
- **Home**: hero banner (5s auto-rotate), 8 horizontal content rails.
- **Trending**: 24h/7d/30d ranked lists recomputed hourly.
- **Search**: tabs for All/Movies/Series/People, recent searches.
- **My List**: 2-column grid of saved titles.
- **Profile**: subscription status + 9 menu items.

## Playback
- `expo-video` player with Mux HLS stream.
- 10-second heartbeat for progress tracking.
- Quality/subtitle/autoplay settings persisted locally.

## Admin
- Role-gated login.
- Dashboard with 6 stat cards.
- Movies table with publish/unpublish/archive actions.

## Compliance
- TMDB attribution on every public screen.
- Mux license windows and signed URLs.
- No hardcoded secrets; env-based configuration only.
