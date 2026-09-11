# MovieMix — API Specification

Base path: `/api/v1`
Auth: ****** in `Authorization` header.

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register with email/password |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| POST | `/auth/oauth/:provider` | OAuth callback (Google, Apple) |

## Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | Current user profile |
| PATCH | `/users/me` | Update profile |
| GET | `/users/me/watchlist` | User watchlist |
| GET | `/users/me/history` | User watch history |

## Browse

| Method | Path | Description |
|--------|------|-------------|
| GET | `/movies` | List movies (filters: genre, year, language, status) |
| GET | `/movies/featured` | Featured movies |
| GET | `/movies/trending` | Trending movies (`window=24h\|7d\|30d`) |
| GET | `/movies/:id` | Movie details |
| GET | `/series` | List series (filters: genre, year, language, status) |
| GET | `/series/featured` | Featured series |
| GET | `/series/:id` | Series details with seasons |
| GET | `/series/:id/seasons` | Seasons for series |
| GET | `/seasons/:id/episodes` | Episodes for season |
| GET | `/genres` | List genres |

## Search

| Method | Path | Description |
|--------|------|-------------|
| GET | `/search?q=&type=&limit=` | Multi-entity search |

## Watchlist

| Method | Path | Description |
|--------|------|-------------|
| POST | `/watchlist` | Add movie/series to watchlist |
| DELETE | `/watchlist/:contentType/:contentId` | Remove from watchlist |

## History / Progress

| Method | Path | Description |
|--------|------|-------------|
| POST | `/history/heartbeat` | Upsert playback progress |
| GET | `/history` | Get watch history |
| DELETE | `/history/:id` | Delete history entry |

## Playback

| Method | Path | Description |
|--------|------|-------------|
| POST | `/playback/signed-url` | Get signed HLS URL |

## Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/stats` | Dashboard stats |
| POST | `/admin/movies` | Create movie |
| PATCH | `/admin/movies/:id` | Update movie |
| DELETE | `/admin/movies/:id` | Delete movie |
| POST | `/admin/series` | Create series |
| PATCH | `/admin/series/:id` | Update series |
| POST | `/admin/series/:id/seasons` | Add season |
| PATCH | `/admin/seasons/:id` | Update season |
| POST | `/admin/seasons/:id/episodes` | Add episode |
| PATCH | `/admin/episodes/:id` | Update episode |
| POST | `/admin/genres` | Create genre |
| PATCH | `/admin/genres/:id` | Update genre |
| DELETE | `/admin/genres/:id` | Delete genre |
| GET | `/admin/users` | List users |
| PATCH | `/admin/users/:id/role` | Update user role |
