// ─── ROUTER ───────────────────────────────────────────────────────────────────

window.Router = (() => {

  const stack = ['feed'];

  const TAB_SCREENS = ['feed', 'friends', 'marketplace', 'notifications', 'menu'];
  const OVERLAY_SCREENS = ['profile', 'messenger'];

  function showScreen(name) {
    // Hide all non-overlay screens
    document.querySelectorAll('.screen:not(.overlay)').forEach(s => s.classList.remove('active'));
    // Hide overlays
    document.querySelectorAll('.screen.overlay').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('active');
    });

    const target = document.getElementById(`screen-${name}`);
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('active');
    }

    // Update tab active state
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.tab[data-screen="${name}"]`);
    if (tab) tab.classList.add('active');
  }

  function push(screen, params = {}) {
    stack.push(screen);

    if (screen === 'profile' && params.userId != null) {
      showScreen('profile');
      Profile.render(params.userId);
    } else if (screen === 'messenger') {
      showScreen('messenger');
      Messenger.renderList();
    } else {
      showScreen(screen);
    }
  }

  function pop() {
    if (stack.length > 1) stack.pop();
    const prev = stack[stack.length - 1];
    showScreen(prev);
  }

  function init() {
    // Tab navigation
    document.querySelectorAll('.tab[data-screen]').forEach(tab => {
      tab.addEventListener('click', () => {
        const screen = tab.dataset.screen;
        stack.length = 1;
        stack[0] = screen;
        push(screen);
      });
    });

    // Back buttons
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', pop);
    });

    // Marketplace render
    document.querySelector('[data-screen="marketplace"]').addEventListener('click', renderMarketplace);

    // Friends render
    document.querySelector('[data-screen="friends"]').addEventListener('click', renderFriends);
  }

  function renderMarketplace() {
    const grid = document.getElementById('marketplace-grid');
    if (grid.childElementCount > 0) return; // already rendered
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
    if (list.childElementCount > 0) return;
    list.innerHTML = `
      <div style="padding:12px 16px;font-weight:700;font-size:15px;background:white;border-bottom:1px solid var(--border)">
        Solicitudes de amistad (${DATA.friendRequests.length})
      </div>
      ${DATA.friendRequests.map(req => {
        const user = DATA.users.find(u => u.id === req.userId);
        return `<div class="friend-request-card">
          <img src="${user.avatar}" class="avatar-lg" data-profile="${user.id}" style="cursor:pointer">
          <div style="flex:1">
            <div style="font-weight:700;cursor:pointer" data-profile="${user.id}">${user.name}</div>
            <div style="font-size:13px;color:var(--text-secondary)">${req.mutualFriends} amigos en común</div>
            <div class="friend-actions">
              <button class="btn-primary" onclick="this.closest('.friend-request-card').remove()">Confirmar</button>
              <button class="btn-secondary" onclick="this.closest('.friend-request-card').remove()">Eliminar</button>
            </div>
          </div>
        </div>`;
      }).join('')}
      <div style="padding:12px 16px;font-weight:700;font-size:15px;background:white;border-top:8px solid var(--bg);border-bottom:1px solid var(--border)">
        Personas que quizás conozcas
      </div>
      ${DATA.users.slice(0, 4).map(user => `
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

    list.querySelectorAll('[data-profile]').forEach(el => {
      el.addEventListener('click', () => Router.push('profile', { userId: parseInt(el.dataset.profile) }));
    });
  }

  return { init, push, pop };
})();
