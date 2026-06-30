// ─── PROFILE ──────────────────────────────────────────────────────────────────

window.Profile = (() => {

  let detectedPhotos = [];
  let profilePosts = [];

  // Chronological list of dates for the 18 photos from May 1 to June 30, 2018.
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

  // Captions matching a girl's Facebook profile in 2018.
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

  async function initProfileData() {
    if (detectedPhotos.length > 0) return;
    
    // Attempt automatic detection of files Foto1.png to Foto100.png
    let i = 1;
    while (i <= 100) {
      const src = `fb2018/Perfil/Foto${i}.png`;
      try {
        const res = await fetch(src, { method: 'HEAD' });
        if (res.ok || res.status === 200) {
          detectedPhotos.push(src);
          i++;
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }
    
    // Fallback if browser local fetch blocks HEAD/GET
    if (detectedPhotos.length === 0) {
      for (let f = 1; f <= 18; f++) {
        detectedPhotos.push(`fb2018/Perfil/Foto${f}.png`);
      }
    }

    profilePosts = generatePosts(detectedPhotos);
    
    // Inject generated posts into global DATA.posts to support reactions and comments
    profilePosts.forEach(post => {
      if (!DATA.posts.some(p => p.id === post.id)) {
        DATA.posts.push(post);
      }
    });
  }

  async function render(userId) {
    await initProfileData();
    
    const user = DATA.users.find(u => u.id === userId) || DATA.me;
    const content = document.getElementById('profile-content');
    if (!content) return;
    
    let userPhotos = [];
    let userPosts = [];
    
    if (user.id === 0) {
      userPhotos = [...detectedPhotos].reverse(); // newest first
      userPosts = DATA.posts.filter(p => p.userId === 0);
    } else {
      userPosts = DATA.posts.filter(p => p.userId === user.id);
      userPhotos = userPosts.flatMap(p => p.images || []).slice(0, 9);
    }

    const photosGridSlice = userPhotos.slice(0, 6);

    content.innerHTML = `
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
            ${photosGridSlice.map(src => `<img src="${src}" data-photo-profile="${src}">`).join('')}
          </div>
        ` : '<p style="color:var(--text-secondary);font-size:14px">Sin fotos.</p>'}
      </div>

      <!-- Publicaciones section -->
      <div class="profile-section" style="padding-left: 0; padding-right: 0;">
        <h3 style="padding-left: 16px;">Publicaciones</h3>
        <div id="profile-posts-list">
          ${userPosts.map(post => Feed.renderPost(post)).join('')}
        </div>
      </div>
    `;

    // Bind photo clicks in the grid
    content.querySelectorAll('[data-photo-profile]').forEach(el => {
      el.addEventListener('click', () => {
        Feed.openPhoto(el.dataset.photoProfile, userPhotos);
      });
    });

    // Bind click for "Ver todas las fotos"
    const viewAllLink = content.querySelector('#view-all-photos-link');
    if (viewAllLink) {
      viewAllLink.addEventListener('click', (e) => {
        e.preventDefault();
        Router.push('album');
      });
    }

    // Bind Message button
    const msgBtn = content.querySelector('#btn-profile-msg');
    if (msgBtn) {
      msgBtn.addEventListener('click', () => {
        const threadId = 1; // Open default chat thread
        Messenger.openChat(threadId);
      });
    }

    // Bind add friend button simulation
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

    // Bind events for the posts rendered in this profile
    const postsContainer = content.querySelector('#profile-posts-list');
    if (postsContainer) {
      Feed.bindFeedEvents(postsContainer);
    }
  }

  function renderAlbum() {
    const albumContent = document.getElementById('album-content');
    if (!albumContent) return;

    const reversedPhotos = [...detectedPhotos].reverse(); // newest first

    albumContent.innerHTML = `
      <div class="album-grid">
        ${reversedPhotos.map(src => `<img src="${src}" data-photo-album="${src}">`).join('')}
      </div>
    `;

    // Bind click to open photo viewer with the full list of photos
    albumContent.querySelectorAll('[data-photo-album]').forEach(el => {
      el.addEventListener('click', () => {
        Feed.openPhoto(el.dataset.photoAlbum, reversedPhotos);
      });
    });
  }

  return { render, renderAlbum, initProfileData };
})();
