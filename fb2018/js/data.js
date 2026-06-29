// ─── MOCK DATA ────────────────────────────────────────────────────────────────

window.DATA = {

  me: {
    id: 0,
    name: 'Tu Nombre',
    avatar: 'https://i.pravatar.cc/80?img=12',
    cover: 'https://picsum.photos/seed/mycover/800/300',
  },

  users: [
    { id: 1, name: 'María García',    avatar: 'https://i.pravatar.cc/80?img=1',  cover: 'https://picsum.photos/seed/u1c/800/300', bio: 'Fotógrafa y viajera 📷', friends: 342, work: 'Freelance', city: 'Madrid' },
    { id: 2, name: 'Carlos Ruiz',     avatar: 'https://i.pravatar.cc/80?img=3',  cover: 'https://picsum.photos/seed/u2c/800/300', bio: 'Dev & café ☕',         friends: 218, work: 'Startup XYZ', city: 'Barcelona' },
    { id: 3, name: 'Ana Martínez',    avatar: 'https://i.pravatar.cc/80?img=5',  cover: 'https://picsum.photos/seed/u3c/800/300', bio: 'Diseñadora UX/UI',     friends: 489, work: 'Agencia Pixel', city: 'Sevilla' },
    { id: 4, name: 'Luis Fernández',  avatar: 'https://i.pravatar.cc/80?img=7',  cover: 'https://picsum.photos/seed/u4c/800/300', bio: 'Música y montaña 🎸',  friends: 156, work: 'Músico', city: 'Valencia' },
    { id: 5, name: 'Miraculous Fan',  avatar: 'https://i.pravatar.cc/80?img=9',  cover: 'https://picsum.photos/seed/u5c/800/300', bio: 'Fan de todo 💫',        friends: 601, work: 'Streamer', city: 'Bilbao' },
    { id: 6, name: 'Elena López',     avatar: 'https://i.pravatar.cc/80?img=11', cover: 'https://picsum.photos/seed/u6c/800/300', bio: 'Chef 🍳',               friends: 278, work: 'Restaurante La Mar', city: 'A Coruña' },
  ],

  stories: [
    { userId: 1, img: 'https://picsum.photos/seed/s1/200/350' },
    { userId: 2, img: 'https://picsum.photos/seed/s2/200/350' },
    { userId: 3, img: 'https://picsum.photos/seed/s3/200/350' },
    { userId: 4, img: 'https://picsum.photos/seed/s4/200/350' },
    { userId: 5, img: 'https://picsum.photos/seed/s5/200/350' },
  ],

  posts: [
    {
      id: 1,
      userId: 1,
      time: 'Hace 2 h',
      privacy: 'friends',
      text: '¡Qué día tan bonito para salir a fotografiar! 📷',
      images: ['https://picsum.photos/seed/p1a/800/600'],
      reactions: { like: 24, love: 8 },
      commentCount: 5,
      shareCount: 2,
      comments: [
        { userId: 2, text: '¡Precioso! ¿Dónde fue esto?' },
        { userId: 3, text: 'Me encanta la luz 😍' },
      ],
    },
    {
      id: 2,
      userId: 2,
      time: 'Hace 4 h',
      privacy: 'public',
      text: 'Fin de semana de deploy 🚀 #developer',
      images: [],
      reactions: { like: 41, haha: 12 },
      commentCount: 9,
      shareCount: 1,
      comments: [
        { userId: 5, text: '¡Suerte! 😂' },
      ],
    },
    {
      id: 3,
      userId: 3,
      time: 'Ayer',
      privacy: 'public',
      text: 'Viaje por la costa ❤️',
      images: [
        'https://picsum.photos/seed/p3a/800/600',
        'https://picsum.photos/seed/p3b/800/600',
        'https://picsum.photos/seed/p3c/800/600',
      ],
      reactions: { like: 88, love: 34, wow: 5 },
      commentCount: 17,
      shareCount: 6,
      comments: [
        { userId: 1, text: '¡Qué envidia! 😍' },
        { userId: 4, text: 'Qué fotos tan chulas' },
      ],
    },
    {
      id: 4,
      userId: 4,
      time: 'Hace 2 días',
      privacy: 'friends',
      text: 'Nuevo concierto grabado 🎸🔥',
      images: [
        'https://picsum.photos/seed/p4a/600/600',
        'https://picsum.photos/seed/p4b/600/600',
        'https://picsum.photos/seed/p4c/600/600',
        'https://picsum.photos/seed/p4d/600/600',
        'https://picsum.photos/seed/p4e/600/600',
      ],
      reactions: { like: 62, love: 21 },
      commentCount: 8,
      shareCount: 3,
      comments: [
        { userId: 6, text: '¡Estuvo increíble!' },
      ],
    },
    {
      id: 5,
      userId: 6,
      time: 'Hace 3 días',
      privacy: 'public',
      text: 'Receta de hoy: paella valenciana 🥘 Resultado final:',
      images: [
        'https://picsum.photos/seed/p5a/800/600',
        'https://picsum.photos/seed/p5b/800/600',
      ],
      reactions: { like: 112, love: 45, wow: 8 },
      commentCount: 23,
      shareCount: 11,
      comments: [
        { userId: 2, text: 'Me puedo apuntar a comer? 😂' },
        { userId: 1, text: '¡Tiene una pinta increíble!' },
      ],
    },
  ],

  threads: [
    {
      id: 1,
      userId: 1,
      online: true,
      preview: 'Jeje sí, me alegro 😄',
      time: '9:30',
      unread: true,
      messages: [
        { from: 1, text: 'Hola! ¿Cómo estás?', time: '9:10' },
        { from: 0, text: 'Todo bien, gracias! ¿Y tú?', time: '9:12' },
        { from: 1, text: 'Genial, acabo de volver del viaje', time: '9:28' },
        { from: 0, text: 'Uy qué guay! Vi las fotos 😍', time: '9:29' },
        { from: 1, text: 'Jeje sí, me alegro 😄', time: '9:30' },
      ],
    },
    {
      id: 2,
      userId: 2,
      online: false,
      preview: 'Mándame el repo cuando puedas',
      time: 'Ayer',
      unread: false,
      messages: [
        { from: 2, text: 'Ei, ¿tienes el código del proyecto?', time: 'Ayer' },
        { from: 0, text: 'Sí, ahora te lo paso', time: 'Ayer' },
        { from: 2, text: 'Mándame el repo cuando puedas', time: 'Ayer' },
      ],
    },
    {
      id: 3,
      userId: 5,
      online: true,
      preview: 'Nos vemos el sábado entonces!',
      time: 'Lunes',
      unread: true,
      messages: [
        { from: 5, text: '¿Vienes al evento del sábado?', time: 'Lunes' },
        { from: 0, text: 'Sí! Estaré allí', time: 'Lunes' },
        { from: 5, text: 'Nos vemos el sábado entonces!', time: 'Lunes' },
      ],
    },
  ],

  notifications: [
    { id: 1, userId: 1, type: 'love',    text: 'le encantó tu foto.',            time: 'Hace 5 min',  unread: true,  thumb: 'https://picsum.photos/seed/p1a/80/80' },
    { id: 2, userId: 5, type: 'comment', text: 'te mencionó en un comentario.',  time: 'Hace 20 min', unread: true,  thumb: null },
    { id: 3, userId: 3, type: 'friend',  text: 'aceptó tu solicitud de amistad.', time: 'Hace 1 h',   unread: true,  thumb: null },
    { id: 4, userId: 2, type: 'like',    text: 'y 14 personas más dieron Me gusta a tu publicación.', time: 'Hace 3 h', unread: false, thumb: 'https://picsum.photos/seed/p5b/80/80' },
    { id: 5, userId: 4, type: 'comment', text: 'comentó en tu foto.',             time: 'Ayer',        unread: false, thumb: 'https://picsum.photos/seed/p3a/80/80' },
  ],

  friendRequests: [
    { id: 1, userId: 4, mutualFriends: 3 },
    { id: 2, userId: 6, mutualFriends: 7 },
  ],

  marketplaceItems: [
    { id: 1, price: '150 €', title: 'Bici de montaña', img: 'https://picsum.photos/seed/mk1/400/400', location: 'Madrid' },
    { id: 2, price: '40 €',  title: 'Silla de oficina', img: 'https://picsum.photos/seed/mk2/400/400', location: 'Barcelona' },
    { id: 3, price: '25 €',  title: 'Libros universitarios', img: 'https://picsum.photos/seed/mk3/400/400', location: 'Valencia' },
    { id: 4, price: '300 €', title: 'Cámara réflex', img: 'https://picsum.photos/seed/mk4/400/400', location: 'Sevilla' },
    { id: 5, price: '80 €',  title: 'Guitarra acústica', img: 'https://picsum.photos/seed/mk5/400/400', location: 'Bilbao' },
    { id: 6, price: '15 €',  title: 'Mochila', img: 'https://picsum.photos/seed/mk6/400/400', location: 'A Coruña' },
  ],
};
