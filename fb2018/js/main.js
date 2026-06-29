// ─── MAIN ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Clock
  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const clock = document.getElementById('clock');
    if (clock) clock.textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Init modules
  Feed.init();
  Messenger.init();
  Notifications.init();
  Router.init();
  
  // Custom Ripple system, Pull to refresh, Event manager
  initRipples();
  initPullToRefresh();
  window.EventManager.init();

  // Message badge from data
  const msgBadge = document.getElementById('msg-badge');
  const unreadThreads = DATA.threads.filter(t => t.unread).length;
  if (unreadThreads > 0 && msgBadge) {
    msgBadge.textContent = unreadThreads;
    msgBadge.classList.remove('hidden');
  }

});

// RIPPLE SYSTEM
function initRipples() {
  document.addEventListener('pointerdown', e => {
    const target = e.target.closest('.tab, .topbar-icon-btn, .post-action-btn, .create-post-input, .btn-primary, .btn-secondary, #menu-list li, #btn-camera, #btn-messenger, .chat-icon-btn');
    if (!target) return;

    target.classList.add('ripple-container');

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const wave = document.createElement('span');
    wave.className = 'ripple-wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;

    const size = Math.max(rect.width, rect.height) * 2;
    wave.style.width = `${size}px`;
    wave.style.height = `${size}px`;
    wave.style.marginLeft = `${-size / 2}px`;
    wave.style.marginTop = `${-size / 2}px`;

    if (target.closest('#topbar-blue, #status-bar') || target.classList.contains('btn-primary')) {
      target.classList.add('ripple-light');
    }

    target.appendChild(wave);

    if (navigator.vibrate) {
      navigator.vibrate(12);
    }

    setTimeout(() => {
      wave.remove();
    }, 450);
  });
}

// PULL TO REFRESH
function initPullToRefresh() {
  const feedScreen = document.getElementById('screen-feed');
  if (!feedScreen) return;
  
  const container = feedScreen.querySelector('.ptr-container');
  const loader = feedScreen.querySelector('.ptr-loading');
  if (!container || !loader) return;

  let startY = 0;
  let currentY = 0;
  let pulling = false;
  const threshold = 70; // px

  feedScreen.addEventListener('touchstart', e => {
    if (feedScreen.scrollTop === 0) {
      startY = e.touches[0].pageY;
      pulling = true;
    }
  }, { passive: true });

  feedScreen.addEventListener('touchmove', e => {
    if (!pulling) return;
    currentY = e.touches[0].pageY;
    const diff = currentY - startY;

    if (diff > 0) {
      const y = Math.min(diff * 0.4, threshold + 25);
      container.style.transform = `translateY(${y}px)`;
      loader.style.top = `${-40 + y}px`;
      loader.classList.add('pulling');
      
      const angle = Math.min(diff * 3, 360);
      loader.style.transform = `translateX(-50%) rotate(${angle}deg)`;
    }
  }, { passive: true });

  feedScreen.addEventListener('touchend', () => {
    if (!pulling) return;
    pulling = false;
    const diff = currentY - startY;

    if (diff * 0.4 >= threshold) {
      container.style.transform = `translateY(50px)`;
      loader.style.top = `10px`;
      
      showFeedSkeletons();
      
      setTimeout(() => {
        Feed.init();
        container.style.transform = '';
        loader.style.top = '';
        loader.classList.remove('pulling');
        loader.style.transform = '';
      }, 1500);
    } else {
      container.style.transform = '';
      loader.style.top = '';
      loader.classList.remove('pulling');
      loader.style.transform = '';
    }
    startY = 0;
    currentY = 0;
  });
}

function showFeedSkeletons() {
  const postsContainer = document.getElementById('feed-posts');
  if (!postsContainer) return;
  
  postsContainer.innerHTML = `
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-meta">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line sub"></div>
        </div>
      </div>
      <div class="skeleton-line text"></div>
      <div class="skeleton-line text" style="width:75%"></div>
      <div class="skeleton-line image"></div>
    </div>
    <div class="skeleton-card">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-meta">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line sub"></div>
        </div>
      </div>
      <div class="skeleton-line text"></div>
      <div class="skeleton-line image"></div>
    </div>
  `;
}

// WEB AUDIO CHIME SPREAD
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const now = ctx.currentTime;

    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Double chime
    osc.frequency.setValueAtTime(587.33, now); // D5
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.frequency.setValueAtTime(880, now + 0.13); // A5
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn("AudioContext chime failed:", e);
  }
}

// EVENT MANAGER
window.EventManager = (() => {
  let timeSpent = 0;
  let postsSeen = new Set();
  let scrollDistance = 0;
  let likesGiven = 0;
  let profilesOpened = 0;
  let imagesOpened = 0;
  let triggered = false;

  function init() {
    setInterval(() => {
      timeSpent++;
      checkTriggers();
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    document.addEventListener('fb:liked', () => {
      likesGiven++;
      checkTriggers();
    });

    const originalPush = Router.push;
    Router.push = function (screen, params) {
      if (screen === 'profile') {
        profilesOpened++;
        checkTriggers();
      }
      return originalPush.apply(this, arguments);
    };

    document.addEventListener('fb:photoOpened', () => {
      imagesOpened++;
      checkTriggers();
    });
  }

  function handleScroll() {
    scrollDistance = Math.max(scrollDistance, window.scrollY);

    const posts = document.querySelectorAll('.post-card');
    posts.forEach(p => {
      const rect = p.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        const id = p.dataset.postId;
        if (id) {
          postsSeen.add(parseInt(id));
          checkTriggers();
        }
      }
    });
  }

  function checkTriggers() {
    if (triggered) return;

    if ((timeSpent >= 12 && postsSeen.size >= 2) || likesGiven >= 1 || timeSpent >= 25) {
      triggered = true;
      triggerFriendRequestFlow();
    }
  }

  function triggerFriendRequestFlow() {
    setTimeout(() => {
      DATA.friendRequests.push({ id: 99, userId: 5, mutualFriends: 12 });

      playNotificationSound();

      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      // Add friends badge
      const friendsTab = document.querySelector('.tab[data-screen="friends"]');
      if (friendsTab) {
        const existing = friendsTab.querySelector('.badge');
        if (existing) existing.remove();
        
        const friendsBadge = document.createElement('span');
        friendsBadge.className = 'badge';
        friendsBadge.id = 'friends-badge';
        friendsBadge.textContent = '1';
        friendsTab.appendChild(friendsBadge);
      }

      // Re-render friends list in real-time if currently viewing the friends tab
      const activeScreen = document.querySelector('.screen.active');
      if (activeScreen && activeScreen.id === 'screen-friends') {
        Router.renderFriends();
      }

      setTimeout(() => {
        Notifications.showBanner("María García te envió una solicitud de amistad.", "Ver", () => {
          Router.push('friends');
        });
      }, 1000);

    }, 1500);
  }

  return { init };
})();
