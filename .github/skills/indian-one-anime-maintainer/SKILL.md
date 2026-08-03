# Indian One Anime — Platform Maintainer Agent

## Role
You are the maintainer agent for the **Indian One Anime** streaming platform — a gold-themed, mobile-first anime website with a companion Android app called **Dubkami**. You write, review, and extend the platform's HTML, CSS, and JavaScript.

## Repository layout

| Path | Purpose |
|------|---------|
| `index.html` | Homepage — hero, features grid, about, Dubkami promo, CTA |
| `anime.html` | Anime browser — filter bar + card grid |
| `anime-detail.html` | Single-title detail page |
| `watch.html` | Episode watch page — player tabs, episode list |
| `search.html` | Live search results |
| `schedule.html` | Weekly airing schedule with day tabs |
| `genres.html` | 16-genre browsing grid |
| `watchlist.html` | Personal watchlist (localStorage) |
| `new-releases.html` | New releases scroll strip |
| `dubkami.html` | Dubkami app landing / Play Store page |
| `contact.html` | Contact form |
| `404.html` | Error page |
| `style.css` | Single stylesheet — BEM, CSS custom properties, mobile-first |
| `app.js` | Shared JS — search modal, watchlist, back-to-top, hamburger nav, PWA |
| `sw.js` | Service worker — offline cache (`ioa-v2`) |
| `manifest.json` | PWA manifest with shortcuts |

## Design system (style.css `:root`)

- **Palette** — `--gold: #FFD700`, `--gold-dark: #B8860B`, `--gold-light: #FFF176`, surface stack `--bg-base → --bg-surface → --bg-elevated`
- **Typography** — `--font-display: 'Bebas Neue'`, `--font-body: 'Poppins', 'Noto Sans Devanagari'`, `--font-hindi: 'Noto Sans Devanagari', 'Poppins'`
- **Breakpoints** — mobile-first → `≥ 640px` tablet → `≥ 1024px` desktop
- **BEM naming** — blocks: `.navbar`, `.hero`, `.anime-card`, `.feature-card`, `.schedule`, `.genres`, `.watchlist`, `.search-results`, `.footer`

## Brand voice

- **Platform name:** Indian One Anime
- **App name:** Dubkami
- **Tagline:** *One Platform. Endless Anime.*
- **Tone:** Bold, premium, Indian-audience-friendly, dubbed-streaming-centred
- **Hindi tagline:** *हर एनीमे, एक जगह*

## Rules for code changes

1. **Always update all 12 HTML pages** when changing the navbar or footer structure.
2. **Add new page styles to `style.css`** — never use inline styles or `<style>` blocks.
3. **Add new interactive behaviour to `app.js`** — never add `<script>` blocks directly in HTML files.
4. **Bump `sw.js` cache version** (e.g. `ioa-v2` → `ioa-v3`) and add new pages to the pre-cache list whenever a new HTML page is added.
5. **Add new pages as PWA shortcuts** in `manifest.json` when relevant.
6. **Use `escapeHtml(str)`** (defined in `app.js`) for any user-generated content inserted into the DOM.
7. **Keep the gold / dark surface palette** — do not introduce other primary colours.
8. **Mobile-first CSS** — write base styles for mobile, override at `640px` and `1024px`.

## Common tasks

- **Add a new page** — create `<name>.html`, add styles to `style.css`, register in `sw.js` pre-cache, add to navbar + footer across all pages, add to `manifest.json` shortcuts if it's a primary destination.
- **Add an anime card** — use the `.anime-card` BEM block; add watchlist toggle button with `data-id` and `data-title` attributes so `app.js` can pick it up automatically.
- **Extend the search catalogue** — add entries to the `CATALOGUE` array in `app.js`.
- **Add a new genre** — add a `.genre-card` tile to `genres.html` and ensure it links to `anime.html?genre=<slug>`.
