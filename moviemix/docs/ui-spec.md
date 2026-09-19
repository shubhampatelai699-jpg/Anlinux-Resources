# MovieMix — UI Specification

## User Flow

```text
Splash
  ↓
Onboarding (optional, first launch)
  ↓
Login / Sign Up / Forgot Password / OAuth
  ↓
Home
 ├── Continue Watching
 ├── Trending
 ├── New Releases
 ├── Popular
 ├── Genres
 └── Featured Hero
  ↓
Search
 ├── Query + Recent Searches
 ├── Filters (Genre, Year, Language, Rating)
 └── Results → Details → Player
  ↓
Details (Movie or Series)
 ├── Movie → Watch / Trailer / Watchlist / Recommendations
 └── Series → Season Selector → Episodes → Player
  ↓
Player
 ├── Controls
 ├── Subtitle / Audio selection
 ├── Resume playback
 └── Next episode (series)
  ↓
Library
 ├── Watchlist
 └── Watch History
  ↓
Profile
 ├── Account
 ├── Preferences
 ├── Subscription / Access status
 └── Settings
```

## 1. Splash Screen
- Full-screen logo on dark background `#0B0D12`.
- 2–3 second animated reveal.
- Auto-navigate to login if unauthenticated, else Home.

## 2. Login / Sign Up / Forgot Password

### Login
- Email/phone input.
- Password input with visibility toggle.
- Primary CTA: Sign In.
- Secondary: Continue with Google.
- Links: Forgot Password?, Create Account.
- Legal attribution footer.

### Sign Up
- Display name, email/phone, password.
- Password strength meter.
- Terms of Service + Privacy Policy checkbox.
- CTA: Create Account.

### Forgot Password
- Email/phone input.
- CTA: Send Reset Link.
- Success state: check your email/SMS.

## 3. Home

### Top Bar
- App logo (left).
- Notification icon, profile avatar (right).

### Hero Banner
- Auto-rotating featured movie/series every 5s.
- Large backdrop with bottom gradient.
- Title, short synopsis, genre tags.
- CTAs: Watch Now, + My List.
- Pagination dots.

### Sections (vertical scroll)
1. Continue Watching — horizontal rail with progress bars.
2. Trending — horizontal rail, ranked.
3. New Releases — horizontal rail.
4. Popular — horizontal rail.
5. Top Rated — horizontal rail.
6. Genres — circular chips row.
7. Because You Watched — recommendations rail.

### Rail Card
- Poster image (2:3 ratio), rounded corners.
- Title below, year + rating.

## 4. Search

### Search Bar
- Sticky top.
- Mic icon (optional).
- Clear icon.
- Recent searches below when empty.

### Filters
- Chips: Genre, Year, Language, Rating, Sort.

### Tabs
- All / Movies / Series.

### Result Grid
- 2 or 3 columns based on width.
- Poster + title + year + rating.
- Empty state for no results.

## 5. Movie Details

### Header
- Backdrop image with top gradient.
- Poster (left), metadata (right).
- Title, year, runtime, rating, language, genres.
- Action row:
  - Watch Now primary button.
  - Trailer button.
  - + My List / In Watchlist.
  - Share icon.

### Body
- Synopsis.
- Cast horizontal list (photo + name + role).
- Director / writers.
- Recommendations horizontal rail.

## 6. Series Details

### Header
- Same layout as Movie Details.
- No runtime; show X Seasons / Y Episodes.

### Season Selector
- Dropdown or horizontal chips.

### Episode List
- Episode thumbnail.
- Episode number + title.
- Duration.
- Progress bar if watched.
- Tap → Player.

## 7. Player

### Video Surface
- Full-screen landscape.
- System brightness/volume gestures (optional).

### Controls (auto-hide)
- Play/Pause.
- Seek bar with buffered + played progress.
- Current time / total duration.
- Backward 10s / Forward 10s.
- Quality selector.
- Subtitle toggle / audio track selector.
- Next episode (series only).
- Lock screen toggle.
- Back button.
- Title overlay.

### Behavior
- Resume from last saved progress.
- 10s heartbeat to backend.
- On complete, mark episode/movie as completed and advance to next episode.

## 8. Library

### Tabs
- Watchlist: grid of saved movies/series.
- History: list with thumbnail, title, progress bar, last watched time, completed badge.

### Empty States
- Watchlist: Your list is empty. Start adding titles.
- History: No watch history yet.

## 9. Profile

### Header
- Avatar + display name + email.
- Subscription/access status badge.

### Menu Items
- Account Settings
- Notifications
- Playback Preferences
- Downloads
- Help & Support
- Terms of Service
- Privacy Policy
- Sign Out

## 10. Admin Dashboard (Next.js)

### Login
- Role-gated admin login.

### Dashboard
- Stat cards:
  - Total users
  - Active subscribers
  - Total movies
  - Total series
  - Plays (24h)
  - Storage used

### Movies Management
- Table with title, status, featured, actions.
- Actions: Add, Edit, Publish/Unpublish, Archive, Delete.
- Form: metadata, poster, backdrop, trailer, HLS URL, genres.

### Series Management
- Same as movies + season/episode tree.
- Add season → add episodes.

### Genres
- List, add, edit, delete.

### Users
- List, role management, subscription status.
