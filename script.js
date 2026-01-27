// Données mockées persistées en localStorage
let data = JSON.parse(localStorage.getItem('igonnaLieData')) || {
  posts: [
    {
      id: 1,
      user: '@itsu_nakano',
      image: '', // Vide pour éviter la photo
      caption: 'Itsuki is the best #hahaha 🔥',
      music: '@justintimberlake',
      likes: 342,
      liked: false,
      saved: false,
      comments: [
        { user: 'diewalsers.official', text: 'Omggg WOOOOW 🔥' },
        { user: 'sonamchatterjee', text: 'Speechless 🔥❤️' }
      ]
    }
  ],
  messages: {
    'friend1': [
      { sent: true, text: 'Salut !' },
      { sent: false, text: 'Yo, ça va ?' }
    ]
  }
};

// Sauvegarde des données
function saveData() {
  localStorage.setItem('igonnaLieData', JSON.stringify(data));
}

// Render un post
function renderPost(post, container) {
  const postEl = document.createElement('div');
  postEl.className = 'post';
  postEl.innerHTML = `
    <div class="post-header">
      <div class="user-info">
        <div class="avatar"></div>
        <span class="username">${post.user}</span>
      </div>
      <i class="fa-solid fa-ellipsis more"></i>
    </div>
    ${post.image ? `<div class="media"><img src="${post.image}" alt="Post image"></div>` : ''}
    <div class="actions-bar">
      <div class="left">
        <button class="action like-btn" data-id="${post.id}">
          <i class="fa-${post.liked ? 'solid' : 'regular'} fa-heart heart ${post.liked ? 'liked' : ''}"></i>
        </button>
        <button class="action comment-btn" data-id="${post.id}">
          <i class="fa-regular fa-comment"></i>
        </button>
        <button class="action share-btn" data-id="${post.id}">
          <i class="fa-regular fa-paper-plane"></i>
        </button>
      </div>
      <button class="action save-btn" data-id="${post.id}">
        <i class="fa-${post.saved ? 'solid' : 'regular'} fa-bookmark"></i>
      </button>
    </div>
    <div class="post-info">
      <div class="likes">${post.likes} likes</div>
      <p class="caption">${post.caption}</p>
      <div class="music">Musique • ${post.music || ''}</div>
    </div>
    <div class="comments-section">
      ${post.comments.map(c => `
        <div class="comment">
          <div class="comment-avatar"></div>
          <div class="comment-body">
            <div class="comment-text"><strong>${c.user}</strong> ${c.text}</div>
            <div class="comment-meta">À l'instant • Répondre</div>
          </div>
        </div>
      `).join('')}
      <div class="comment-input">
        <input type="text" placeholder="Ajoute un commentaire..." data-id="${post.id}">
        <button data-id="${post.id}">Publier</button>
      </div>
    </div>
  `;
  container.appendChild(postEl);
}

// Render feed
function renderFeed() {
  const feed = document.getElementById('feed');
  feed.innerHTML = '';
  data.posts.forEach(post => renderPost(post, feed));
}

// Render profile posts
function renderProfile() {
  const profilePosts = document.getElementById('profile-posts');
  profilePosts.innerHTML = '';
  data.posts.forEach(post => renderPost(post, profilePosts));
}

// Render chats
function renderChats() {
  const chatList = document.getElementById('chat-list');
  chatList.innerHTML = '';
  Object.keys(data.messages).forEach(user => {
    const item = document.createElement('div');
    item.className = 'chat-item';
    item.innerHTML = `
      <div class="avatar"></div>
      <div>
        <div class="name">${user}</div>
        <div class="preview">Dernier message...</div>
      </div>
    `;
    item.addEventListener('click', () => openChat(user));
    chatList.appendChild(item);
  });
}

// Ouvrir chat
function openChat(user) {
  document.getElementById('chat-list').style.display = 'none';
  const window = document.getElementById('chat-window');
  window.style.display = 'flex';
  document.getElementById('chat-user').textContent = user;
  renderMessages(user);

  const back = document.querySelector('.back-to-list');
  back.addEventListener('click', () => {
    window.style.display = 'none';
    document.getElementById('chat-list').style.display = 'block';
  });
}

// Render messages
function renderMessages(user) {
  const messagesEl = document.getElementById('chat-messages');
  messagesEl.innerHTML = '';
  (data.messages[user] || []).forEach(msg => {
    const div = document.createElement('div');
    div.className = `message ${msg.sent ? 'sent' : 'received'}`;
    div.textContent = msg.text;
    messagesEl.appendChild(div);
  });
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Navigation
const navIcons = document.querySelectorAll('.nav-icon');
navIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const page = icon.dataset.page;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`${page}-page`).classList.add('active');
    navIcons.forEach(i => i.classList.remove('active'));
    icon.classList.add('active');

    if (page === 'home') renderFeed();
    if (page === 'profile') renderProfile();
    if (page === 'messages') renderChats();
  });
});

// Publier post
document.getElementById('publish-post').addEventListener('click', () => {
  const caption = document.getElementById('post-caption').value;
  const fileInput = document.getElementById('post-image-input');
  const file = fileInput.files[0];

  if (caption || file) {
    const reader = new FileReader();
    reader.onload = e => {
      data.posts.unshift({
        id: Date.now(),
        user: '@toi',
        image: e.target.result || '',
        caption: caption,
        music: '',
        likes: 0,
        liked: false,
        saved: false,
        comments: []
      });
      saveData();
      renderFeed();
      document.getElementById('post-caption').value = '';
      fileInput.value = '';
      // Switch to home
      document.querySelector('[data-page="home"]').click();
    };
    if (file) reader.readAsDataURL(file);
    else reader.onload({ target: { result: '' } });
  }
});

// Événements délégués pour posts
document.addEventListener('click', e => {
  if (e.target.closest('.like-btn')) {
    const id = e.target.closest('.like-btn').dataset.id;
    const post = data.posts.find(p => p.id == id);
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    saveData();
    renderFeed();
    renderProfile();
  }

  if (e.target.closest('.save-btn')) {
    const id = e.target.closest('.save-btn').dataset.id;
    const post = data.posts.find(p => p.id == id);
    post.saved = !post.saved;
    saveData();
    renderFeed();
    renderProfile();
  }

  if (e.target.closest('.share-btn')) {
    document.getElementById('share-modal').showModal();
  }

  if (e.target.closest('.comment-input button')) {
    const id = e.target.dataset.id;
    const input = document.querySelector(`.comment-input input[data-id="${id}"]`);
    const text = input.value.trim();
    if (text) {
      const post = data.posts.find(p => p.id == id);
      post.comments.push({ user: 'toi', text });
      input.value = '';
      saveData();
      renderFeed();
      renderProfile();
    }
  }
});

// Share modal
document.getElementById('close-share').addEventListener('click', () => {
  document.getElementById('share-modal').close();
});

// Copier lien (simulation)
document.querySelector('.share-option:first-of-type').addEventListener('click', () => {
  alert('Lien copié !');
  document.getElementById('share-modal').close();
});

// Envoyer message
document.getElementById('send-message').addEventListener('click', () => {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  if (text) {
    const user = document.getElementById('chat-user').textContent;
    if (!data.messages[user]) data.messages[user] = [];
    data.messages[user].push({ sent: true, text });
    input.value = '';
    renderMessages(user);
    saveData();
  }
});

// Init
renderFeed();
renderChats();