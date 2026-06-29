// ─── MAIN ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // Clock
  function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}`;
  }
  updateClock();
  setInterval(updateClock, 30000);

  // Init modules
  Feed.init();
  Messenger.init();
  Notifications.init();
  Router.init();

  // Message badge from data
  const msgBadge = document.getElementById('msg-badge');
  const unreadThreads = DATA.threads.filter(t => t.unread).length;
  if (unreadThreads > 0) {
    msgBadge.textContent = unreadThreads;
    msgBadge.classList.remove('hidden');
  }

  // New message badge
  document.addEventListener('fb:newMessage', () => {
    // badge already handled by messenger events if needed
  });

});
