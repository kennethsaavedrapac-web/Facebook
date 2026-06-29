// ─── FEED ─────────────────────────────────────────────────────────────────────

window.Feed = (() => {

  let currentPhotoList = [];
  let currentPhotoIndex = -1;
  let currentZoom = 1;

  function privacyIcon(p) {
    if (p === 'public') return '🌐';
    if (p === 'friends') return '👥';
    return '🔒';
  }

  function imageGrid(images) {
    if (!images || images.length === 0) return '';
    const n = images.length;
    if (n === 1) {
      return `<div class="post-images img-grid-1"><img src="${images[0]}" loading="lazy" data-photo="${images[0]}"></div>`;
    }
    if (n === 2) {
      return `<div class="post-images img-grid-2">
        ${images.map(u => `<img src="${u}" loading="lazy" data-photo="${u}">`).join('')}
      </div>`;
    }
    if (n === 3) {
      return `<div class="post-images img-grid-3">
        ${images.map(u => `<img src="${u}" loading="lazy" data-photo="${u}">`).join('')}
      </div>`;
    }
    // 4+ layout matching the K-pop / BTS layout
    const visible = images.slice(0, 4);
    const extra = n - 4;
    return `<div class="post-images img-grid-4">
      ${visible.map((u, i) => {
        if (i === 3 && extra > 0) {
          return `<div class="img-more" data-photo="${u}"><img src="${u}" loading="lazy"><div class="img-more-count">+${extra + 1}</div></div>`;
        }
        return `<img src="${u}" loading="lazy" data-photo="${u}">`;
      }).join('')}
    </div>`;
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num;
  }

  function reactionSummary(reactions) {
    const entries = Object.entries(reactions || {});
    if (entries.length === 0) return '';
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const circles = entries.slice(0, 3).map(([k]) =>
      `<span class="reaction-circle rc-${k}">${{like:'👍',love:'❤️',haha:'😂',wow:'😮',sad:'😢',angry:'😡'}[k]}</span>`
    ).join('');
    return `<div class="post-reactions-summary"><div class="reaction-circles">${circles}</div> <span>${formatNumber(total)}</span></div>`;
  }

  function renderPost(post) {
    const user = DATA.users.find(u => u.id === post.userId) || DATA.me;
    const hasReaction = post._myReaction;
    
    // Exact outline SVGs for Like, Comment, Share buttons
    const activeReactionColor = hasReaction ? 'var(--fb-blue)' : 'currentColor';
    const activeText = hasReaction 
      ? { like:'Like', love:'Love', haha:'Haha', wow:'Wow', sad:'Sad', angry:'Angry' }[hasReaction]
      : 'Like';

    return `
    <div class="post-card" data-post-id="${post.id}">
      <div class="post-header">
        <img src="${user.avatar}" class="avatar" data-profile="${user.id}">
        <div class="post-info">
          <div class="post-author" data-profile="${user.id}">${user.name}</div>
          <div class="post-meta">${post.time} · ${privacyIcon(post.privacy)}</div>
        </div>
        <button class="post-options-btn">•••</button>
      </div>
      ${post.text ? `<div class="post-text">${post.text}</div>` : ''}
      ${imageGrid(post.images)}
      <div class="post-stats">
        ${reactionSummary(post.reactions)}
        <span class="post-stats-comments">${post.commentCount} Comments</span>
      </div>
      <div class="post-actions">
        <button class="post-action-btn btn-like ${hasReaction ? 'reacted' : ''}" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${activeReactionColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          <span style="color: ${activeReactionColor}">${activeText}</span>
        </button>
        <button class="post-action-btn btn-comment" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Comment
        </button>
        <button class="post-action-btn btn-share" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Share
        </button>
      </div>
    </div>`;
  }

  function renderStories() {
    const bar = document.getElementById('stories-bar');
    if (!bar) return;
    bar.innerHTML = DATA.stories.map(s => {
      const user = DATA.users.find(u => u.id === s.userId);
      return `<div class="story-card">
        <img src="${s.img}" alt="" loading="lazy">
        <img src="${user.avatar}" class="story-avatar" loading="lazy">
        <div class="story-name">${user.name.split(' ')[0]}</div>
      </div>`;
    }).join('');
  }

  function renderFeedOnly() {
    const container = document.getElementById('feed-posts');
    if (container) {
      container.innerHTML = DATA.posts.map(renderPost).join('');
      bindFeedEvents();
    }
  }

  function renderFeed() {
    renderStories();
    renderFeedOnly();
  }

  // ── REACTION PICKER ────────────────────────────────────────────────────────
  let pressTimer = null;
  let pressTarget = null;

  function startPress(e, postId) {
    pressTarget = postId;
    pressTimer = setTimeout(() => {
      showReactionPicker(postId, e);
    }, 550);
  }
  
  function cancelPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  function showReactionPicker(postId, e) {
    const picker = document.getElementById('reaction-picker');
    if (!picker) return;
    picker.classList.remove('hidden');
    // Force transition reflow
    picker.offsetHeight;
    picker.classList.add('show');
    picker.dataset.postId = postId;
  }

  function hideReactionPicker() {
    const picker = document.getElementById('reaction-picker');
    if (!picker) return;
    picker.classList.remove('show');
    setTimeout(() => {
      if (!picker.classList.contains('show')) {
        picker.classList.add('hidden');
      }
    }, 200);
    delete picker.dataset.postId;
  }

  function bindFeedEvents() {
    const container = document.getElementById('feed-posts');
    if (!container) return;

    // Profile navigation
    container.querySelectorAll('[data-profile]').forEach(el => {
      el.addEventListener('click', e => {
        const uid = parseInt(el.dataset.profile);
        Router.push('profile', { userId: uid });
      });
    });

    // Photo viewer with dynamic gallery scan
    container.querySelectorAll('[data-photo]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const postCard = el.closest('.post-card');
        const photoEls = Array.from(postCard.querySelectorAll('[data-photo]'));
        const photos = photoEls.map(img => img.dataset.photo || img.closest('.img-more').dataset.photo);
        openPhoto(el.dataset.photo || el.closest('.img-more').dataset.photo, photos);
      });
    });

    // Like button (tap = like, long press = reactions)
    container.querySelectorAll('.btn-like').forEach(btn => {
      const postId = parseInt(btn.dataset.postId);

      btn.addEventListener('mousedown', e => startPress(e, postId));
      btn.addEventListener('touchstart', e => startPress(e, postId), { passive: true });
      btn.addEventListener('mouseup', cancelPress);
      btn.addEventListener('touchend', cancelPress);

      btn.addEventListener('click', () => {
        const post = DATA.posts.find(p => p.id === postId);
        if (!post._myReaction) {
          post._myReaction = 'like';
          post.reactions.like = (post.reactions.like || 0) + 1;
        } else {
          post.reactions[post._myReaction]--;
          delete post._myReaction;
        }
        
        // Re-render this card
        const card = container.querySelector(`[data-post-id="${postId}"]`);
        if (card) {
          card.outerHTML = renderPost(post);
          bindFeedEvents();
        }
        
        // Trigger Event
        document.dispatchEvent(new CustomEvent('fb:liked', { detail: { postId } }));
      });
    });

    // Comments
    container.querySelectorAll('.btn-comment').forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = parseInt(btn.dataset.postId);
        openComments(postId);
      });
    });

    // Share
    container.querySelectorAll('.btn-share').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Compartido en tu biografía (simulado)');
      });
    });
  }

  // ── PHOTO VIEWER ───────────────────────────────────────────────────────────
  function openPhoto(src, photos = []) {
    const viewer = document.getElementById('photo-viewer');
    if (!viewer) return;

    currentPhotoList = photos.length > 0 ? photos : [src];
    currentPhotoIndex = currentPhotoList.indexOf(src);
    if (currentPhotoIndex === -1) currentPhotoIndex = 0;

    // Track photo event
    document.dispatchEvent(new CustomEvent('fb:photoOpened'));

    viewer.innerHTML = `
      <button id="photo-close">✕</button>
      <div class="pv-wrapper" id="pv-wrapper">
        <img id="photo-img" src="${src}" alt="" style="transform: translate3d(0, 0, 0) scale(1)">
      </div>
      ${currentPhotoList.length > 1 ? `
        <button class="pv-nav-btn prev" id="pv-prev">‹</button>
        <button class="pv-nav-btn next" id="pv-next">›</button>
      ` : ''}
    `;

    viewer.classList.remove('hidden');

    document.getElementById('photo-close').onclick = closePhoto;
    document.getElementById('pv-wrapper').onclick = (e) => {
      if (e.target.id === 'pv-wrapper' || e.target.id === 'photo-img') {
        // Wait, if they click the image, don't close unless they wanted to, 
        // actually clicking the black space (pv-wrapper) should close it.
        // So checking if target is pv-wrapper is perfect!
      }
      if (e.target.id === 'pv-wrapper') {
        closePhoto();
      }
    };

    if (currentPhotoList.length > 1) {
      document.getElementById('pv-prev').onclick = (e) => {
        e.stopPropagation();
        navigatePhoto(-1);
      };
      document.getElementById('pv-next').onclick = (e) => {
        e.stopPropagation();
        navigatePhoto(1);
      };
    }

    initPhotoGestures();
  }

  function navigatePhoto(direction) {
    currentPhotoIndex += direction;
    if (currentPhotoIndex < 0) currentPhotoIndex = currentPhotoList.length - 1;
    if (currentPhotoIndex >= currentPhotoList.length) currentPhotoIndex = 0;

    const img = document.getElementById('photo-img');
    if (img) {
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = currentPhotoList[currentPhotoIndex];
        img.style.transform = 'translate3d(0, 0, 0) scale(1)';
        img.style.opacity = '1';
        currentZoom = 1;
      }, 120);
    }
  }

  function initPhotoGestures() {
    const wrapper = document.getElementById('pv-wrapper');
    const img = document.getElementById('photo-img');
    const viewer = document.getElementById('photo-viewer');
    if (!wrapper || !img) return;

    let startX = 0, startY = 0;
    let deltaX = 0, deltaY = 0;
    let isDragging = false;
    let isPinching = false;
    let startDistance = 0;
    let initialZoom = 1;

    wrapper.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        isPinching = false;
        img.style.transition = 'none';
      } else if (e.touches.length === 2) {
        isDragging = false;
        isPinching = true;
        startX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        startY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        startDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialZoom = currentZoom;
      }
    }, { passive: true });

    wrapper.addEventListener('touchmove', e => {
      if (isDragging && currentZoom === 1) {
        deltaX = e.touches[0].clientX - startX;
        deltaY = e.touches[0].clientY - startY;

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          img.style.transform = `translate3d(0, ${deltaY}px, 0) scale(1)`;
          const opacity = Math.max(0.3, 1 - Math.abs(deltaY) / 400);
          viewer.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
        } else if (currentPhotoList.length > 1) {
          img.style.transform = `translate3d(${deltaX}px, 0, 0) scale(1)`;
        }
      } else if (isDragging && currentZoom > 1) {
        deltaX = e.touches[0].clientX - startX;
        deltaY = e.touches[0].clientY - startY;
        img.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${currentZoom})`;
      } else if (isPinching && e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = dist / startDistance;
        currentZoom = Math.min(Math.max(1, initialZoom * scale), 3);
        img.style.transform = `translate3d(0, 0, 0) scale(${currentZoom})`;
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', e => {
      if (isDragging) {
        isDragging = false;
        img.style.transition = 'transform 0.2s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.15s';

        if (Math.abs(deltaY) > 130 && currentZoom === 1) {
          closePhoto();
        } else if (Math.abs(deltaX) > 90 && currentZoom === 1 && currentPhotoList.length > 1) {
          const dir = deltaX > 0 ? -1 : 1;
          navigatePhoto(dir);
        } else {
          img.style.transform = `translate3d(0, 0, 0) scale(${currentZoom})`;
          viewer.style.backgroundColor = 'black';
        }
      }
      isPinching = false;
      deltaX = 0;
      deltaY = 0;
    });

    // Double tap to Zoom
    let lastTap = 0;
    wrapper.addEventListener('click', () => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        img.style.transition = 'transform 0.2s';
        if (currentZoom > 1) {
          currentZoom = 1;
          img.style.transform = 'translate3d(0, 0, 0) scale(1)';
        } else {
          currentZoom = 2.2;
          img.style.transform = 'translate3d(0, 0, 0) scale(2.2)';
        }
      }
      lastTap = currentTime;
    });
  }

  function closePhoto() {
    const viewer = document.getElementById('photo-viewer');
    if (viewer) {
      viewer.classList.add('hidden');
      viewer.style.backgroundColor = 'black';
    }
  }

  // ── COMMENTS SHEET ─────────────────────────────────────────────────────────
  function openComments(postId) {
    const post = DATA.posts.find(p => p.id === postId);
    const sheet = document.getElementById('comments-sheet');
    const backdrop = document.getElementById('comments-backdrop');
    const list = document.getElementById('comments-list');
    if (!post || !sheet || !backdrop || !list) return;

    list.innerHTML = (post.comments || []).map(c => {
      const user = c.userId === 0 ? DATA.me : DATA.users.find(u => u.id === c.userId);
      return `<div class="comment-item">
        <img src="${user.avatar}" class="avatar-sm">
        <div class="comment-bubble">
          <div class="comment-author">${user.name}</div>
          <div class="comment-text">${c.text}</div>
        </div>
      </div>`;
    }).join('');

    sheet.classList.remove('hidden');
    backdrop.classList.remove('hidden');

    const sendBtn = document.getElementById('comment-send');
    const input = document.getElementById('comment-input');
    
    sendBtn.onclick = () => {
      const text = input.value.trim();
      if (!text) return;
      post.comments.push({ userId: 0, text });
      post.commentCount++;
      input.value = '';
      openComments(postId); // reload
      
      // Update comments counter in feed card
      const card = document.querySelector(`#feed-posts [data-post-id="${postId}"]`);
      if (card) {
        card.outerHTML = renderPost(post);
        bindFeedEvents();
      }
    };
  }

  function closeComments() {
    document.getElementById('comments-sheet').classList.add('hidden');
    document.getElementById('comments-backdrop').classList.add('hidden');
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  function init() {
    renderStories();
    renderFeedOnly();

    document.getElementById('comments-close').onclick = closeComments;
    document.getElementById('comments-backdrop').onclick = closeComments;

    // Reactions setup inside the picker
    const picker = document.getElementById('reaction-picker');
    if (picker) {
      picker.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const postId = parseInt(picker.dataset.postId);
          const reaction = btn.dataset.reaction;
          if (postId) {
            const post = DATA.posts.find(p => p.id === postId);
            if (post) {
              if (post._myReaction) post.reactions[post._myReaction]--;
              post._myReaction = reaction;
              post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
              
              const card = document.querySelector(`#feed-posts [data-post-id="${postId}"]`);
              if (card) {
                card.outerHTML = renderPost(post);
                bindFeedEvents();
              }
            }
          }
          hideReactionPicker();
        };
      });
    }

    document.addEventListener('click', e => {
      if (picker && !e.target.closest('#reaction-picker') && !e.target.closest('.btn-like')) {
        hideReactionPicker();
      }
    });
  }

  return { init, openPhoto, openComments, renderFeedOnly };
})();
