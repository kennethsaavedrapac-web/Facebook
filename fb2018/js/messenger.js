// ─── MESSENGER ────────────────────────────────────────────────────────────────

window.Messenger = (() => {

  function renderList() {
    const content = document.getElementById('messenger-content');
    content.innerHTML = `
      <div style="padding:12px 16px;background:white;border-bottom:1px solid var(--border);font-size:18px;font-weight:700">Mensajes</div>
      ${DATA.threads.map(t => {
        const user = DATA.users.find(u => u.id === t.userId);
        return `<div class="messenger-thread ${t.unread ? 'unread' : ''}" data-thread="${t.id}">
          <div class="avatar-wrap">
            <img src="${user.avatar}" class="avatar">
            ${t.online ? '<div class="online-dot"></div>' : ''}
          </div>
          <div style="flex:1;min-width:0">
            <div class="thread-name">${user.name}</div>
            <div class="thread-preview" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${t.preview}</div>
          </div>
          <div style="font-size:12px;color:var(--text-secondary);flex-shrink:0">${t.time}</div>
        </div>`;
      }).join('')}
    `;

    content.querySelectorAll('[data-thread]').forEach(el => {
      el.addEventListener('click', () => {
        const threadId = parseInt(el.dataset.thread);
        // Push chat state to history so Atrás goes back to the thread list
        if (window.NavManager && NavManager.appReady) {
          NavManager.push('messenger-chat', { threadId });
        } else {
          openChatDOM(threadId);
        }
      });
    });
  }

  // openChat is now the public entry point that pushes history.
  // It delegates DOM rendering to openChatDOM.
  function openChat(threadId) {
    if (window.NavManager && NavManager.appReady) {
      NavManager.push('messenger-chat', { threadId });
    } else {
      openChatDOM(threadId);
    }
  }

  // openChatDOM is the internal DOM renderer called both by openChat
  // and by NavManager._restoreState on popstate.
  function openChatDOM(threadId) {
    const thread = DATA.threads.find(t => t.id === threadId);
    if (!thread) return;
    const user = DATA.users.find(u => u.id === thread.userId);
    thread.unread = false;

    const screen = document.getElementById('screen-messenger');
    const content = document.getElementById('messenger-content');

    content.innerHTML = `
      <div id="chat-view">
        <div id="chat-header">
          <button style="background:none;border:none;font-size:20px;cursor:pointer;padding-right:8px" id="back-to-threads">←</button>
          <img src="${user.avatar}" class="avatar">
          <div class="chat-name" style="margin-left:8px">${user.name}</div>
          <div class="chat-header-actions">
            <button class="chat-icon-btn">📞</button>
            <button class="chat-icon-btn">📹</button>
          </div>
        </div>
        <div id="chat-messages">
          ${thread.messages.map(m => {
            const isMe = m.from === 0;
            return `<div class="chat-bubble ${isMe ? 'me' : 'them'}">${m.text}</div>`;
          }).join('')}
        </div>
        <div id="chat-input-row">
          <input type="text" id="chat-input" placeholder="Escribe un mensaje…">
          <button id="chat-send">➤</button>
        </div>
      </div>
    `;

    // Scroll to bottom
    const msgs = content.querySelector('#chat-messages');
    msgs.scrollTop = msgs.scrollHeight;

    // Back button → history.back() (NavManager will restore messenger-list state)
    content.querySelector('#back-to-threads').addEventListener('click', () => {
      NavManager.pop();
    });

    // Send message
    const sendBtn = content.querySelector('#chat-send');
    const input = content.querySelector('#chat-input');

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      thread.messages.push({ from: 0, text });
      input.value = '';

      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble me';
      bubble.textContent = text;
      msgs.appendChild(bubble);
      msgs.scrollTop = msgs.scrollHeight;

      // Auto-reply
      setTimeout(() => {
        const replies = ['¡Claro!', '😊', 'Entendido!', '¿Cuándo quedamos?', 'Perfecto!', '👍'];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        thread.messages.push({ from: thread.userId, text: reply });
        const rb = document.createElement('div');
        rb.className = 'chat-bubble them';
        rb.textContent = reply;
        msgs.appendChild(rb);
        msgs.scrollTop = msgs.scrollHeight;

        document.dispatchEvent(new CustomEvent('fb:newMessage', { detail: { threadId } }));
      }, 1200 + Math.random() * 800);
    }

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    if (screen) {
      screen.classList.remove('hidden');
      screen.classList.add('active');
    }
  }

  function init() {
    renderList();
    document.getElementById('btn-messenger').addEventListener('click', () => {
      Router.push('messenger');
    });
  }

  return { init, renderList, openChat, openChatDOM };
})();
