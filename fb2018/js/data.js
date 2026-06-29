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
      name: 'Hija de Convenios 💗',     
      avatar: 'fb2018/images/hija_convenios_avatar.png',  
      cover: 'fb2018/images/hija_convenios_post.png', 
      bio: 'Hija de Dios 🌸✨',         
      friends: 3218, 
      work: 'Jóvenes de Sión', 
      city: 'Salt Lake City' 
    },
    { 
      id: 3, 
      name: 'Luz y Verdad 💙',    
      avatar: 'fb2018/images/luz_verdad_avatar.png',  
      cover: 'fb2018/images/luz_verdad_post.png', 
      bio: 'Guiados por la fe y la verdad ⛪🕊️',     
      friends: 8489, 
      work: 'Misionero', 
      city: 'Managua' 
    },
    { 
      id: 4, 
      name: 'Siendo Luz',  
      avatar: 'fb2018/images/siendo_luz_avatar.png',  
      cover: 'fb2018/images/siendo_luz_post.png', 
      bio: 'Comparte luz y amor. Dios te bendiga. ☀️🌱',  
      friends: 12560, 
      work: 'Predicador', 
      city: 'Guatemala' 
    },
    { 
      id: 5, 
      name: 'Miraculous Fan',     
      avatar: 'fb2018/images/ladybug_avatar.png',  
      cover: 'fb2018/images/gorizilla_post.png', 
      bio: '¡Miraculous Ladybug por siempre! 🐞✨',         
      friends: 4820, 
      work: 'Creador de Contenido', 
      city: 'París' 
    },
    { 
      id: 6, 
      name: 'Miraculous Ladybug en Español',    
      avatar: 'fb2018/images/cat_noir_avatar.png',  
      cover: 'fb2018/images/gorizilla_post.png', 
      bio: 'Comunidad en español de Miraculous Ladybug 🐾🐱',     
      friends: 8489, 
      work: 'Administrador de Fansite', 
      city: 'Madrid' 
    },
    { 
      id: 7, 
      name: 'Frases Diarias',  
      avatar: 'fb2018/images/sun_avatar.png',  
      cover: 'https://picsum.photos/seed/suncover/800/300', 
      bio: 'Un rayo de sol y motivación para tu día a día ☀️🌱',  
      friends: 24500, 
      work: 'Escritor', 
      city: 'Buenos Aires' 
    },
    { 
      id: 8, 
      name: 'María García',  
      avatar: 'https://i.pravatar.cc/80?img=1',  
      cover: 'https://picsum.photos/seed/u1c/800/300', 
      bio: 'Fotógrafa y viajera 📷',        
      friends: 342, 
      work: 'Freelance', 
      city: 'Madrid' 
    },
    { 
      id: 9, 
      name: 'Carlos Ruiz',     
      avatar: 'https://i.pravatar.cc/80?img=3',  
      cover: 'https://picsum.photos/seed/u2c/800/300', 
      bio: 'Dev & café ☕',               
      friends: 218, 
      work: 'Startup XYZ', 
      city: 'Barcelona' 
    },
    { 
      id: 10, 
      name: 'Miguel Angel Ramirez Jimenez',     
      avatar: 'fb2018/images/Miguel.png',  
      cover: 'fb2018/images/Miguel.png', 
      bio: '🐼 EnTrAsTe A Mi ViDa... ^^CoLoR^^',               
      friends: 342, 
      work: '', 
      city: '' 
    },
  ],

  stories: [
    { userId: 5, img: 'fb2018/images/gorizilla_post.png' },
    { userId: 1, img: 'fb2018/images/bts_group.png' },
    { userId: 3, img: 'fb2018/images/luz_verdad_post.png' },
    { userId: 2, img: 'fb2018/images/hija_convenios_post.png' },
    { userId: 6, img: 'fb2018/images/cat_noir_avatar.png' },
    { userId: 4, img: 'fb2018/images/siendo_luz_post.png' },
  ],

  posts: [
    {
      id: 1,
      userId: 5,
      time: 'Ahora mismo',
      privacy: 'public',
      text: '¡¡Ya salió Gorizilla!! 😱<br>¿Adrien estuvo a punto de descubrir a Ladybug?',
      images: ['fb2018/images/gorizilla_post.png'],
      reactions: { like: 212, wow: 31 },
      commentCount: 57,
      shareCount: 12,
      comments: [
        { userId: 6, text: '¡¡¡No me lo puedo creer!!! El capítulo estuvo cardíaco 😍' },
        { userId: 8, text: 'Adrien siempre tan despistado jajaja' },
      ],
    },
    {
      id: 2,
      userId: 3,
      time: '3 hrs',
      privacy: 'public',
      text: '¡NO PUEDO ESTAR MÁS FELIZ! 😭💙<br>En la Conferencia General anunciaron que tendremos un TEMPLO en MANAGUA, NICARAGUA. 🇳🇮<br>Qué bendición tan grande para nuestro país y para nuestras familias. Estoy llorando de emoción, esto es un sueño hecho realidad. ✨<br>Gracias Señor por Tu amor y por guiarnos siempre. 🙏💙<br><br>#TemploDeManagua #ConferenciaGeneral #FamiliaEterna',
      images: ['fb2018/images/luz_verdad_post.png'],
      reactions: { like: 2450, love: 240, wow: 10 },
      commentCount: 198,
      shareCount: 45,
      comments: [
        { userId: 2, text: '¡Qué gran bendición! Gloria a Dios 🙌❤️' },
        { userId: 4, text: 'Qué alegría tan inmensa para toda Centroamérica. Amén.' },
      ],
    },
    {
      id: 3,
      userId: 2,
      time: '4 hrs',
      privacy: 'public',
      text: 'Qué mensaje más hermoso y lleno de verdad. ❤️<br>El Presidente Nelson siempre nos enseña con tanto amor y claridad. ¡Vamos a hacer del templo una prioridad! ✨<br><br>#PresidentNelson101 #Templo #ÉlVive',
      images: ['fb2018/images/hija_convenios_post.png'],
      reactions: { like: 1680, love: 210, wow: 10 },
      commentCount: 156,
      shareCount: 32,
      comments: [
        { userId: 3, text: 'Totalmente de acuerdo. El templo trae paz a nuestras vidas.' },
        { userId: 8, text: 'Un mensaje muy oportuno 🌸' }
      ],
    },
    {
      id: 4,
      userId: 1,
      time: 'Ayer a las 11:30 PM',
      privacy: 'public',
      text: 'BTS en loop todo el día 💜<br>Los extraño mucho, cuándo será el próximo concierto? 😭<br><br>#BTS #ARMY #LoveYourselfTear #FakeLove',
      images: [
        'fb2018/images/bts_group.png',
        'fb2018/images/bts_fake_love.png',
        'fb2018/images/bts_dance.png',
        'fb2018/images/bts_jungkook.png'
      ],
      reactions: { like: 2320, love: 260, wow: 20 },
      commentCount: 213,
      shareCount: 88,
      comments: [
        { userId: 8, text: '¡¡Jungkook se ve precioso en la última foto!! 😭😍' },
        { userId: 9, text: 'Escuchando Fake Love sin parar 🎧' },
        { userId: 5, text: 'Los extrañamos demasiado' }
      ],
    },
    {
      id: 5,
      userId: 6,
      time: 'Ayer a las 6:45 PM',
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
        { userId: 5, text: 'Ese Gorizilla sí que dio pelea.' },
        { userId: 7, text: 'Excelente análisis del capítulo.' }
      ],
    },
    {
      id: 6,
      userId: 4,
      time: 'Ayer a las 8:45 PM',
      privacy: 'public',
      text: 'No importa lo que estés pasando, Dios tiene el control.<br>Confía en Él, todo tiene un propósito. 🙏💛<br><br>#Fe #Confianza #DiosEsBueno',
      images: ['fb2018/images/siendo_luz_post.png'],
      reactions: { like: 312, love: 28, wow: 2 },
      commentCount: 12,
      shareCount: 6,
      comments: [
        { userId: 8, text: 'Amén, confío plenamente.' }
      ],
    },
    {
      id: 7,
      userId: 10,
      time: '20 MAY 2018',
      privacy: 'friends',
      text: '🐼. EnTrAsTe A Mi ViDa, En TiEmPoS De BlAnCo y NeGrO a DaRlE. ^^CoLoR^^.🐼#_Mile.°♡° — <strong>motivado(a)</strong>.',
      images: ['fb2018/images/Miguel.png'],
      reactions: { like: 56, love: 20, wow: 10 },
      commentCount: 15,
      shareCount: 3,
      comments: [
        { userId: 8, text: '😍❤️' },
        { userId: 9, text: 'Tani Rivera y otros comentaron esto.' }
      ],
    },
    {
      id: 8,
      userId: 7,
      time: 'Ayer a las 9:20 PM',
      privacy: 'public',
      text: 'Confía en el proceso. Todo llega en el momento justo. 🌱✨',
      images: [],
      reactions: { like: 26, love: 6 },
      commentCount: 5,
      shareCount: 1,
      comments: [
        { userId: 8, text: 'Justo lo que necesitaba leer hoy. Gracias ❤️' }
      ],
    },
  ],

  threads: [
    {
      id: 1,
      userId: 8,
      online: true,
      preview: 'Jeje sí, me alegro 😄',
      time: '9:30',
      unread: true,
      messages: [
        { from: 8, text: 'Hola! ¿Cómo estás?', time: '9:10' },
        { from: 0, text: 'Todo bien, gracias! ¿Y tú?', time: '9:12' },
        { from: 8, text: 'Genial, acabo de ver el nuevo anuncio de Miraculous', time: '9:28' },
        { from: 0, text: '¡Sí! ¡Estuvo genial el capítulo! 🐞🐈', time: '9:29' },
        { from: 8, text: 'Jeje sí, me alegro 😄', time: '9:30' },
      ],
    },
  ],

  notifications: [
    { id: 1, userId: 8, type: 'love',    text: 'le encantó tu foto.',            time: 'Hace 5 min',  unread: true,  thumb: 'fb2018/images/bts_jungkook.png' },
    { id: 2, userId: 5, type: 'comment', text: 'comentó tu publicación.',  time: 'Hace 20 min', unread: true,  thumb: null },
  ],

  friendRequests: [], 

  marketplaceItems: [
    { id: 1, price: '150 €', title: 'Bici de montaña', img: 'https://picsum.photos/seed/mk1/400/400', location: 'Madrid' },
    { id: 2, price: '40 €',  title: 'Silla de oficina', img: 'https://picsum.photos/seed/mk2/400/400', location: 'Barcelona' },
  ],
};
