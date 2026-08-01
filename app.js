/* =====================================================
   Indian One Anime — app.js
   Shared: theme toggle, PWA install prompt, SW registration
   ===================================================== */

// ---- Theme init (also inlined in <head> for flash-prevention) ----
(function () {
  try {
    var saved = localStorage.getItem('ioaTheme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
  } catch (e) {}
}());

document.addEventListener('DOMContentLoaded', function () {

  // ---- Theme toggle button ----
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

  // ---- PWA install banner ----
  var installBanner = document.getElementById('pwa-install-banner');
  var installBtn = document.getElementById('pwa-install-btn');
  var installClose = document.getElementById('pwa-install-close');
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

  // ---- Service Worker registration ----
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

});
