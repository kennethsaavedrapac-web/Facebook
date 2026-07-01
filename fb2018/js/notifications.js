// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

window.Notifications = (() => {

  const typeIcons = { like: '👍', love: '❤️', comment: '💬', friend: '👤' };

  function render() {
    const list = document.getElementById('notif-list');
    if (!list) return;
    
    if (DATA.notifications.length === 0) {
      list.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-secondary); font-size: 14px; background: white;">
          No tienes notificaciones por el momento.
        </div>
      `;
      return;
    }

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
        
        // If it is a comment, show comments sheet on feed
        if (notif && notif.type === 'comment') {
          Router.push('feed');
          setTimeout(() => {
            // Find post 1 (Miraculous) or post 2 (BTS) to open comments
            const targetPost = FeedStore.posts.find(p => p.userId === notif.userId) || FeedStore.posts[0];
            if (targetPost) {
              Feed.openComments(targetPost.id);
            }
          }, 400);
        } else {
          // Navigate to profile
          Router.push('profile', { userId: notif.userId });
        }
      });
    });
  }

  function updateBadge() {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    const count = DATA.notifications.filter(n => n.unread).length;
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  let bannerTimeout = null;

  function showBanner(text, actionText = null, actionCallback = null) {
    const banner = document.getElementById('notif-banner');
    if (!banner) return;
    
    // Clear previous timeouts
    if (bannerTimeout) {
      clearTimeout(bannerTimeout);
      banner.classList.remove('show');
    }

    // Set content
    banner.innerHTML = `
      <div style="flex:1; margin-right:8px; line-height: 1.3;">${text}</div>
      ${actionText ? `<span id="notif-banner-action">${actionText}</span>` : ''}
    `;

    banner.classList.remove('hidden');
    
    // Force reflow for transitions
    banner.offsetHeight; 
    banner.classList.add('show');

    if (actionText && actionCallback) {
      const actionBtn = banner.querySelector('#notif-banner-action');
      if (actionBtn) {
        actionBtn.onclick = (e) => {
          e.stopPropagation();
          banner.classList.remove('show');
          actionCallback();
        };
      }
    }

    bannerTimeout = setTimeout(() => {
      banner.classList.remove('show');
      bannerTimeout = null;
    }, 4500);
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
    
    // Play Notification Sound if available
    if (window.playNotificationSound) {
      window.playNotificationSound();
    } else if (typeof playNotificationSound === 'function') {
      playNotificationSound();
    }

    // Vibrate device
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }

    const user = DATA.users.find(u => u.id === userId);
    showBanner(`${user.name} ${text}`, "Ver", () => {
      Router.push('notifications');
    });
    
    render();
  }

  let likeCount = 0;

  document.addEventListener('fb:liked', () => {
    likeCount++;
    if (likeCount === 1) {
      // Miraculous Fan comments your post
      setTimeout(() => {
        pushNotification(2, 'comment', 'comentó tu publicación sobre Miraculous.');
      }, 5000);
    } else if (likeCount === 2) {
      // ARMY Forever likes your post
      setTimeout(() => {
        pushNotification(1, 'like', 'reaccionó a tu publicación.');
      }, 4000);
    }
  });

  function init() {
    updateBadge();
    render();

    // Mark all as read when visiting notifications tab
    const tabNotif = document.querySelector('.tab[data-screen="notifications"]');
    if (tabNotif) {
      tabNotif.addEventListener('click', () => {
        setTimeout(() => {
          DATA.notifications.forEach(n => n.unread = false);
          render();
          updateBadge();
        }, 350);
      });
    }

    // Trigger initial notification delay to simulate real network updates
    setTimeout(() => {
      pushNotification(1, 'love', 'le encantó tu foto de perfil.');
    }, 12000);
  }

  return { init, render, updateBadge, showBanner, pushNotification };
})();
