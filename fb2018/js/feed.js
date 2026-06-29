// ─── FEED ─────────────────────────────────────────────────────────────────────

window.Feed = (() => {

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
    // 4+
    const visible = images.slice(0, 4);
    const extra = n - 4;
    return `<div class="post-images img-grid-4">
      ${visible.map((u, i) => {
        if (i === 3 && extra > 0) {
          return `<div class="img-more"><img src="${u}" loading="lazy"><div class="img-more-count">+${extra + 1}</div></div>`;
        }
        return `<img src="${u}" loading="lazy" data-photo="${u}">`;
      }).join('')}
    </div>`;
  }

  function reactionSummary(reactions) {
    const entries = Object.entries(reactions || {});
    if (entries.length === 0) return '';
    const total = entries.reduce((s, [, v]) => s + v, 0);
    const circles = entries.slice(0, 3).map(([k]) =>
      `<span class="reaction-circle rc-${k}">${{like:'👍',love:'❤️',haha:'😂',wow:'😮',sad:'😢',angry:'😡'}[k]}</span>`
    ).join('');
    return `<div class="post-reactions-summary">${circles} <span>${total}</span></div>`;
  }

  function renderPost(post) {
    const user = DATA.users.find(u => u.id === post.userId) || DATA.me;
    const hasReaction = post._myReaction;
    const reactionLabel = hasReaction
      ? { like:'Me gusta', love:'Me encanta', haha:'Me divierte', wow:'Me asombra', sad:'Me entristece', angry:'Me enoja' }[hasReaction]
      : 'Me gusta';

    return `
    <div class="post-card" data-post-id="${post.id}">
      <div class="post-header">
        <img src="${user.avatar}" class="avatar" data-profile="${user.id}">
        <div class="post-info">
          <div class="post-author" data-profile="${user.id}">${user.name}</div>
          <div class="post-meta">${post.time} · ${privacyIcon(post.privacy)}</div>
        </div>
        <button class="post-options-btn">···</button>
      </div>
      ${post.text ? `<div class="post-text">${post.text}</div>` : ''}
      ${imageGrid(post.images)}
      <div class="post-stats">
        ${reactionSummary(post.reactions)}
        <span>${post.commentCount} comentarios · ${post.shareCount} compartidos</span>
      </div>
      <div class="post-actions">
        <button class="post-action-btn btn-like ${hasReaction ? 'reacted' : ''}" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
          ${reactionLabel}
        </button>
        <button class="post-action-btn btn-comment" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          Comentar
        </button>
        <button class="post-action-btn btn-share" data-post-id="${post.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
          Compartir
        </button>
      </div>
    </div>`;
  }

  function renderStories() {
    const bar = document.getElementById('stories-bar');
    bar.innerHTML = DATA.stories.map(s => {
      const user = DATA.users.find(u => u.id === s.userId);
      return `<div class="story-card">
        <img src="${s.img}" alt="">
        <img src="${user.avatar}" class="story-avatar">
        <div class="story-name">${user.name.split(' ')[0]}</div>
      </div>`;
    }).join('');
  }

  function renderFeed() {
    const container = document.getElementById('feed-posts');
    container.innerHTML = DATA.posts.map(renderPost).join('');
    bindFeedEvents();
  }

  // ── LONG PRESS ────────────────────────────────────────────────────────────
  let pressTimer = null;
  let pressTarget = null;

  function startPress(e, postId) {
    pressTarget = postId;
    pressTimer = setTimeout(() => {
      showReactionPicker(postId, e);
    }, 500);
  }
  function cancelPress() {
    clearTimeout(pressTimer);
    pressTimer = null;
  }

  function showReactionPicker(postId, e) {
    const picker = document.getElementById('reaction-picker');
    picker.classList.remove('hidden');
    picker.dataset.postId = postId;
  }

  function hideReactionPicker() {
    const picker = document.getElementById('reaction-picker');
    picker.classList.add('hidden');
    delete picker.dataset.postId;
  }

  function bindFeedEvents() {
    const container = document.getElementById('feed-posts');

    // Profile navigation
    container.querySelectorAll('[data-profile]').forEach(el => {
      el.addEventListener('click', e => {
        const uid = parseInt(el.dataset.profile);
        Router.push('profile', { userId: uid });
      });
    });

    // Photo viewer
    container.querySelectorAll('[data-photo]').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        openPhoto(el.dataset.photo);
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
        // Re-render just this post
        const card = container.querySelector(`[data-post-id="${postId}"]`);
        card.outerHTML = renderPost(post);
        bindFeedEvents();
        // Trigger notification event
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
        alert('Compartido! (simulado)');
      });
    });
  }

  function openPhoto(src) {
    const viewer = document.getElementById('photo-viewer');
    document.getElementById('photo-img').src = src;
    viewer.classList.remove('hidden');
  }

  function openComments(postId) {
    const post = DATA.posts.find(p => p.id === postId);
    const sheet = document.getElementById('comments-sheet');
    const backdrop = document.getElementById('comments-backdrop');
    const list = document.getElementById('comments-list');

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
      openComments(postId); // re-render
    };
  }

  // Init
  function init() {
    renderStories();
    renderFeed();

    // Photo close
    document.getElementById('photo-close').addEventListener('click', () => {
      document.getElementById('photo-viewer').classList.add('hidden');
    });

    // Comments close
    document.getElementById('comments-close').addEventListener('click', closeComments);
    document.getElementById('comments-backdrop').addEventListener('click', closeComments);

    // Reaction picker
    document.getElementById('reaction-picker').querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const picker = document.getElementById('reaction-picker');
        const postId = parseInt(picker.dataset.postId);
        const reaction = btn.dataset.reaction;
        if (postId) {
          const post = DATA.posts.find(p => p.id === postId);
          if (post._myReaction) post.reactions[post._myReaction]--;
          post._myReaction = reaction;
          post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
          const card = document.querySelector(`#feed-posts [data-post-id="${postId}"]`);
          card.outerHTML = renderPost(post);
          bindFeedEvents();
        }
        hideReactionPicker();
      });
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('#reaction-picker') && !e.target.closest('.btn-like')) {
        hideReactionPicker();
      }
    });
  }

  function closeComments() {
    document.getElementById('comments-sheet').classList.add('hidden');
    document.getElementById('comments-backdrop').classList.add('hidden');
  }

  return { init, openPhoto, openComments };
})();
