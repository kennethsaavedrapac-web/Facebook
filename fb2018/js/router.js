// ─── ROUTER ───────────────────────────────────────────────────────────────────
// Thin adapter layer. All actual history management is done by NavManager.
// Router.push / Router.pop remain as the public API so the rest of the app
// (EventManager, profile.js, feed.js, etc.) doesn't need to change its call sites.

window.Router = (() => {

  const TAB_SCREENS = ['feed', 'friends', 'notifications', 'menu'];

  // ── Skeleton loaders ─────────────────────────────────────────────────────────

  function showSkeletons(screen) {
    if (screen === 'feed') {
      const container = document.getElementById('feed-posts');
      if (container) {
        container.innerHTML = `
          <div class="skeleton-card">
            <div class="skeleton-header">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-meta"><div class="skeleton-line title"></div><div class="skeleton-line sub"></div></div>
            </div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line text" style="width:70%"></div>
            <div class="skeleton-line image"></div>
          </div>`;
      }
    } else if (screen === 'friends') {
      const list = document.getElementById('friends-list');
      if (list) {
        list.innerHTML = Array(3).fill(0).map(() => `
          <div class="skeleton-card" style="margin: 0; border-bottom: 1px solid var(--border)">
            <div class="skeleton-header" style="margin: 0; padding: 12px 16px">
              <div class="skeleton-avatar" style="width: 60px; height: 60px"></div>
              <div class="skeleton-meta" style="gap: 8px">
                <div class="skeleton-line title" style="width: 50%"></div>
                <div class="skeleton-line sub" style="width: 30%"></div>
                <div style="display:flex; gap:8px; margin-top:4px">
                  <div class="skeleton-line" style="width:70px; height:28px"></div>
                  <div class="skeleton-line" style="width:70px; height:28px"></div>
                </div>
              </div>
            </div>
          </div>`).join('');
      }
    } else if (screen === 'notifications') {
      const list = document.getElementById('notif-list');
      if (list) {
        list.innerHTML = Array(4).fill(0).map(() => `
          <div class="skeleton-card" style="margin: 0; border-bottom: 1px solid var(--border)">
            <div class="skeleton-header" style="margin: 0; padding: 12px 16px">
              <div class="skeleton-avatar" style="width: 44px; height: 44px"></div>
              <div class="skeleton-meta" style="gap: 8px">
                <div class="skeleton-line text" style="width: 80%"></div>
                <div class="skeleton-line sub" style="width: 20%"></div>
              </div>
            </div>
          </div>`).join('');
      }
    }
  }

  // ── Screen content loaders (called after NavManager shows the screen) ─────────

  function loadScreenContent(screen, params = {}) {
    if (screen === 'profile') {
      const uid = params.userId !== undefined ? params.userId : 0;
      ProfileStore.render(uid);
    } else if (screen === 'album') {
      ProfileStore.renderAlbum();
    } else if (screen === 'messenger') {
      Messenger.renderList();
    } else if (TAB_SCREENS.includes(screen)) {
      if (screen === 'feed') {
        if (FeedStore.isRendered) {
          // Scroll restoration is handled by NavManager
        } else {
          showSkeletons('feed');
          setTimeout(() => FeedStore.renderFeedOnly(), 250);
        }
      } else {
        showSkeletons(screen);
        setTimeout(() => {
          if (screen === 'friends') renderFriends();
          else if (screen === 'notifications') Notifications.render();
        }, 250);
      }
    }
  }

  // ── Public push ──────────────────────────────────────────────────────────────

  function push(screen, params = {}) {
    // NavManager handles history + DOM transition
    NavManager.push(screen, params);
    // Load content after DOM is shown
    loadScreenContent(screen, params);
  }

  function pop() {
    NavManager.pop();
  }

  // ── Tab navigation ───────────────────────────────────────────────────────────

  function init() {
    // Initialize NavManager popstate listener
    NavManager.init();

    // Setup initial state: the base "feed" entry that never gets popped beyond
    // (the browser will close the PWA if the user goes back past this)
    const initialRoute = location.hash.replace('#', '') || 'feed';
    const validRoute = TAB_SCREENS.includes(initialRoute) ? initialRoute : 'feed';

    // Replace state (no back entry) for the base screen
    NavManager.replace(validRoute, {});
    _showInitialScreen(validRoute);

    // Tab click handlers
    document.querySelectorAll('.tab[data-screen]').forEach(tab => {
      tab.addEventListener('click', () => {
        const screen = tab.dataset.screen;
        push(screen);
      });
    });

    // Back buttons (← arrows in headers of overlay screens)
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', pop);
    });

    const profileBackBtn = document.getElementById('profile-back-btn');
    if (profileBackBtn) profileBackBtn.addEventListener('click', pop);

    const albumBackBtn = document.getElementById('album-back-btn');
    if (albumBackBtn) albumBackBtn.addEventListener('click', pop);

    // Menu > profile row
    const menuProfileRow = document.getElementById('menu-profile-row');
    if (menuProfileRow) {
      const menuAvatar = menuProfileRow.querySelector('img');
      if (menuAvatar) menuAvatar.src = DATA.me.avatar;
      const menuName = menuProfileRow.querySelector('.menu-name');
      if (menuName) menuName.textContent = DATA.me.name;

      menuProfileRow.addEventListener('click', () => {
        push('profile', { userId: 0 });
      });
    }
  }

  // ── Show initial screen without pushing history ──────────────────────────────

  function _showInitialScreen(screen) {
    // Show the correct tab screen on first load
    document.querySelectorAll('.screen:not(.overlay)').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    const target = document.getElementById(`screen-${screen}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-screen="${screen}"]`);
    if (tab) tab.classList.add('active');

    const TAB_SCREENS_LOCAL = ['feed', 'friends', 'notifications', 'menu'];
    const index = TAB_SCREENS_LOCAL.indexOf(screen);
    if (index !== -1) {
      const indicator = document.getElementById('tab-indicator');
      if (indicator) indicator.style.transform = `translateX(${index * 100}%)`;
    }

    loadScreenContent(screen);
  }

  // ── Friends list renderer ────────────────────────────────────────────────────

  function renderFriends() {
    const list = document.getElementById('friends-list');
    if (!list) return;
    const pendingRequests = DATA.friendRequests.length;

    let htmlContent = '';

    if (pendingRequests > 0) {
      htmlContent += `
        <div style="padding:12px 16px;font-weight:700;font-size:15px;background:white;border-bottom:1px solid var(--border)">
          Solicitudes de amistad (${pendingRequests})
        </div>
        ${DATA.friendRequests.map(req => {
          const user = DATA.users.find(u => u.id === req.userId);
          return `<div class="friend-request-card" data-req-id="${req.id}">
            <img src="${user.avatar}" class="avatar-lg" data-profile="${user.id}" style="cursor:pointer">
            <div style="flex:1">
              <div style="font-weight:700;cursor:pointer" data-profile="${user.id}">${user.name}</div>
              <div style="font-size:13px;color:var(--text-secondary)">${req.mutualFriends} amigos en común</div>
              <div class="friend-actions">
                <button class="btn-primary" onclick="acceptFriendRequest(this, ${req.id})">Confirmar</button>
                <button class="btn-secondary" onclick="deleteFriendRequest(this, ${req.id})">Eliminar</button>
              </div>
            </div>
          </div>`;
        }).join('')}
      `;
    } else {
      htmlContent += `
        <div style="padding:16px; text-align:center; background:white; color:var(--text-secondary); font-size:14px; border-bottom:1px solid var(--border)">
          No tienes solicitudes de amistad pendientes.
        </div>
      `;
    }

    htmlContent += `
      <div style="padding:12px 16px;font-weight:700;font-size:15px;background:white;border-top:8px solid var(--bg);border-bottom:1px solid var(--border)">
        Personas que quizás conozcas
      </div>
      ${DATA.users.filter(u => u.id !== 0 && u.id !== 5).slice(0, 4).map(user => `
        <div class="friend-request-card">
          <img src="${user.avatar}" class="avatar-lg" data-profile="${user.id}" style="cursor:pointer">
          <div style="flex:1">
            <div style="font-weight:700;cursor:pointer" data-profile="${user.id}">${user.name}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${user.friends} amigos</div>
            <div class="friend-actions">
              <button class="btn-primary">Agregar</button>
              <button class="btn-secondary">Eliminar</button>
            </div>
          </div>
        </div>
      `).join('')}
    `;

    list.innerHTML = htmlContent;

    list.querySelectorAll('[data-profile]').forEach(el => {
      el.addEventListener('click', () => Router.push('profile', { userId: parseInt(el.dataset.profile) }));
    });
  }

  return { init, push, pop, renderFriends };
})();

// ── FRIEND REQUEST ACTIONS ───────────────────────────────────────────────────
function acceptFriendRequest(btn, reqId) {
  const card = btn.closest('.friend-request-card');
  card.style.opacity = '0.5';
  card.querySelector('.friend-actions').innerHTML = '<span style="font-size:13px; color:var(--text-secondary)">Solicitud aceptada</span>';
  DATA.friendRequests = DATA.friendRequests.filter(r => r.id !== reqId);
  updateFriendsTabBadge();
}

function deleteFriendRequest(btn, reqId) {
  const card = btn.closest('.friend-request-card');
  card.remove();
  DATA.friendRequests = DATA.friendRequests.filter(r => r.id !== reqId);
  updateFriendsTabBadge();
}

function updateFriendsTabBadge() {
  const badge = document.getElementById('friends-badge');
  if (badge) {
    const count = DATA.friendRequests.length;
    if (count > 0) {
      badge.textContent = count;
    } else {
      badge.remove();
    }
  }
}
