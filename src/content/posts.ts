// Static blog posts. Content lives in the repo (no CMS). Each post carries
// per-locale title/excerpt/body so the blog is fully translatable.

type Locale = 'de' | 'en' | 'tr';

export interface Post {
  slug: string;
  date: string; // ISO
  image: string; // featured image path
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  body: Record<Locale, string>;
}

export const posts: Post[] = [
  {
    slug: 'flughafentransfer-tipps',
    date: '2026-06-01',
    image: '/images/service-airport.jpg',
    title: {
      de: 'Stressfrei zum Flughafen Stuttgart – 5 Tipps',
      en: 'Stress-free to Stuttgart Airport – 5 tips',
      tr: 'Stuttgart Havalimanına stressiz ulaşım – 5 ipucu',
    },
    excerpt: {
      de: 'So planen Sie Ihren Transfer entspannt und pünktlich.',
      en: 'How to plan your transfer calmly and on time.',
      tr: 'Transferinizi rahat ve dakik planlamanın yolları.',
    },
    body: {
      de: 'Planen Sie Ihre Abholung mit Puffer, geben Sie Ihre Flugnummer an und wählen Sie das passende Fahrzeug. Wir überwachen Ihren Flug und passen die Zeit automatisch an.',
      en: 'Plan your pickup with a buffer, provide your flight number and choose the right vehicle. We monitor your flight and adjust the time automatically.',
      tr: 'Karşılamanızı pay bırakarak planlayın, uçuş numaranızı verin ve uygun aracı seçin. Uçuşunuzu izler, saati otomatik ayarlarız.',
    },
  },
  {
    slug: 'vip-limousine-events',
    date: '2026-06-15',
    image: '/images/service-event.jpg',
    title: {
      de: 'VIP-Limousine für Ihre Events',
      en: 'VIP limousine for your events',
      tr: 'Etkinlikleriniz için VIP limuzin',
    },
    excerpt: {
      de: 'Stilvoll ankommen bei Hochzeit, Gala und Messe.',
      en: 'Arrive in style at weddings, galas and trade shows.',
      tr: 'Düğün, gala ve fuarda şık varış.',
    },
    body: {
      de: 'Unsere Chauffeure sorgen für einen stilvollen und pünktlichen Auftritt bei jedem Anlass.',
      en: 'Our chauffeurs ensure a stylish and punctual arrival for every occasion.',
      tr: 'Şoförlerimiz her anlamda şık ve dakik bir varış sağlar.',
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
