// ─── MOCK DATA ────────────────────────────────────────────────────────────────

window.DATA = {

  me: {
    id: 0,
    name: 'Tu Nombre',
    avatar: 'https://i.pravatar.cc/80?img=12',
    cover: 'https://picsum.photos/seed/mycover/800/300',
  },

  users: [
    { 
      id: 1, 
      name: 'ARMY Forever',    
      avatar: 'fb2018/images/bts_logo.png',  
      cover: 'fb2018/images/bts_group.png', 
      bio: 'BTS Fan Club 💜 #FakeLove #LoveYourselfTear', 
      friends: 15420, 
      work: 'Fanbase Oficial', 
      city: 'Seúl' 
    },
    { 
      id: 2, 
      name: 'Miraculous Fan',     
      avatar: 'fb2018/images/ladybug_avatar.png',  
      cover: 'fb2018/images/gorizilla_post.png', 
      bio: '¡Miraculous Ladybug por siempre! 🐞✨',         
      friends: 3218, 
      work: 'Creador de Contenido', 
      city: 'París' 
    },
    { 
      id: 3, 
      name: 'Miraculous Ladybug en Español',    
      avatar: 'fb2018/images/cat_noir_avatar.png',  
      cover: 'fb2018/images/gorizilla_post.png', 
      bio: 'Comunidad en español de Miraculous Ladybug 🐾🐱',     
      friends: 8489, 
      work: 'Administrador de Fansite', 
      city: 'Madrid' 
    },
    { 
      id: 4, 
      name: 'Frases Diarias',  
      avatar: 'fb2018/images/sun_avatar.png',  
      cover: 'https://picsum.photos/seed/suncover/800/300', 
      bio: 'Un rayo de sol y motivación para tu día a día ☀️🌱',  
      friends: 12560, 
      work: 'Escritor', 
      city: 'Buenos Aires' 
    },
    { 
      id: 5, 
      name: 'María García',  
      avatar: 'https://i.pravatar.cc/80?img=1',  
      cover: 'https://picsum.photos/seed/u1c/800/300', 
      bio: 'Fotógrafa y viajera 📷',        
      friends: 342, 
      work: 'Freelance', 
      city: 'Madrid' 
    },
    { 
      id: 6, 
      name: 'Carlos Ruiz',     
      avatar: 'https://i.pravatar.cc/80?img=3',  
      cover: 'https://picsum.photos/seed/u2c/800/300', 
      bio: 'Dev & café ☕',               
      friends: 218, 
      work: 'Startup XYZ', 
      city: 'Barcelona' 
    },
  ],

  stories: [
    { userId: 2, img: 'fb2018/images/gorizilla_post.png' },
    { userId: 1, img: 'fb2018/images/bts_group.png' },
    { userId: 3, img: 'fb2018/images/cat_noir_avatar.png' },
    { userId: 4, img: 'fb2018/images/sun_avatar.png' },
    { userId: 5, img: 'https://picsum.photos/seed/s1/200/350' },
  ],

  posts: [
    {
      id: 1,
      userId: 2,
      time: 'Just now',
      privacy: 'public',
      text: '¡¡Ya salió Gorizilla!! 😱<br>¿Adrien estuvo a punto de descubrir a Ladybug?',
      images: ['fb2018/images/gorizilla_post.png'],
      reactions: { like: 212, wow: 31 },
      commentCount: 57,
      shareCount: 12,
      comments: [
        { userId: 3, text: '¡¡¡No me lo puedo creer!!! El capítulo estuvo cardíaco 😍' },
        { userId: 5, text: 'Adrien siempre tan despistado jajaja' },
      ],
    },
    {
      id: 2,
      userId: 1,
      time: '2 hrs',
      privacy: 'public',
      text: '¿Qué les pareció la nueva música de BTS? 😭💜<br>Llevo escuchando Fake Love todo el día y todavía no supero el MV. Cada vez que la escucho encuentro un detalle nuevo. Este comeback fue increíble. 💜🏼<br><br>#FakeLove #LoveYourselfTear #BTS',
      images: [
        'fb2018/images/bts_group.png',
        'fb2018/images/bts_fake_love.png',
        'fb2018/images/bts_dance.png',
        'fb2018/images/bts_jungkook.png'
      ],
      reactions: { like: 1250, love: 140, wow: 10 },
      commentCount: 213,
      shareCount: 45,
      comments: [
        { userId: 5, text: '¡La coreografía es de otro mundo! 😭🔥' },
        { userId: 6, text: 'Fake Love es arte puro.' },
        { userId: 2, text: 'No puedo dejar de reproducirlo!' }
      ],
    },
    {
      id: 3,
      userId: 3,
      time: 'Yesterday at 6:45 PM',
      privacy: 'public',
      text: '¡Nuevo akuma en acción! 💜<br>Opiniones sobre "Gorizilla" 😢👇',
      images: [
        'fb2018/images/gorizilla_post.png',
        'fb2018/images/cat_noir_avatar.png'
      ],
      reactions: { like: 760, love: 98, wow: 3 },
      commentCount: 92,
      shareCount: 24,
      comments: [
        { userId: 2, text: 'Ese Gorizilla sí que dio pelea.' },
        { userId: 4, text: 'Excelente análisis del capítulo.' }
      ],
    },
    {
      id: 4,
      userId: 4,
      time: 'Yesterday at 9:20 PM',
      privacy: 'public',
      text: 'Confía en el proceso. Todo llega en el momento justo. 🌱✨',
      images: [],
      reactions: { like: 26, love: 6 },
      commentCount: 5,
      shareCount: 1,
      comments: [
        { userId: 5, text: 'Justo lo que necesitaba leer hoy. Gracias ❤️' }
      ],
    },
  ],

  threads: [
    {
      id: 1,
      userId: 5,
      online: true,
      preview: 'Jeje sí, me alegro 😄',
      time: '9:30',
      unread: true,
      messages: [
        { from: 5, text: 'Hola! ¿Cómo estás?', time: '9:10' },
        { from: 0, text: 'Todo bien, gracias! ¿Y tú?', time: '9:12' },
        { from: 5, text: 'Genial, acabo de ver el nuevo MV de BTS', time: '9:28' },
        { from: 0, text: '¡Es increíble! Me encantó FAKE LOVE 😍', time: '9:29' },
        { from: 5, text: 'Jeje sí, me alegro 😄', time: '9:30' },
      ],
    },
    {
      id: 2,
      userId: 6,
      online: false,
      preview: '¿Viste el capítulo de Gorizilla?',
      time: 'Ayer',
      unread: false,
      messages: [
        { from: 6, text: 'Hola, ¿ya viste el nuevo estreno?', time: 'Ayer' },
        { from: 0, text: 'Sí, ¡estuvo genial!', time: 'Ayer' },
        { from: 6, text: '¿Viste el capítulo de Gorizilla?', time: 'Ayer' },
      ],
    },
  ],

  notifications: [
    { id: 1, userId: 5, type: 'love',    text: 'le encantó tu foto.',            time: 'Hace 5 min',  unread: true,  thumb: 'fb2018/images/bts_jungkook.png' },
    { id: 2, userId: 2, type: 'comment', text: 'comentó tu publicación sobre Miraculous.',  time: 'Hace 20 min', unread: true,  thumb: null },
    { id: 3, userId: 6, type: 'like',    text: 'dio Me gusta a tu publicación.', time: 'Hace 3 h', unread: false, thumb: 'fb2018/images/bts_logo.png' },
  ],

  friendRequests: [], // Empieza vacío para dispararse dinámicamente

  marketplaceItems: [
    { id: 1, price: '150 €', title: 'Bici de montaña', img: 'https://picsum.photos/seed/mk1/400/400', location: 'Madrid' },
    { id: 2, price: '40 €',  title: 'Silla de oficina', img: 'https://picsum.photos/seed/mk2/400/400', location: 'Barcelona' },
    { id: 3, price: '25 €',  title: 'Libros universitarios', img: 'https://picsum.photos/seed/mk3/400/400', location: 'Valencia' },
  ],
};
