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
      <!-- Cover & Avatar Area -->
      <div class="profile-cover-container">
        <img src="${user.cover}" class="profile-cover" alt="Portada" onerror="this.src='fb2018/Perfil/Portada.png'">
        ${user.id === 0 ? `
          <div class="profile-cover-camera-overlay">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M9 2L7.17 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3.17L15 2H9z"/>
            </svg>
            <span>Agregar foto</span>
          </div>
        ` : ''}
      </div>

      <div class="profile-avatar-outer-wrap">
        <div class="profile-avatar-container">
          <img src="${user.avatar}" class="profile-avatar" onerror="this.src='fb2018/Perfil/PerfilFoto.png'">
        </div>
      </div>

      <div class="profile-meta-info">
        <div class="profile-name-centered">${user.name}</div>
        ${user.id === 10 ? `<div class="profile-bio-sub">${user.bio}</div>` : ''}
      </div>

      <!-- Horizontal Actions Row -->
      <div class="profile-actions-row-2018">
        ${user.id === 0 ? `
          <button class="action-btn-2018" id="action-btn-publish">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            <span>Publicar</span>
          </button>
          <button class="action-btn-2018" id="action-btn-info-edit">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            <span>Actualizar inf.</span>
          </button>
          <button class="action-btn-2018" id="btn-profile-more">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z"/></svg>
            <span>Más</span>
          </button>
        ` : `
          <button class="action-btn-2018 btn-blue-theme" id="btn-add-friend">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>Agregar a amigos</span>
          </button>
          <button class="action-btn-2018" id="btn-profile-msg">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
            <span>Mensaje</span>
          </button>
          <button class="action-btn-2018" id="btn-profile-more">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2z"/></svg>
            <span>Más</span>
          </button>
        `}
      </div>

      <!-- Tabs Navigation -->
      <div class="profile-tabs-bar-2018">
        <button class="profile-tab-btn active" data-profile-tab="informacion">Información</button>
        <button class="profile-tab-btn" data-profile-tab="fotos">Fotos</button>
        <button class="profile-tab-btn" data-profile-tab="amigos">Amigos</button>
      </div>

      <!-- Tabs Contents Container -->
      <div class="profile-tab-contents">
        <!-- Información / Timeline Tab Content -->
        <div class="profile-tab-pane active" id="pane-informacion">
          
          <!-- Presentación (Info Card) -->
          <div class="profile-card-2018 presentacion-card">
            <div class="card-header-2018">
              <span>Preséntate</span>
              <button class="card-close-btn-2018">✕</button>
            </div>
            <div class="card-body-2018">
              <div class="presentacion-subtitle">Personaliza la información que se ve en la parte superior de tu perfil.</div>
              
              <div class="presentacion-bio-section">
                ${user.bio ? `<div class="presentacion-bio-text">${user.bio}</div>` : ''}
                <a href="#" class="presentacion-link-blue" id="btn-edit-bio-mock">${user.bio ? 'Editar' : '+ Describe quién eres'}</a>
              </div>

              <div class="presentacion-details-list">
                <div class="detail-item-2018">
                  <svg class="detail-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/></svg>
                  <span>Vive en <span class="bold-text">${user.city || 'Granada, Nicaragua'}</span></span>
                </div>
                <div class="detail-item-2018">
                  <svg class="detail-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"/></svg>
                  <span>De <span class="bold-text">${user.city || 'Granada, Nicaragua'}</span></span>
                </div>
                <div class="detail-item-2018">
                  <svg class="detail-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  <span>Fecha de nacimiento: <span class="bold-text">${user.birthday || '13 de octubre de 2005'}</span></span>
                </div>
                <div class="detail-item-2018">
                  <svg class="detail-icon" viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  <span>Amigos: <span class="bold-text">${user.friends || 842}</span></span>
                </div>
              </div>

              ${user.id === 0 ? `
                <div class="presentacion-links-box">
                  <a href="#" class="presentacion-link-box-btn">
                    <span>+ Agregar Instagram, sitios web y otros enlaces</span>
                  </a>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Create Post Box -->
          <div class="profile-card-2018 create-post-card-2018">
            <div class="create-post-top-2018">
              <img src="${DATA.me.avatar}" class="create-post-avatar-2018" alt="Tú">
              <button class="create-post-input-2018">¿Qué estás pensando?</button>
            </div>
            <div class="create-post-bottom-2018">
              <button class="create-post-btn-2018 btn-foto">
                <svg viewBox="0 0 24 24" width="18" height="18" class="btn-icon-green"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                <span>Foto</span>
              </button>
              <button class="create-post-btn-2018 btn-lugar">
                <svg viewBox="0 0 24 24" width="18" height="18" class="btn-icon-red"><path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5z"/></svg>
                <span>Estoy aquí</span>
              </button>
              <button class="create-post-btn-2018 btn-acontecimiento">
                <svg viewBox="0 0 24 24" width="18" height="18" class="btn-icon-blue"><path fill="currentColor" d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>
                <span>Acontecimiento importante</span>
              </button>
            </div>
          </div>

          <!-- Timeline Publicaciones Section -->
          <div id="profile-posts-list"></div>
          
        </div> 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                <div class="empty-text">Agrega amigos para empezar a ver sus novedades.</div>
              </div>
            </div>
          </div>

          <!-- Timeline Publicaciones Section -->
          <div id="profile-posts-list"></div>
          
        </div>

        <!-- Fotos Tab Content -->
        <div class="profile-tab-pane" id="pane-fotos">
          <div class="profile-card-2018">
            <div class="card-header-2018 font-bold-header">Fotos de ${user.name}</div>
            <div class="tab-photos-grid-2018">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>

        <!-- Amigos Tab Content -->
        <div class="profile-tab-pane" id="pane-amigos">
          <div class="profile-card-2018">
            <div class="card-header-2018 font-bold-header">Amigos de ${user.name}</div>
            <div class="tab-friends-grid-2018">
              <!-- Populated dynamically -->
            </div>
          </div>
        </div>
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

    // ── 2018 PROFILE EVENT BINDINGS ──

    // 1. Tab Switching Logic
    const tabBtns = content.querySelectorAll('.profile-tab-btn');
    const tabPanes = content.querySelectorAll('.profile-tab-pane');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.profileTab;
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content pane
        tabPanes.forEach(p => p.classList.remove('active'));
        const activePane = content.querySelector(`#pane-${tabName}`);
        if (activePane) activePane.classList.add('active');

        // Dynamically load Photos grid on Photos tab click
        if (tabName === 'fotos') {
          const grid = activePane.querySelector('.tab-photos-grid-2018');
          if (grid && !grid.dataset.rendered) {
            grid.dataset.rendered = "true";
            grid.innerHTML = userPhotos.map(src => `<img src="${src}" class="tab-photo-img-2018" data-photo-tab-view="${src}" loading="lazy">`).join('');
            grid.querySelectorAll('[data-photo-tab-view]').forEach(img => {
              img.addEventListener('click', () => {
                FeedStore.openPhoto(img.dataset.photoTabView, userPhotos);
              });
            });
          }
        }

        // Dynamically load Friends list on Friends tab click
        if (tabName === 'amigos') {
          const grid = activePane.querySelector('.tab-friends-grid-2018');
          if (grid && !grid.dataset.rendered) {
            grid.dataset.rendered = "true";
            const friends = DATA.users.filter(u => u.id !== user.id);
            grid.innerHTML = friends.map(u => `
              <div class="tab-friend-card-2018" data-friend-id="${u.id}">
                <img src="${u.avatar}" alt="${u.name}" class="tab-friend-avatar-2018" loading="lazy">
                <div class="tab-friend-name-2018">${u.name}</div>
              </div>
            `).join('');
            grid.querySelectorAll('.tab-friend-card-2018').forEach(card => {
              card.addEventListener('click', () => {
                const fid = parseInt(card.dataset.friendId);
                Router.push('profile', { userId: fid });
              });
            });
          }
        }
      });
    });

    // 2. Cover / Avatar Interaction
    const coverOverlay = content.querySelector('.profile-cover-camera-overlay');
    if (coverOverlay) {
      coverOverlay.addEventListener('click', () => {
        alert('Funcionalidad de cambiar foto de portada próximamente.');
      });
    }

    // 3. Actions Row Events (Josseling)
    const publishBtn = content.querySelector('#action-btn-publish');
    if (publishBtn) {
      publishBtn.addEventListener('click', () => {
        const targetCard = content.querySelector('.create-post-card-2018');
        if (targetCard && scrollContainer) {
          scrollContainer.scrollTo({
            top: targetCard.offsetTop - 10,
            behavior: 'smooth'
          });
        }
      });
    }

    const infoBtn = content.querySelector('#action-btn-info-edit');
    if (infoBtn) {
      infoBtn.addEventListener('click', () => {
        const targetCard = content.querySelector('.presentacion-card');
        if (targetCard && scrollContainer) {
          scrollContainer.scrollTo({
            top: targetCard.offsetTop - 10,
            behavior: 'smooth'
          });
        }
      });
    }


    // 4. Create Post Box Handlers
    const cpInput = content.querySelector('.create-post-input-2018');
    if (cpInput) {
      cpInput.addEventListener('click', () => {
        alert('Funcionalidad de crear publicación próximamente.');
      });
    }
    content.querySelectorAll('.create-post-btn-2018').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Funcionalidad próximamente.');
      });
    });

    // 5. Bio and Info Mock Click Handlers
    const editBioBtn = content.querySelector('#btn-edit-bio-mock');
    if (editBioBtn) {
      editBioBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Editar presentación próximamente.');
      });
    }


    // 7. Actions Row Events (Other Profiles)
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
          addFriendBtn.querySelector('span').textContent = 'Agregar a amigos';
        } else {
          addFriendBtn.classList.add('active');
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

