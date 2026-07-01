// ─── PROFILE ──────────────────────────────────────────────────────────────────

window.ProfileStore = (() => {

  const KNOWN_PHOTOS = [];
  for (let i = 1; i <= 18; i++) {
    KNOWN_PHOTOS.push(`fb2018/Perfil/Foto${i}.png`);
  }

  let detectedPhotos = [];
  let profilePosts = [];
  let scrollPosition = 0;

  // ── IN-MEMORY CACHE ──
  let _cacheUserId = null;
  let _cacheHTML = null;
  let _cacheUserPhotos = null;
  let _cacheUserPosts = null;
  let _dataInitialized = false;

  const DATES = [
    '2 de mayo de 2018 a las 14:32',   // Foto1.png (oldest)
    '5 de mayo de 2018 a las 11:15',   // Foto2.png
    '9 de mayo de 2018 a las 18:45',   // Foto3.png
    '12 de mayo de 2018 a las 09:20',  // Foto4.png
    '15 de mayo de 2018 a las 16:10',  // Foto5.png
    '19 de mayo de 2018 a las 20:05',  // Foto6.png
    '22 de mayo de 2018 a las 15:30',  // Foto7.png
    '26 de mayo de 2018 a las 12:40',  // Foto8.png
    '30 de mayo de 2018 a las 22:15',  // Foto9.png
    '2 de junio de 2018 a las 17:02',  // Foto10.png
    '5 de junio de 2018 a las 13:50',  // Foto11.png
    '9 de junio de 2018 a las 19:12',  // Foto12.png
    '12 de junio de 2018 a las 10:25', // Foto13.png
    '16 de junio de 2018 a las 21:00', // Foto14.png
    '20 de junio de 2018 a las 14:15', // Foto15.png
    '23 de junio de 2018 a las 16:34', // Foto16.png
    '26 de junio de 2018 a las 18:22', // Foto17.png
    '29 de junio de 2018 a las 20:05'  // Foto18.png (newest, shown first)
  ];

  const CAPTIONS = {
    18: 'Un día increíble con personas increíbles ✨🌻 #bendecida',
    17: 'Sonríe, que la vida es bella y Dios es bueno 🌸✨',
    16: 'Disfrutando del atardecer... Granada es tan hermosa 🌅🏰',
    15: '«Deja que tu luz brille.» Que tengan un lindo día todos! ☀️🌿',
    14: 'Momento favorito del día ☕💕',
    13: 'La felicidad está en las cosas simples. Bendiciones! 🙏❤️',
    12: 'Con mi persona favorita del mundo... Te amo! 🐼💕 (con Miguel Angel Ramirez Jimenez)',
    11: 'Nueva foto de perfil 🙈✨ ¿Qué tal?',
    10: 'Hacer lo que te gusta es libertad. Amar lo que haces es felicidad. 🌱🌷',
    9: 'Un domingo diferente 🌸⛪ bendecido inicio de semana!',
    8: 'Viviendo un día a la vez ✨💕',
    7: 'Granada de mis amores 🏰🇳🇮',
    6: '¡Hola personitas de Facebook! Disfrutando la tarde 🌻✨',
    5: 'La vida se trata de momentos especiales ❤️🕊️',
    4: 'Un rayito de sol para el alma ☀️💛',
    3: 'Enamorada de este lugar 🌸✨',
    2: 'Sonreír no cuesta nada y alegra el día 😊💖',
    1: 'Empezando mayo con la mejor actitud y la bendición de Dios 🙏🌱'
  };

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

  function generatePosts(photos) {
    const generated = [];
    const N = photos.length;
    for (let idx = N - 1; idx >= 0; idx--) {
      const photoNum = idx + 1; // 18 down to 1
      const photoSrc = photos[idx];
      const dateText = DATES[idx] || 'Hace unos meses';
      const captionText = CAPTIONS[photoNum] || '';
      
      const likes = 45 + Math.floor(Math.random() * 85);
      const loves = 18 + Math.floor(Math.random() * 50);
      const wows = Math.floor(Math.random() * 12);
      
      const commentsList = [];
      if (photoNum === 12) {
        commentsList.push({ userId: 10, text: 'Yo te amo mucho más mi amor bella, eres mi vida entera 😍🐼❤️' });
        commentsList.push({ userId: 8, text: '¡Qué hermosa pareja! Dios los bendiga siempre' });
        commentsList.push({ userId: 9, text: 'Bellos los dos' });
      } else {
        const randomComments = [
          { userId: 10, text: 'La más hermosa de todas las personitas 😍❤️ te amo mi amor!' },
          { userId: 8, text: 'Qué bella mi amiga! Saludos' },
          { userId: 9, text: 'Guapísima Josseling, bendiciones!' },
          { userId: 2, text: 'Qué linda foto Josseling, qué bendición!' },
          { userId: 10, text: 'Preciosa mía 💕' },
          { userId: 3, text: 'Saludos Josseling, que estés muy bien!' }
        ];
        const count = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < count; j++) {
          const comment = randomComments[(idx + j) % randomComments.length];
          if (!commentsList.some(c => c.userId === comment.userId)) {
            commentsList.push(comment);
          }
        }
      }

      generated.push({
        id: `profile-post-${photoNum}`,
        userId: 0, // Josseling
        time: dateText,
        privacy: 'public',
        text: captionText,
        images: [photoSrc],
        reactions: { like: likes, love: loves, wow: wows },
        commentCount: commentsList.length,
        shareCount: Math.floor(Math.random() * 6),
        comments: commentsList
      });
    }
    return generated;
  }

  function initProfileData() {
    if (_dataInitialized) return;
    _dataInitialized = true;

    detectedPhotos = KNOWN_PHOTOS.slice();
    profilePosts = generatePosts(detectedPhotos);
    // Profile posts are NOT injected into DATA.posts anymore.
  }

  function preloadCriticalImages(userPhotos) {
    const criticalSrcs = [
      'fb2018/Perfil/PerfilFoto.png',
      'fb2018/Perfil/Portada.png'
    ];
    if (userPhotos.length > 0) criticalSrcs.push(userPhotos[0]);
    if (userPhotos.length > 1) criticalSrcs.push(userPhotos[1]);

    criticalSrcs.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  function buildProfileHeaderHTML(user, photosGridSlice) {
    return `
      <img src="${user.cover}" class="profile-cover" alt="Portada" onerror="this.src='fb2018/Perfil/Portada.png'">
      <div class="profile-avatar-wrap">
        <img src="${user.avatar}" class="profile-avatar" onerror="this.src='fb2018/Perfil/PerfilFoto.png'">
      </div>
      <div class="profile-info">
        <div class="profile-name">${user.name}</div>
        ${user.bio ? `<div class="profile-bio">${user.bio}</div>` : ''}
      </div>

      <!-- Buttons row matching reference screenshot -->
      <div class="profile-buttons-row">
        <button class="btn-add-friend" id="btn-add-friend">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M15 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-9-4V7H4v3H1v2h3v3h2v-3h3v-2H6zm9-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
          </svg>
          <span>Agregar a amigos</span>
        </button>
        <button class="btn-msg" id="btn-profile-msg">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.5 3.16 7.36V22l2.86-1.57c.82.23 1.68.35 2.58.35h.4c5.64 0 10-4.13 10-9.68C21 6.13 17.64 2 12 2zm1.08 13.02l-2.55-2.73L5.68 15l4.85-5.13 2.55 2.73L17.86 10l-4.78 5.02z"/>
          </svg>
          <span>Mensaje</span>
        </button>
        <button class="btn-more" id="btn-profile-more">•••</button>
      </div>

      <!-- Información section -->
      <div class="profile-section">
        <div class="profile-info-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <div>Vive en <span class="bold-info">${user.city || 'Granada, Nicaragua'}</span></div>
        </div>
        <div class="profile-info-row">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <div>Fecha de nacimiento: <span class="bold-info">${user.birthday || '13 de octubre de 2005'}</span></div>
        </div>
        <div class="profile-info-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="19" cy="12" r="1"/>
            <circle cx="5" cy="12" r="1"/>
          </svg>
          <span>Ver tu información</span>
        </div>
      </div>

      <!-- Fotos section -->
      <div class="profile-section">
        <div class="profile-photos-header">
          <span class="profile-photos-title">Fotos</span>
          <a href="#" class="profile-photos-link" id="view-all-photos-link">Ver todas las fotos</a>
        </div>
        ${photosGridSlice.length > 0 ? `
          <div class="profile-photos-grid">
            ${photosGridSlice.map(src => `<img src="${src}" loading="lazy" data-photo-profile="${src}">`).join('')}
          </div>
        ` : '<p style="color:var(--text-secondary);font-size:14px">Sin fotos.</p>'}
      </div>

      <!-- Publicaciones section -->
      <div class="profile-section" style="padding-left: 0; padding-right: 0;">
        <h3 style="padding-left: 16px;">Publicaciones</h3>
        <div id="profile-posts-list"></div>
      </div>
    `;
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
        FeedStore.openPhoto(el.dataset.photo || el.closest('.img-more').dataset.photo, photos);
      });
    });

    // Like button
    const likeBtn = card.querySelector('.btn-like');
    if (likeBtn) {
      const postId = likeBtn.dataset.postId;
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
      });
    }

    // Comment button
    const commentBtn = card.querySelector('.btn-comment');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        const postId = commentBtn.dataset.postId;
        FeedStore.openComments(postId);
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
    if (!container) return;
    container.querySelectorAll('.post-card').forEach(card => {
      bindPostEvents(card);
    });
  }

  function renderPostsProgressively(container, posts, userPhotos) {
    if (!container || posts.length === 0) return;

    const INITIAL_BATCH = 2;
    const BATCH_SIZE = 4;

    const initialPosts = posts.slice(0, INITIAL_BATCH);
    container.innerHTML = initialPosts.map(post => renderPost(post)).join('');
    bindFeedEvents(container);

    let offset = INITIAL_BATCH;

    function renderNextBatch() {
      if (offset >= posts.length) return;

      const batch = posts.slice(offset, offset + BATCH_SIZE);
      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = batch.map(post => renderPost(post)).join('');

      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }

      container.appendChild(fragment);
      offset += BATCH_SIZE;

      bindFeedEvents(container);

      if (offset < posts.length) {
        if (typeof requestIdleCallback === 'function') {
          requestIdleCallback(renderNextBatch, { timeout: 150 });
        } else {
          setTimeout(renderNextBatch, 100);
        }
      }
    }

    if (offset < posts.length) {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(renderNextBatch, { timeout: 150 });
      } else {
        setTimeout(renderNextBatch, 100);
      }
    }
  }

  function render(userId) {
    const content = document.getElementById('profile-content');
    const skeletonContainer = document.getElementById('profile-skeleton-container');
    if (!content) return;

    content.classList.remove('profile-loaded');
    content.innerHTML = '';
    if (skeletonContainer) {
      skeletonContainer.classList.remove('fade-out');
      skeletonContainer.style.display = '';
    }

    const scrollContainer = content.closest('.profile-scroll-container');
    if (scrollContainer) scrollContainer.scrollTop = 0;

    initProfileData();
    
    const user = DATA.users.find(u => u.id === userId) || DATA.me;
    
    let userPhotos = [];
    let userPosts = [];
    
    if (user.id === 0) {
      userPhotos = [...detectedPhotos].reverse(); // newest first
      userPosts = profilePosts;
    } else {
      userPosts = FeedStore.posts.filter(p => p.userId === user.id);
      userPhotos = userPosts.flatMap(p => p.images || []).slice(0, 9);
    }

    const photosGridSlice = userPhotos.slice(0, 6);

    preloadCriticalImages(userPhotos);

    if (_cacheUserId === userId && _cacheHTML) {
      content.innerHTML = _cacheHTML;
    } else {
      const headerHTML = buildProfileHeaderHTML(user, photosGridSlice);
      content.innerHTML = headerHTML;
      _cacheHTML = headerHTML;
      _cacheUserId = userId;
      _cacheUserPhotos = userPhotos;
      _cacheUserPosts = userPosts;
    }

    if (skeletonContainer) {
      skeletonContainer.classList.add('fade-out');
      setTimeout(() => {
        skeletonContainer.style.display = 'none';
      }, 300);
    }

    requestAnimationFrame(() => {
      content.classList.add('profile-loaded');
    });

    const postsContainer = content.querySelector('#profile-posts-list');
    if (postsContainer) {
      renderPostsProgressively(postsContainer, userPosts, userPhotos);
    }

    content.querySelectorAll('[data-photo-profile]').forEach(el => {
      el.addEventListener('click', () => {
        FeedStore.openPhoto(el.dataset.photoProfile, userPhotos);
      });
    });

    const viewAllLink = content.querySelector('#view-all-photos-link');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        Router.push('album');
      });
    }

    const msgBtn = content.querySelector('#btn-profile-msg');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => {
        const threadId = 1;
        Messenger.openChat(threadId);
      });
    }

    const addFriendBtn = content.querySelector('#btn-add-friend');
    if (addFriendBtn) {
      addFriendBtn.addEventListener('click', () => {
        if (addFriendBtn.classList.contains('active')) {
          addFriendBtn.classList.remove('active');
          addFriendBtn.style.background = '#1877f2';
          addFriendBtn.style.color = 'white';
          addFriendBtn.querySelector('span').textContent = 'Agregar a amigos';
        } else {
          addFriendBtn.classList.add('active');
          addFriendBtn.style.background = '#e4e6eb';
          addFriendBtn.style.color = '#1c1e21';
          addFriendBtn.querySelector('span').textContent = 'Solicitud enviada';
        }
      });
    }
  }

  function renderAlbum() {
    const albumContent = document.getElementById('album-content');
    if (!albumContent) return;

    initProfileData();

    const reversedPhotos = [...detectedPhotos].reverse();

    albumContent.innerHTML = `
      <div class="album-grid">
        ${reversedPhotos.map(src => `<img src="${src}" loading="lazy" data-photo-album="${src}">`).join('')}
      </div>
    `;

    albumContent.querySelectorAll('[data-photo-album]').forEach(el => {
      el.addEventListener('click', () => {
        FeedStore.openPhoto(el.dataset.photoAlbum, reversedPhotos);
      });
    });
  }

  return {
    get posts() { return profilePosts; },
    set posts(v) { profilePosts = v; },
    get scrollPosition() { return scrollPosition; },
    set scrollPosition(v) { scrollPosition = v; },
    
    render,
    renderAlbum,
    initProfileData,
    renderPost,
    bindPostEvents
  };
})();

window.Profile = window.ProfileStore;

