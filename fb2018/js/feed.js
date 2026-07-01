// ─── FEED ─────────────────────────────────────────────────────────────────────

window.FeedStore = (() => {

  let posts = [];
  let scrollPosition = 0;
  let isRendered = false;

  let currentPhotoList = [];
  let currentPhotoIndex = -1;
  let currentZoom = 1;

  function parsePostId(idStr) {
    if (!idStr) return null;
    if (typeof idStr === 'string' && idStr.startsWith('profile-post-')) {
      return idStr;
    }
    return parseInt(idStr, 10);
  }

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
    
    const activeReactionColor = hasReaction ? 'var(--fb-blue)' : 'currentColor';
    const activeText = hasReaction 
      ? { like:'Me gusta', love:'Me encanta', haha:'Haha', wow:'Asombra', sad:'Entristece', angry:'Enoja' }[hasReaction]
      : 'Me gusta';

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
        <span class="post-stats-comments">${post.commentCount} comentarios</span>
      </div>
      <div class="post-actions">
        <button class="post-action-btn btn-like ${hasReaction ? 'reacted' : ''}" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${activeReactionColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
          <span style="color: ${activeReactionColor}">${activeText}</span>
        </button>
        <button class="post-action-btn btn-comment" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          Comentar
        </button>
        <button class="post-action-btn btn-share" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          Compartir
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
    if (posts.length === 0) {
      posts = JSON.parse(JSON.stringify(DATA.posts));
    }
    const container = document.getElementById('feed-posts');
    if (container) {
      container.innerHTML = posts.map(renderPost).join('');
      bindFeedEvents(container);
    }
    const createAvatar = document.querySelector('#create-post-bar img');
    if (createAvatar) {
      createAvatar.src = DATA.me.avatar;
    }
    isRendered = true;
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
    picker.offsetHeight; // Force reflow
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

  function bindPostEvents(card) {
    if (card.dataset.eventsBound) return;
    card.dataset.eventsBound = "true";

    // Profile navigation
    card.querySelectorAll('[data-profile]').forEach(el => {
      el.addEventListener('click', e => {
        const uid = parseInt(el.dataset.profile);
        Router.push('profile', { userId: uid });
      });
    });

    // Photo viewer
    card.querySelectorAll('[data-photo]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        const postCard = el.closest('.post-card');
        const photoEls = Array.from(postCard.querySelectorAll('[data-photo]'));
        const photos = photoEls.map(img => img.dataset.photo || img.closest('.img-more').dataset.photo);
        openPhoto(el.dataset.photo || el.closest('.img-more').dataset.photo, photos);
      });
    });

    // Like button (tap = like, long press = reactions)
    const likeBtn = card.querySelector('.btn-like');
    if (likeBtn) {
      const postId = parsePostId(likeBtn.dataset.postId);

      likeBtn.addEventListener('mousedown', e => startPress(e, postId));
      likeBtn.addEventListener('touchstart', e => startPress(e, postId), { passive: true });
      likeBtn.addEventListener('mouseup', cancelPress);
      likeBtn.addEventListener('touchend', cancelPress);

      likeBtn.addEventListener('click', () => {
        const post = window.getPostById(postId);
        if (!post) return;

        if (!post._myReaction) {
          post._myReaction = 'like';
          post.reactions.like = (post.reactions.like || 0) + 1;
        } else {
          post.reactions[post._myReaction]--;
          delete post._myReaction;
        }
        
        window.updatePostCardInDOM(postId, post);
        
        // Trigger Event
        document.dispatchEvent(new CustomEvent('fb:liked', { detail: { postId } }));
      });
    }

    // Comments button
    const commentBtn = card.querySelector('.btn-comment');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        const postId = parsePostId(commentBtn.dataset.postId);
        openComments(postId);
      });
    }

    // Share button
    const shareBtn = card.querySelector('.btn-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        alert('Publicación compartida en tu biografía.');
      });
    }
  }

  function bindFeedEvents(container) {
    container = container || document.getElementById('feed-posts');
    if (!container) return;
    container.querySelectorAll('.post-card').forEach(card => {
      bindPostEvents(card);
    });
  }

  // ── PHOTO VIEWER ───────────────────────────────────────────────────────────
  function openPhoto(src, photos = []) {
    const viewer = document.getElementById('photo-viewer');
    if (!viewer) return;

    currentPhotoList = photos.length > 0 ? photos : [src];
    currentPhotoIndex = currentPhotoList.indexOf(src);
    if (currentPhotoIndex === -1) currentPhotoIndex = 0;

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

  function closePhoto() {
    const viewer = document.getElementById('photo-viewer');
    if (viewer) {
      viewer.classList.add('hidden');
      viewer.style.backgroundColor = 'black';
    }
  }

  // ── COMMENTS SHEET ─────────────────────────────────────────────────────────
  function openComments(postId) {
    const post = window.getPostById(postId);
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

    const inputRowImg = sheet.querySelector('#comments-input-row img');
    if (inputRowImg) {
      inputRowImg.src = DATA.me.avatar;
    }

    sheet.classList.remove('hidden');
    backdrop.classList.remove('hidden');

    const sendBtn = document.getElementById('comment-send');
    const input = document.getElementById('comment-input');
    
    sendBtn.onclick = () => {
      const text = input.value.trim();
      if (!text) return;
      post.comments = post.comments || [];
      post.comments.push({ userId: 0, text });
      post.commentCount++;
      input.value = '';
      openComments(postId); // reload
      
      // Update comment counter in post card
      window.updatePostCardInDOM(postId, post);
    };
  }

  function closeComments() {
    document.getElementById('comments-sheet').classList.add('hidden');
    document.getElementById('comments-backdrop').classList.add('hidden');
  }

  // ── INIT ───────────────────────────────────────────────────────────────────
  function init() {
    if (posts.length === 0) {
      posts = JSON.parse(JSON.stringify(DATA.posts));
    }
    renderStories();
    renderFeedOnly();

    document.getElementById('comments-close').onclick = closeComments;
    document.getElementById('comments-backdrop').onclick = closeComments;

    // Reactions setup inside the picker
    const picker = document.getElementById('reaction-picker');
    if (picker) {
      picker.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
          const postId = parsePostId(picker.dataset.postId);
          const reaction = btn.dataset.reaction;
          if (postId) {
            const post = window.getPostById(postId);
            if (post) {
              if (post._myReaction) post.reactions[post._myReaction]--;
              post._myReaction = reaction;
              post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
              
              window.updatePostCardInDOM(postId, post);
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

  return {
    get posts() { return posts; },
    set posts(v) { posts = v; },
    get scrollPosition() { return scrollPosition; },
    set scrollPosition(v) { scrollPosition = v; },
    get isRendered() { return isRendered; },
    set isRendered(v) { isRendered = v; },
    
    init,
    openPhoto,
    openComments,
    renderFeedOnly,
    renderPost,
    bindFeedEvents,
    bindPostEvents
  };
})();

// Global Helpers for unmixed state handling
window.getPostById = function(postId) {
  const idStr = String(postId);
  if (idStr.startsWith('profile-post-')) {
    return window.ProfileStore ? window.ProfileStore.posts.find(p => String(p.id) === idStr) : null;
  }
  const numericId = parseInt(postId, 10);
  return window.FeedStore ? window.FeedStore.posts.find(p => p.id === numericId) : null;
};

window.updatePostCardInDOM = function(postId, post) {
  const card = document.querySelector(`[data-post-id="${postId}"]`);
  if (!card) return;

  const idStr = String(postId);
  const isProfile = idStr.startsWith('profile-post-');
  const html = isProfile 
    ? window.ProfileStore.renderPost(post) 
    : window.FeedStore.renderPost(post);

  const temp = document.createElement('div');
  temp.innerHTML = html.trim();
  const newCard = temp.firstChild;
  card.parentNode.replaceChild(newCard, card);

  if (isProfile) {
    window.ProfileStore.bindPostEvents(newCard);
  } else {
    window.FeedStore.bindPostEvents(newCard);
  }
};

window.Feed = window.FeedStore;

