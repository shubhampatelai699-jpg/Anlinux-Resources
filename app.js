/* =====================================================
   Indian One Anime — app.js  v2
   Theme toggle · Nav toggle · Search modal ·
   Watchlist (localStorage) · Back-to-top · Toast ·
   PWA install banner · Service Worker
   ===================================================== */

/* ---- Catalogue (used by search modal) ---- */
var IOA_CATALOGUE = [
  { id: 'demon-slayer', title: 'Demon Slayer', abbr: 'DS',   meta: 'Action · S4 · Ongoing',     url: 'anime-detail.html' },
  { id: 'jjk',         title: 'Jujutsu Kaisen', abbr: 'JJK', meta: 'Action · S3 · Ongoing',    url: 'anime-detail.html' },
  { id: 'one-piece',   title: 'One Piece',      abbr: 'OP',  meta: 'Adventure · Egghead Arc',   url: 'anime-detail.html' },
  { id: 'solo',        title: 'Solo Leveling',  abbr: 'SL',  meta: 'Action · S1 · Complete',    url: 'anime-detail.html' },
  { id: 'bleach',      title: 'Bleach: TYBW',   abbr: 'BL',  meta: 'Supernatural · Part 3',     url: 'anime-detail.html' },
  { id: 'naruto',      title: 'Naruto Shippuden', abbr: 'NS', meta: 'Action · Complete · 500 Eps', url: 'anime-detail.html' },
  { id: 'aot',         title: 'Attack on Titan', abbr: 'AOT', meta: 'Thriller · Complete',       url: 'anime-detail.html' },
  { id: 'dbs',         title: 'Dragon Ball Super', abbr: 'DBS', meta: 'Action · Complete',       url: 'anime-detail.html' },
  { id: 'black-clover', title: 'Black Clover',  abbr: 'BC',  meta: 'Fantasy · Complete',         url: 'anime-detail.html' },
  { id: 'hxh',         title: 'Hunter x Hunter', abbr: 'HxH', meta: 'Adventure · Complete',     url: 'anime-detail.html' },
  { id: 'mha',         title: 'My Hero Academia', abbr: 'MHA', meta: 'Action · S7 · Ongoing',   url: 'anime-detail.html' },
  { id: 'fairy-tail',  title: 'Fairy Tail',     abbr: 'FT',  meta: 'Fantasy · Complete',         url: 'anime-detail.html' },
  { id: 'sword-art',   title: 'Sword Art Online', abbr: 'SAO', meta: 'Sci-Fi · Complete',       url: 'anime-detail.html' },
  { id: 'death-note',  title: 'Death Note',     abbr: 'DN',  meta: 'Thriller · Classic',         url: 'anime-detail.html' },
  { id: 'fmab',        title: 'Fullmetal Alchemist: Brotherhood', abbr: 'FMA', meta: 'Action · Classic', url: 'anime-detail.html' },
  { id: 'overlord',    title: 'Overlord',        abbr: 'OVL', meta: 'Fantasy · S4 · Complete',  url: 'anime-detail.html' },
  { id: 're-zero',     title: 'Re:Zero',         abbr: 'RZ',  meta: 'Fantasy · Ongoing',         url: 'anime-detail.html' },
  { id: 'vinland',     title: 'Vinland Saga',    abbr: 'VS',  meta: 'Historical · S2 · Ongoing', url: 'anime-detail.html' },
  { id: 'chainsawman', title: 'Chainsaw Man',    abbr: 'CSM', meta: 'Action · S2 · Ongoing',    url: 'anime-detail.html' },
  { id: 'spy-family',  title: 'Spy x Family',    abbr: 'SXF', meta: 'Comedy · Ongoing',         url: 'anime-detail.html' }
];

/* ---- Theme init (inlined in <head> for flash-prevention, repeated here for safety) ---- */
(function () {
  try {
    var saved = localStorage.getItem('ioaTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
}());

/* ---- Utilities ---- */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(msg) {
  var t = document.getElementById('ioa-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-visible');
  setTimeout(function () { t.classList.remove('is-visible'); }, 2400);
}

/* ---- Watchlist helpers ---- */
function getWatchlist() {
  try { return JSON.parse(localStorage.getItem('ioaWatchlist') || '[]'); } catch (e) { return []; }
}
function saveWatchlist(list) {
  try { localStorage.setItem('ioaWatchlist', JSON.stringify(list)); } catch (e) {}
}
function isInWatchlist(id) {
  return getWatchlist().some(function (item) { return item.id === id; });
}
function addToWatchlist(item) {
  var list = getWatchlist();
  if (!list.some(function (i) { return i.id === item.id; })) {
    list.push(item);
    saveWatchlist(list);
    updateWatchlistCount();
    showToast('✅ Added to Watchlist: ' + item.title);
    return true;
  }
  return false;
}
function removeFromWatchlist(id) {
  var list = getWatchlist().filter(function (i) { return i.id !== id; });
  saveWatchlist(list);
  updateWatchlistCount();
  showToast('🗑️ Removed from Watchlist');
}
function updateWatchlistCount() {
  var count = getWatchlist().length;
  var badges = document.querySelectorAll('.watchlist-count');
  badges.forEach(function (b) {
    b.textContent = count > 0 ? String(count) : '';
  });
}

/* ============================================================
   DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ---- Inject dynamic UI elements into <body> ---- */
  injectSearchModal();
  injectBackToTop();
  injectToast();

  /* ---- Theme toggle ---- */
  var themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    function syncThemeBtn() {
      var current = document.documentElement.getAttribute('data-theme') || 'dark';
      themeBtn.textContent = current === 'light' ? '🌙' : '☀️';
      themeBtn.setAttribute('aria-label', current === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    syncThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('ioaTheme', next); } catch (e) {}
      syncThemeBtn();
    });
  }

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks  = document.getElementById('nav-links');
  var navCta    = document.getElementById('nav-cta');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.textContent = isOpen ? '✕' : '☰';
      if (navCta) navCta.style.display = isOpen ? 'inline-block' : 'none';
    });
  }

  /* ---- Watchlist count on load ---- */
  updateWatchlistCount();

  /* ---- Watchlist buttons on anime cards ---- */
  initWatchlistButtons();

  /* ---- Back-to-top ---- */
  initBackToTop();

  /* ---- PWA install banner ---- */
  var installBanner = document.getElementById('pwa-install-banner');
  var installBtn    = document.getElementById('pwa-install-btn');
  var installClose  = document.getElementById('pwa-install-close');
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (installBanner && !sessionStorage.getItem('pwaInstallDismissed')) {
      installBanner.classList.remove('is-hidden');
    }
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function () {
          deferredPrompt = null;
          if (installBanner) installBanner.classList.add('is-hidden');
        });
      }
    });
  }
  if (installClose) {
    installClose.addEventListener('click', function () {
      if (installBanner) installBanner.classList.add('is-hidden');
      try { sessionStorage.setItem('pwaInstallDismissed', '1'); } catch (e) {}
    });
  }

  /* ---- Service Worker registration ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  /* ---- Watchlist page rendering ---- */
  if (document.getElementById('watchlist-container')) {
    renderWatchlistPage();
  }

  /* ---- Search results page ---- */
  if (document.getElementById('search-results-grid')) {
    initSearchPage();
  }

  /* ---- Schedule page ---- */
  if (document.getElementById('schedule-tabs')) {
    initScheduleTabs();
  }

}); /* end DOMContentLoaded */

/* ============================================================
   INJECT HELPERS
   ============================================================ */
function injectSearchModal() {
  var modal = document.createElement('div');
  modal.id = 'search-modal';
  modal.className = 'search-modal-overlay is-hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Search anime');
  modal.innerHTML =
    '<div class="search-modal__inner">' +
      '<div class="search-modal__header">' +
        '<span class="search-modal__icon">🔍</span>' +
        '<input type="search" id="search-modal-input" class="search-modal__input" placeholder="Search for anime…" autocomplete="off" aria-label="Search anime" />' +
        '<button class="search-modal__close" id="search-modal-close" aria-label="Close search">✕</button>' +
      '</div>' +
      '<div class="search-modal__results" id="search-modal-results" role="listbox" aria-label="Search results">' +
        '<p class="search-modal__empty">Start typing to search anime…</p>' +
      '</div>' +
      '<p class="search-modal__hint">Press <kbd>Esc</kbd> to close · <kbd>Enter</kbd> to go to first result</p>' +
    '</div>';
  document.body.appendChild(modal);

  var input   = document.getElementById('search-modal-input');
  var results = document.getElementById('search-modal-results');
  var closeBtn = document.getElementById('search-modal-close');
  var openBtn  = document.getElementById('search-open-btn');

  function openModal() {
    modal.classList.remove('is-hidden');
    if (input) { input.value = ''; renderSearchResults(''); input.focus(); }
  }
  function closeModal() {
    modal.classList.add('is-hidden');
  }

  if (openBtn) { openBtn.addEventListener('click', openModal); }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('is-hidden')) closeModal();
  });

  if (input) {
    input.addEventListener('input', function () { renderSearchResults(input.value.trim()); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var first = results.querySelector('.search-result-item');
        if (first) { first.click(); closeModal(); }
      }
    });
  }

  function renderSearchResults(query) {
    if (!query) {
      results.innerHTML = '<p class="search-modal__empty">Start typing to search anime…</p>';
      return;
    }
    var q = query.toLowerCase();
    var matches = IOA_CATALOGUE.filter(function (a) {
      return a.title.toLowerCase().includes(q) || a.meta.toLowerCase().includes(q);
    }).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = '<p class="search-modal__empty">No results for "<strong>' + escapeHtml(query) + '</strong>"</p>';
      return;
    }

    results.innerHTML = matches.map(function (a) {
      return '<a href="' + escapeHtml(a.url) + '" class="search-result-item" role="option">' +
        '<div class="search-result-item__thumb">' + escapeHtml(a.abbr) + '</div>' +
        '<div class="search-result-item__info">' +
          '<div class="search-result-item__title">' + escapeHtml(a.title) + '</div>' +
          '<div class="search-result-item__meta">' + escapeHtml(a.meta) + '</div>' +
        '</div>' +
      '</a>';
    }).join('');
  }
}

function injectBackToTop() {
  var btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = '↑';
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function injectToast() {
  var t = document.createElement('div');
  t.id = 'ioa-toast';
  t.className = 'toast';
  t.setAttribute('role', 'status');
  t.setAttribute('aria-live', 'polite');
  document.body.appendChild(t);
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  var btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 320) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });
}

/* ============================================================
   WATCHLIST BUTTONS (anime cards)
   ============================================================ */
function initWatchlistButtons() {
  var cards = document.querySelectorAll('.card-anime[data-anime-id]');
  cards.forEach(function (card) {
    var id    = card.dataset.animeId;
    var title = card.dataset.animeTitle || id;
    var meta  = card.dataset.animeMeta  || '';
    var abbr  = card.dataset.animeAbbr  || title.substring(0, 3).toUpperCase();

    var btn = card.querySelector('.card-anime__watchlist-btn');
    if (!btn) return;

    if (isInWatchlist(id)) btn.classList.add('is-saved');
    btn.setAttribute('title', isInWatchlist(id) ? 'Remove from Watchlist' : 'Add to Watchlist');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (isInWatchlist(id)) {
        removeFromWatchlist(id);
        btn.classList.remove('is-saved');
        btn.setAttribute('title', 'Add to Watchlist');
        btn.textContent = '♡';
      } else {
        addToWatchlist({ id: id, title: title, meta: meta, abbr: abbr });
        btn.classList.add('is-saved');
        btn.setAttribute('title', 'Remove from Watchlist');
        btn.textContent = '♥';
      }
    });

    btn.textContent = isInWatchlist(id) ? '♥' : '♡';
  });
}

/* ============================================================
   WATCHLIST PAGE
   ============================================================ */
function renderWatchlistPage() {
  var container  = document.getElementById('watchlist-container');
  var countEl    = document.getElementById('watchlist-page-count');
  var list       = getWatchlist();

  if (countEl) countEl.textContent = list.length;

  if (!list.length) {
    container.innerHTML =
      '<div class="watchlist-empty">' +
        '<span class="watchlist-empty__icon">📋</span>' +
        '<h2>Your Watchlist is Empty</h2>' +
        '<p>Browse anime and hit ♡ to save titles here.</p>' +
        '<a href="anime.html" class="btn-primary">Browse Anime</a>' +
      '</div>';
    return;
  }

  var html = '<div class="watchlist-controls">' +
    '<h2>Saved Anime <span class="accent">(' + list.length + ')</span></h2>' +
    '<button class="btn-clear-all" id="clear-all-btn">🗑️ Clear All</button>' +
    '</div>' +
    '<div class="watchlist-list">' +
    list.map(function (item) {
      return '<div class="watchlist-item" data-wl-id="' + escapeHtml(item.id) + '">' +
        '<div class="watchlist-item__thumb">' + escapeHtml(item.abbr || '?') + '</div>' +
        '<div class="watchlist-item__info">' +
          '<div class="watchlist-item__title">' + escapeHtml(item.title) + '</div>' +
          '<div class="watchlist-item__meta">' + escapeHtml(item.meta || '') + '</div>' +
        '</div>' +
        '<div class="watchlist-item__actions">' +
          '<a href="watch.html" class="btn-primary btn--small">Watch</a>' +
          '<button class="btn-remove" data-remove-id="' + escapeHtml(item.id) + '">Remove</button>' +
        '</div>' +
      '</div>';
    }).join('') +
    '</div>';

  container.innerHTML = html;

  container.addEventListener('click', function (e) {
    var removeBtn = e.target.closest('[data-remove-id]');
    if (removeBtn) {
      removeFromWatchlist(removeBtn.dataset.removeId);
      renderWatchlistPage();
    }
    var clearAll = e.target.closest('#clear-all-btn');
    if (clearAll) {
      saveWatchlist([]);
      updateWatchlistCount();
      renderWatchlistPage();
    }
  });
}

/* ============================================================
   SEARCH RESULTS PAGE
   ============================================================ */
function initSearchPage() {
  var grid      = document.getElementById('search-results-grid');
  var metaEl    = document.getElementById('search-results-meta');
  var queryInput = document.getElementById('search-page-input');
  var genreSelect = document.getElementById('search-genre-select');
  var statusSelect = document.getElementById('search-status-select');
  var searchBtn = document.getElementById('search-page-btn');

  // Pre-fill from URL ?q=
  var params = new URLSearchParams(window.location.search);
  var initQ  = params.get('q') || '';
  if (queryInput) queryInput.value = initQ;

  function runSearch() {
    var q      = queryInput ? queryInput.value.trim().toLowerCase() : '';
    var genre  = genreSelect  ? genreSelect.value  : '';
    var status = statusSelect ? statusSelect.value : '';

    var results = IOA_CATALOGUE.filter(function (a) {
      var matchQ = !q     || a.title.toLowerCase().includes(q) || a.meta.toLowerCase().includes(q);
      var matchG = !genre  || a.meta.toLowerCase().includes(genre.toLowerCase());
      var matchS = !status || a.meta.toLowerCase().includes(status.toLowerCase());
      return matchQ && matchG && matchS;
    });

    if (metaEl) {
      metaEl.innerHTML = 'Found <span>' + results.length + '</span> title' + (results.length !== 1 ? 's' : '') +
        (q ? ' for "<span>' + escapeHtml(q) + '</span>"' : '');
    }

    if (!results.length) {
      grid.innerHTML = '<p style="color:var(--color-text-secondary);grid-column:1/-1;">No anime found. Try a different search.</p>';
      return;
    }

    grid.innerHTML = results.map(function (a) {
      var saved = isInWatchlist(a.id);
      return '<article class="card-anime" data-anime-id="' + escapeHtml(a.id) + '" ' +
        'data-anime-title="' + escapeHtml(a.title) + '" ' +
        'data-anime-meta="' + escapeHtml(a.meta) + '" ' +
        'data-anime-abbr="' + escapeHtml(a.abbr) + '">' +
        '<div class="card-anime__thumb">' + escapeHtml(a.abbr) + '</div>' +
        '<div class="card-anime__body">' +
          '<h3>' + escapeHtml(a.title) + '</h3>' +
          '<p class="accent" style="font-size:0.8rem;">' + escapeHtml(a.meta) + '</p>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px;">' +
            '<a href="' + escapeHtml(a.url) + '" class="btn-primary btn--small">Watch Now</a>' +
            '<button class="card-anime__watchlist-btn ' + (saved ? 'is-saved' : '') + '" ' +
              'title="' + (saved ? 'Remove from Watchlist' : 'Add to Watchlist') + '">' +
              (saved ? '♥' : '♡') +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');

    initWatchlistButtons();
  }

  if (queryInput) { queryInput.addEventListener('input', runSearch); }
  if (genreSelect) { genreSelect.addEventListener('change', runSearch); }
  if (statusSelect) { statusSelect.addEventListener('change', runSearch); }
  if (searchBtn) { searchBtn.addEventListener('click', function (e) { e.preventDefault(); runSearch(); }); }

  runSearch();
}

/* ============================================================
   SCHEDULE PAGE TABS
   ============================================================ */
function initScheduleTabs() {
  var tabsContainer = document.getElementById('schedule-tabs');
  if (!tabsContainer) return;

  tabsContainer.addEventListener('click', function (e) {
    var tab = e.target.closest('.schedule-day-tab');
    if (!tab) return;
    var day = tab.dataset.day;
    tabsContainer.querySelectorAll('.schedule-day-tab').forEach(function (t) {
      t.classList.remove('is-active');
    });
    tab.classList.add('is-active');
    document.querySelectorAll('.schedule-panel').forEach(function (p) {
      p.classList.toggle('is-active', p.dataset.day === day);
    });
  });

  // Activate today's tab by default
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  var today = days[new Date().getDay()];
  var todayTab = tabsContainer.querySelector('[data-day="' + today + '"]');
  if (todayTab) {
    todayTab.click();
  } else {
    var firstTab = tabsContainer.querySelector('.schedule-day-tab');
    if (firstTab) firstTab.click();
  }
}
