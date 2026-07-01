// ─── LOGIN & LOADING SCREEN ──────────────────────────────────────────────────

window.LoginScreen = (() => {

  let loginEl;
  let loadingEl;

  function init() {
    loginEl = document.getElementById('login-screen');
    loadingEl = document.getElementById('loading-screen');

    if (!loginEl) return;

    // Pre-fill the fields
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');

    if (emailInput) emailInput.value = '82747637';
    if (passInput) passInput.value = '********';

    // Submit button
    const submitBtn = document.getElementById('login-submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', handleLogin);
    }

    // Enter key on password field
    if (passInput) {
      passInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLogin();
        }
      });
    }

    // Enter key on email field
    if (emailInput) {
      emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          passInput.focus();
        }
      });
    }
  }

  function handleLogin() {
    const submitBtn = document.getElementById('login-submit-btn');
    if (!submitBtn || submitBtn.disabled) return;

    // Disable button to prevent multiple presses
    submitBtn.disabled = true;
    submitBtn.textContent = 'Iniciando sesión...';

    // Short delay before transitioning to loading screen
    setTimeout(() => {
      showLoadingScreen();
    }, 300);
  }

  function showLoadingScreen() {
    // Hide login screen
    loginEl.classList.add('hidden');

    // Show loading screen
    loadingEl.classList.remove('hidden');

    const loadingText = document.getElementById('loading-status-text');

    // Phase 1: "Iniciando sesión..."
    if (loadingText) loadingText.textContent = 'Iniciando sesión...';

    // Phase 2: "Cargando noticias..." at 600ms
    setTimeout(() => {
      if (loadingText) {
        loadingText.classList.add('fade');
        setTimeout(() => {
          loadingText.textContent = 'Cargando noticias...';
          loadingText.classList.remove('fade');
        }, 200);
      }
    }, 600);

    // Phase 3: "Sincronizando Facebook..." at 1100ms
    setTimeout(() => {
      if (loadingText) {
        loadingText.classList.add('fade');
        setTimeout(() => {
          loadingText.textContent = 'Sincronizando Facebook...';
          loadingText.classList.remove('fade');
        }, 200);
      }
    }, 1100);

    // Transition to app at ~1600ms
    setTimeout(() => {
      enterApp();
    }, 1600);
  }

  function enterApp() {
    // Fade out loading screen
    loadingEl.classList.add('fade-out');

    // Show the main app UI
    const topbar = document.getElementById('topbar-blue');
    const tabbar = document.getElementById('tab-bar');
    const app = document.getElementById('app');

    if (topbar) topbar.style.display = '';
    if (tabbar) tabbar.style.display = '';
    if (app) app.style.display = '';

    // After fade-out animation completes, remove loading screen
    setTimeout(() => {
      loadingEl.classList.add('hidden');
      loadingEl.classList.remove('fade-out');

      // ── NAVIGATION: establish the base history state ────────────────────────
      // replaceState (no new back entry) so "feed" is the floor of the stack.
      // Once the user is here, any further pushState will be navigable with Atrás
      // but they can never go back PAST the feed (which would close the app).
      if (window.NavManager) {
        NavManager.replace('feed', {});
        NavManager.setAppReady();
      }
    }, 350);
  }

  return { init };
})();
