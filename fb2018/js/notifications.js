// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

window.Notifications = (() => {

  const typeIcons = { like: '👍', love: '❤️', comment: '💬', friend: '👤' };

  function render() {
    const list = document.getElementById('notif-list');
    list.innerHTML = DATA.notifications.map(n => {
      const user = DATA.users.find(u => u.id === n.userId);
      return `<div class="notif-item ${n.unread ? 'unread' : ''}" data-notif="${n.id}">
        <div class="notif-avatar-wrap">
          <img src="${user.avatar}" class="avatar">
          <div class="notif-type-icon ${n.type}">${typeIcons[n.type] || '🔔'}</div>
        </div>
        <div class="notif-body">
          <div class="notif-text"><strong>${user.name}</strong> ${n.text}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        ${n.thumb ? `<img src="${n.thumb}" class="notif-thumb">` : ''}
      </div>`;
    }).join('');

    list.querySelectorAll('[data-notif]').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.notif);
        const notif = DATA.notifications.find(n => n.id === id);
        if (notif) notif.unread = false;
        el.classList.remove('unread');
        updateBadge();
      });
    });
  }

  function updateBadge() {
    const badge = document.getElementById('notif-badge');
    const count = DATA.notifications.filter(n => n.unread).length;
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  function showBanner(text) {
    const banner = document.getElementById('notif-banner');
    banner.textContent = text;
    banner.classList.remove('hidden');
    banner.classList.add('show');
    setTimeout(() => {
      banner.classList.remove('show');
      setTimeout(() => banner.classList.add('hidden'), 300);
    }, 3000);
  }

  function pushNotification(userId, type, text) {
    const newNotif = {
      id: Date.now(),
      userId,
      type,
      text,
      time: 'Ahora',
      unread: true,
      thumb: null,
    };
    DATA.notifications.unshift(newNotif);
    updateBadge();
    const user = DATA.users.find(u => u.id === userId);
    showBanner(`${user.name} ${text}`);
    render();
  }

  // Simulated event-driven notifications
  let scrollCount = 0;
  let likeCount = 0;

  document.addEventListener('fb:liked', () => {
    likeCount++;
    if (likeCount === 2) {
      setTimeout(() => pushNotification(3, 'like', 'también dio Me gusta a tu publicación.'), 2000);
    }
  });

  document.addEventListener('scroll', () => {}, { passive: true });

  function init() {
    updateBadge();
    render();

    // Mark all as read when visiting notifications tab
    document.querySelector('[data-screen="notifications"]').addEventListener('click', () => {
      setTimeout(() => {
        DATA.notifications.forEach(n => n.unread = false);
        render();
        updateBadge();
      }, 500);
    });

    // Trigger a notification after a few seconds as demo
    setTimeout(() => {
      pushNotification(5, 'comment', 'te mencionó en un comentario.');
    }, 8000);
  }

  return { init, render, updateBadge, showBanner, pushNotification };
})();
