// ─── PROFILE ──────────────────────────────────────────────────────────────────

window.Profile = (() => {

  function render(userId) {
    const user = DATA.users.find(u => u.id === userId);
    if (!user) return;

    const userPosts = DATA.posts.filter(p => p.userId === userId);
    const photos = userPosts.flatMap(p => p.images || []).slice(0, 9);

    const screen = document.getElementById('screen-profile');
    const content = document.getElementById('profile-content');

    content.innerHTML = `
      <img src="${user.cover}" class="profile-cover" alt="Portada">
      <div class="profile-avatar-wrap">
        <img src="${user.avatar}" class="profile-avatar">
        <div class="profile-actions">
          <button class="btn-primary">+ Agregar</button>
          <button class="btn-secondary">Mensaje</button>
        </div>
      </div>
      <div class="profile-info">
        <div class="profile-name">${user.name}</div>
        ${user.bio ? `<div class="profile-bio">${user.bio}</div>` : ''}
        <div class="profile-friends-count">${user.friends} amigos</div>
      </div>

      <div class="profile-section">
        <h3>Información</h3>
        ${user.work ? `<div class="profile-info-row">💼 Trabaja en ${user.work}</div>` : ''}
        ${user.city ? `<div class="profile-info-row">📍 Vive en ${user.city}</div>` : ''}
      </div>

      ${photos.length > 0 ? `
      <div class="profile-section">
        <h3>Fotos</h3>
        <div class="profile-photos-grid">
          ${photos.map(src => `<img src="${src}" data-photo="${src}">`).join('')}
        </div>
      </div>` : ''}

      <div class="profile-section">
        <h3>Publicaciones</h3>
        ${userPosts.length === 0 ? '<p style="color:var(--text-secondary);font-size:14px">Sin publicaciones.</p>' : ''}
        ${userPosts.map(post => `
          <div style="margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--border)">
            <div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px">${post.time}</div>
            ${post.text ? `<div style="font-size:15px">${post.text}</div>` : ''}
            ${post.images && post.images[0] ? `<img src="${post.images[0]}" style="width:100%;border-radius:8px;margin-top:8px;max-height:200px;object-fit:cover" data-photo="${post.images[0]}">` : ''}
          </div>
        `).join('')}
      </div>
    `;

    // Bind photo clicks
    content.querySelectorAll('[data-photo]').forEach(el => {
      el.addEventListener('click', () => Feed.openPhoto(el.dataset.photo));
    });

    // Mensaje button
    content.querySelector('.btn-secondary').addEventListener('click', () => {
      const thread = DATA.threads.find(t => t.userId === userId);
      if (thread) Messenger.openChat(thread.id);
    });

    screen.classList.remove('hidden');
    screen.classList.add('active');
  }

  return { render };
})();
