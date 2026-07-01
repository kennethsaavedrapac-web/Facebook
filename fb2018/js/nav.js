// ─── NAVIGATION MANAGER ───────────────────────────────────────────────────────
// Centralizes ALL History API usage. Every screen and every modal registers
// a history entry here, so the Android physical back button, swipe-back gesture
// and browser back button all behave exactly like a native Facebook 2018 app.

window.NavManager = (() => {

  // ── Internal state ──────────────────────────────────────────────────────────

  // Stack that mirrors the browser history for our PWA states.
  // We keep it in sync manually because the History API doesn't let us
  // inspect the full stack directly.
  let _stack = [];

  // Whether the app has been entered (post-login). Used to gate pushState.
  let _appReady = false;

  // Currently open modal ids (can be stacked: e.g. photo on top of album)
  let _openModals = [];

  // ── Route → screen/modal activators ─────────────────────────────────────────

  // Called by popstate to restore a given state.
  function _restoreState(state) {
    if (!state) return;

    const { route, params } = state;

    switch (route) {

      // ── Tab screens (bottom-nav) ─────────────────────────────────────────
      case 'feed':
      case 'friends':
      case 'notifications':
      case 'menu':
        _closeAllModals();
        _closeAllOverlays();
        _showTabScreen(route);
        if (route === 'feed' && window.FeedStore && FeedStore.isRendered) {
          requestAnimationFrame(() => {
            const feedScreen = document.getElementById('screen-feed');
            if (feedScreen) feedScreen.scrollTop = FeedStore.scrollPosition || 0;
          });
        }
        break;

      // ── Overlay screens ──────────────────────────────────────────────────
      case 'messenger':
        _closeAllModals();
        _showOverlay('screen-messenger');
        if (window.Messenger) Messenger.renderList();
        break;

      case 'messenger-chat':
        _closeAllModals();
        _showOverlay('screen-messenger');
        if (window.Messenger && params && params.threadId !== undefined) {
          Messenger.openChatDOM(params.threadId);
        }
        break;

      case 'profile':
        _closeAllModals();
        _showOverlay('screen-profile');
        if (window.ProfileStore && params) {
          ProfileStore.render(params.userId !== undefined ? params.userId : 0);
        }
        break;

      case 'album':
        _closeAllModals();
        _showOverlay('screen-album');
        if (window.ProfileStore) ProfileStore.renderAlbum();
        break;

      // ── Modals ─────────────────────────────────────────────────────────────
      case 'modal:photo':
        if (params && params.src && window.FeedStore) {
          FeedStore._showPhotoDOM(params.src, params.photos || [params.src], params.index || 0);
          if (!_openModals.includes('photo')) _openModals.push('photo');
        }
        break;

      case 'modal:comments':
        if (params && params.postId && window.FeedStore) {
          FeedStore._showCommentsDOM(params.postId);
          if (!_openModals.includes('comments')) _openModals.push('comments');
        }
        break;

      default:
        // Fallback: go to feed
        _closeAllModals();
        _closeAllOverlays();
        _showTabScreen('feed');
        break;
    }
  }

  // ── DOM helpers ──────────────────────────────────────────────────────────────

  const TAB_SCREENS = ['feed', 'friends', 'notifications', 'menu'];

  function _showTabScreen(name) {
    // Hide all non-overlay screens
    document.querySelectorAll('.screen:not(.overlay)').forEach(s => s.classList.remove('active'));
    // Hide overlays too
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    const target = document.getElementById(`screen-${name}`);
    if (target) target.classList.add('active');

    // Update tab indicator
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-screen="${name}"]`);
    if (tab) tab.classList.add('active');

    const index = TAB_SCREENS.indexOf(name);
    if (index !== -1) {
      const indicator = document.getElementById('tab-indicator');
      if (indicator) indicator.style.transform = `translateX(${index * 100}%)`;
    }
  }

  function _showOverlay(screenId) {
    // First hide all non-overlay screens (keep them for back navigation)
    document.querySelectorAll('.screen:not(.overlay)').forEach(s => s.classList.remove('active'));
    // Hide other overlays
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }
  }

  function _closeAllOverlays() {
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });
  }

  function _closeAllModals() {
    // Photo viewer
    if (window.FeedStore && FeedStore._closePhotoDOM) {
      FeedStore._closePhotoDOM();
    } else {
      const photoViewer = document.getElementById('photo-viewer');
      if (photoViewer) photoViewer.classList.add('hidden');
    }

    // Comments sheet
    if (window.FeedStore && FeedStore._closeCommentsDOM) {
      FeedStore._closeCommentsDOM();
    } else {
      const commentsSheet = document.getElementById('comments-sheet');
      const commentsBackdrop = document.getElementById('comments-backdrop');
      if (commentsSheet) commentsSheet.classList.add('hidden');
      if (commentsBackdrop) commentsBackdrop.classList.add('hidden');
    }

    _openModals = [];
  }

  // Close a specific modal by id without touching others.
  function _closeModal(modalId) {
    if (modalId === 'photo') {
      if (window.FeedStore && FeedStore._closePhotoDOM) FeedStore._closePhotoDOM();
      else {
        const v = document.getElementById('photo-viewer');
        if (v) v.classList.add('hidden');
      }
    } else if (modalId === 'comments') {
      if (window.FeedStore && FeedStore._closeCommentsDOM) FeedStore._closeCommentsDOM();
      else {
        const s = document.getElementById('comments-sheet');
        const b = document.getElementById('comments-backdrop');
        if (s) s.classList.add('hidden');
        if (b) b.classList.add('hidden');
      }
    }
    _openModals = _openModals.filter(m => m !== modalId);
  }

  // ── Save current screen scroll before navigating away ───────────────────────

  function _saveCurrentScroll() {
    const feedScreen = document.getElementById('screen-feed');
    if (feedScreen && feedScreen.classList.contains('active') && window.FeedStore) {
      FeedStore.scrollPosition = feedScreen.scrollTop;
    }
    const profileScrollContainer = document.querySelector('#screen-profile .profile-scroll-container');
    if (profileScrollContainer && window.ProfileStore) {
      ProfileStore.scrollPosition = profileScrollContainer.scrollTop;
    }
  }

  // ── Public API ───────────────────────────────────────────────────────────────

  /**
   * Push a new screen onto the history stack.
   * @param {string} route  - route name (e.g. 'feed', 'profile', 'messenger')
   * @param {object} params - optional params (e.g. { userId: 2 })
   */
  function push(route, params = {}) {
    if (!_appReady) return;
    _saveCurrentScroll();

    const state = { route, params, ts: Date.now() };
    history.pushState(state, '', '#' + route.replace(':', '-'));
    _stack.push(state);
    _restoreState(state);
  }

  /**
   * Replace the current history entry (no back entry added).
   * Used for: login → feed base state.
   */
  function replace(route, params = {}) {
    const state = { route, params, ts: Date.now() };
    history.replaceState(state, '', '#' + route.replace(':', '-'));
    // Replace top of stack
    if (_stack.length > 0) {
      _stack[_stack.length - 1] = state;
    } else {
      _stack.push(state);
    }
  }

  /**
   * Open a modal. Adds a history entry so Atrás closes it first.
   * @param {string} modalId - 'photo' | 'comments'
   * @param {object} params
   */
  function openModal(modalId, params = {}) {
    if (!_appReady) return;
    const route = `modal:${modalId}`;
    const state = { route, params, ts: Date.now() };
    history.pushState(state, '', '#modal-' + modalId);
    _stack.push(state);
    _restoreState(state);
  }

  /**
   * Go back one step (delegates to browser, which fires popstate).
   */
  function pop() {
    history.back();
  }

  /**
   * Mark the app as ready (called after enterApp() finishes).
   * Before this, push() is a no-op to avoid polluting history during login.
   */
  function setAppReady() {
    _appReady = true;
  }

  // ── popstate listener (single, centralized) ─────────────────────────────────

  function _handlePopState(e) {
    // If no state in the event, we've gone past our base state → let the
    // browser close the PWA. Do NOT push anything; just let it happen.
    if (!e.state || !e.state.route) {
      return;
    }

    // Sync our stack
    const incoming = e.state;
    // Remove the top entry that was popped
    if (_stack.length > 0 && _stack[_stack.length - 1].ts !== incoming.ts) {
      _stack.pop();
    }

    _restoreState(incoming);
  }

  // ── Initialization ───────────────────────────────────────────────────────────

  function init() {
    window.addEventListener('popstate', _handlePopState);
  }

  // ── Expose ───────────────────────────────────────────────────────────────────

  return {
    init,
    push,
    replace,
    openModal,
    pop,
    setAppReady,
    // Expose for debugging
    get stack() { return _stack; },
    get appReady() { return _appReady; }
  };

})();
