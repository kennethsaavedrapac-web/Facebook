// ─── ROUTER ───────────────────────────────────────────────────────────────────

window.Router = (() => {

  const TAB_SCREENS = ['feed', 'friends', 'marketplace', 'notifications', 'menu'];

  function showScreen(name) {
    const target = document.getElementById(`screen-${name}`);
    
    // Hide all non-overlay screens
    document.querySelectorAll('.screen:not(.overlay)').forEach(s => s.classList.remove('active'));
    // Hide overlays
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }

    // Update tab active state
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-screen="${name}"]`);
    if (tab) tab.classList.add('active');

    // Update sliding indicator line
    const index = TAB_SCREENS.indexOf(name);
    if (index !== -1) {
      const indicator = document.getElementById('tab-indicator');
      if (indicator) {
        indicator.style.transform = `translateX(${index * 100}%)`;
      }
    }
  }

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
    } else if (screen === 'marketplace') {
      const grid = document.getElementById('marketplace-grid');
      if (grid) {
        grid.innerHTML = Array(4).fill(0).map(() => `
          <div class="skeleton-card" style="padding: 0; border-radius: 8px; overflow: hidden">
            <div class="skeleton-line image" style="height: 140px; margin: 0"></div>
            <div style="padding: 8px; display: flex; flex-direction: column; gap: 6px">
              <div class="skeleton-line title" style="width: 40%"></div>
              <div class="skeleton-line sub" style="width: 80%"></div>
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

  function navigateToState(screen, params = {}) {
    showScreen(screen);

    if (screen === 'profile') {
      const uid = params.userId !== undefined ? params.userId : 0;
      Profile.render(uid);
    } else if (screen === 'album') {
      Profile.renderAlbum();
    } else if (screen === 'messenger') {
      Messenger.renderList();
    } else {
      // Tab navigation
      if (TAB_SCREENS.includes(screen)) {
        showSkeletons(screen);
        
        setTimeout(() => {
          if (screen === 'marketplace') {
            renderMarketplace();
          } else if (screen === 'friends') {
            renderFriends();
          } else if (screen === 'notifications') {
            Notifications.render();
          } else if (screen === 'feed') {
            Feed.renderFeedOnly();
          }
        }, 250);
      }
    }
  }

  function push(screen, params = {}) {
    if (TAB_SCREENS.includes(screen)) {
      history.replaceState({ screen, params }, '', '#' + screen);
      navigateToState(screen, params);
    } else {
      history.pushState({ screen, params }, '', '#' + screen);
      navigateToState(screen, params);
    }
  }

  function pop() {
    history.back();
  }

  function init() {
    // Setup initial state
    if (!history.state) {
      const initialScreen = location.hash.replace('#', '') || 'feed';
      const validScreen = TAB_SCREENS.includes(initialScreen) ? initialScreen : 'feed';
      history.replaceState({ screen: validScreen, params: {} }, '', '#' + validScreen);
      navigateToState(validScreen);
    } else {
      navigateToState(history.state.screen, history.state.params);
    }

    // Popstate history listener
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.screen) {
        navigateToState(e.state.screen, e.state.params);
      } else {
        navigateToState('feed');
      }
    });

    // Tab navigation clicks
    document.querySelectorAll('.tab[data-screen]').forEach(tab => {
      tab.addEventListener('click', () => {
        const screen = tab.dataset.screen;
        push(screen);
      });
    });

    // Back buttons click bindings
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', pop);
    });

    const profileBackBtn = document.getElementById('profile-back-btn');
    if (profileBackBtn) {
      profileBackBtn.addEventListener('click', pop);
    }

    const albumBackBtn = document.getElementById('album-back-btn');
    if (albumBackBtn) {
      albumBackBtn.addEventListener('click', pop);
    }

    // Profile menu row click binding
    const menuProfileRow = document.getElementById('menu-profile-row');
    if (menuProfileRow) {
      menuProfileRow.addEventListener('click', () => {
        push('profile', { userId: 0 });
      });
    }
  }

  function renderMarketplace() {
    const grid = document.getElementById('marketplace-grid');
    grid.innerHTML = DATA.marketplaceItems.map(item => `
      <div class="market-card">
        <img src="${item.img}" loading="lazy" alt="${item.title}">
        <div class="market-info">
          <div class="market-price">${item.price}</div>
          <div class="market-title">${item.title}</div>
          <div class="market-title">${item.location}</div>
        </div>
      </div>
    `).join('');
  }

  function renderFriends() {
    const list = document.getElementById('friends-list');
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

// FRIEND REQUEST ACTIONS
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
