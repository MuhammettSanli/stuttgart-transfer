// Static blog posts. Content lives in the repo (no CMS). Each post carries
// per-locale title/excerpt/body so the blog is fully translatable.
// Bodies use double-newline (\n\n) to separate paragraphs; the post page
// renders each paragraph individually.

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
    slug: 'geschaeftsreisen-stuttgart',
    date: '2026-07-15',
    image: '/images/service-corporate.jpg',
    title: {
      de: 'Geschäftsreisen in der Region Stuttgart',
      en: 'Business travel in the Stuttgart region',
      tr: 'Stuttgart bölgesinde iş seyahatleri',
    },
    excerpt: {
      de: 'Zuverlässige Transfers für Messe, Meetings und Firmengäste.',
      en: 'Reliable transfers for trade fairs, meetings and corporate guests.',
      tr: 'Fuar, toplantı ve kurumsal misafirler için güvenilir transferler.',
    },
    body: {
      de: 'Zeit ist auf Geschäftsreisen das wertvollste Gut. Ein zuverlässiger Chauffeurservice sorgt dafür, dass Sie sich auf Ihre Termine konzentrieren können – statt auf Parkplätze, Fahrpläne oder Mietwagen.\n\nOb Transfer vom Flughafen zur Messe Stuttgart, Fahrten zwischen Meetings oder die Abholung wichtiger Gäste: Wir sind pünktlich, diskret und professionell. Im Fahrzeug arbeiten Sie ungestört weiter, mit WLAN und Ruhe.\n\nFür Firmenkunden bieten wir feste Ansprechpartner und auf Wunsch eine monatliche Sammelrechnung. So bleibt die Abrechnung übersichtlich und Ihr Team reist stets im selben hohen Standard.\n\nGerne erstellen wir Ihnen ein individuelles Angebot für regelmäßige Fahrten. Sprechen Sie uns an – wir gestalten den Transfer passend zu Ihrem Geschäftsalltag.',
      en: 'On business trips, time is your most valuable asset. A reliable chauffeur service lets you focus on your meetings – instead of parking, timetables or rental cars.\n\nWhether a transfer from the airport to the Stuttgart trade fair, rides between meetings or picking up important guests: we are punctual, discreet and professional. In the vehicle you keep working undisturbed, with Wi-Fi and quiet.\n\nFor corporate clients we offer dedicated contacts and, on request, monthly consolidated invoicing. That keeps billing clear and your team always travels to the same high standard.\n\nWe are happy to prepare an individual offer for regular rides. Get in touch – we will shape the transfer to fit your business day.',
      tr: 'İş seyahatlerinde zaman en değerli varlıktır. Güvenilir bir şoför hizmeti; park yeri, tarife veya kiralık araç yerine toplantılarınıza odaklanmanızı sağlar.\n\nİster havalimanından Stuttgart fuar alanına transfer, ister toplantılar arası yolculuk, ister önemli misafirlerin karşılanması olsun: dakik, gösterişsiz ve profesyoneliz. Araçta Wi-Fi ve sessizlikle kesintisiz çalışmaya devam edersiniz.\n\nKurumsal müşteriler için sabit irtibat kişileri ve talep üzerine aylık toplu fatura sunuyoruz. Böylece muhasebe sade kalır, ekibiniz her zaman aynı yüksek standartta seyahat eder.\n\nDüzenli yolculuklar için size özel teklif hazırlamaktan memnuniyet duyarız. Bize ulaşın – transferi iş gününüze göre şekillendirelim.',
    },
  },
  {
    slug: 'flughafen-stuttgart-abholung',
    date: '2026-07-01',
    image: '/images/interior.jpg',
    title: {
      de: 'Abholung am Flughafen Stuttgart: So funktioniert es',
      en: 'Pickup at Stuttgart Airport: how it works',
      tr: 'Stuttgart Havalimanında karşılama: nasıl işler',
    },
    excerpt: {
      de: 'Flugüberwachung, Meet & Greet und Festpreis – Ihr Ablauf bei der Ankunft.',
      en: 'Flight tracking, meet & greet and a fixed price – your arrival, step by step.',
      tr: 'Uçuş takibi, karşılama ve sabit fiyat – varışta işleyiş adım adım.',
    },
    body: {
      de: 'Die Ankunft an einem fremden Flughafen kann stressig sein – vor allem nach einem langen Flug. Damit Ihre Abholung am Flughafen Stuttgart reibungslos verläuft, erklären wir hier den Ablauf.\n\nNach der Landung überwachen wir Ihren Flug in Echtzeit. Sie müssen uns also nicht anrufen, wenn sich etwas verschiebt – wir passen die Abholzeit automatisch an. 60 Minuten Wartezeit sind immer inklusive.\n\nIhr Chauffeur erwartet Sie in der Ankunftshalle, gut sichtbar mit einem Namensschild. Er hilft Ihnen mit dem Gepäck und begleitet Sie zum Fahrzeug, das in der Nähe bereitsteht.\n\nDer Preis steht bereits bei der Buchung fest – kein Taxameter, keine Überraschungen. Bezahlt wird bequem im Fahrzeug, bar oder mit Karte. So beginnt Ihr Aufenthalt in Stuttgart entspannt und planbar.',
      en: 'Arriving at an unfamiliar airport can be stressful – especially after a long flight. To make sure your pickup at Stuttgart Airport goes smoothly, here is how it works.\n\nAfter you land, we monitor your flight in real time. You do not need to call us if something shifts – we adjust the pickup time automatically. 60 minutes of waiting time are always included.\n\nYour chauffeur waits for you in the arrivals hall, clearly visible with a name sign. He helps with your luggage and walks you to the vehicle waiting nearby.\n\nThe price is already fixed at booking – no meter, no surprises. You pay conveniently in the car, by cash or card. That is how your stay in Stuttgart starts: relaxed and predictable.',
      tr: 'Yabancı bir havalimanına varış, özellikle uzun bir uçuştan sonra yorucu olabilir. Stuttgart Havalimanındaki karşılamanızın sorunsuz geçmesi için işleyişi anlatalım.\n\nİndikten sonra uçuşunuzu gerçek zamanlı izleriz. Bir şey değişirse bizi aramanıza gerek yok – karşılama saatini otomatik ayarlarız. 60 dakika bekleme her zaman dahildir.\n\nŞoförünüz sizi varış salonunda, isim tabelasıyla belirgin şekilde bekler. Bagajınıza yardım eder ve yakında hazır bekleyen araca kadar size eşlik eder.\n\nFiyat rezervasyonda bellidir – taksimetre yok, sürpriz yok. Ödeme araçta rahatça, nakit veya kartla yapılır. Böylece Stuttgart’taki konaklamanız rahat ve öngörülebilir başlar.',
    },
  },
  {
    slug: 'vip-limousine-events',
    date: '2026-06-15',
    image: '/images/blog-event.jpg',
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
      de: 'Ob Hochzeit, Gala, Abschlussball oder Firmenfeier – der erste Eindruck zählt. Eine stilvolle Limousine mit professionellem Chauffeur macht Ihren großen Moment perfekt.\n\nFür besondere Anlässe empfehlen wir die Mercedes S-Klasse: großzügiger Komfort, edle Materialien und eine ruhige, souveräne Fahrt. Für größere Gruppen bietet die V-Klasse Platz, ohne auf Eleganz zu verzichten.\n\nUnsere Chauffeure erscheinen im Anzug, sind ortskundig und diskret. Auf Wunsch planen wir mehrere Stationen – etwa von zu Hause zur Location und später zurück – und halten uns exakt an Ihren Zeitplan.\n\nSprechen Sie uns frühzeitig an, besonders in der Hochzeits- und Ballsaison. So sichern Sie sich Ihr Wunschfahrzeug und wir stimmen jedes Detail in Ruhe mit Ihnen ab.',
      en: 'Whether it is a wedding, gala, prom or company celebration – first impressions count. A stylish limousine with a professional chauffeur makes your big moment perfect.\n\nFor special occasions we recommend the Mercedes S-Class: generous comfort, fine materials and a smooth, composed ride. For larger groups, the V-Class offers space without compromising on elegance.\n\nOur chauffeurs arrive in a suit, know the area and stay discreet. On request we plan several stops – for example from home to the venue and back later – and keep exactly to your schedule.\n\nGet in touch early, especially during wedding and prom season. That way you secure your preferred vehicle and we can arrange every detail with you in peace.',
      tr: 'İster düğün, ister gala, ister mezuniyet balosu ya da şirket kutlaması olsun – ilk izlenim önemlidir. Profesyonel şoförlü şık bir limuzin, büyük anınızı kusursuz kılar.\n\nÖzel anlar için Mercedes S-Serisini öneririz: geniş konfor, seçkin malzemeler ve sakin, güvenli bir sürüş. Daha büyük gruplar için V-Serisi, şıklıktan ödün vermeden yer sunar.\n\nŞoförlerimiz takım elbiseyle gelir, bölgeyi iyi bilir ve gösterişsizdir. Talep üzerine birden fazla durak planlarız – örneğin evden mekâna, sonra geri – ve programınıza tam uyarız.\n\nÖzellikle düğün ve balo sezonunda bize erkenden ulaşın. Böylece istediğiniz aracı garantiler, her ayrıntıyı sizinle rahatça planlarız.',
    },
  },
  {
    slug: 'flughafentransfer-tipps',
    date: '2026-06-01',
    image: '/images/blog-airport.jpg',
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
      de: 'Ein Flug beginnt nicht am Gate, sondern an der Haustür. Wer den Transfer zum Flughafen Stuttgart im Voraus plant, spart sich Hektik, Parkplatzsuche und den ständigen Blick auf die Uhr. Mit diesen fünf Tipps kommen Sie entspannt und pünktlich an.\n\n1. Planen Sie Puffer ein. Rechnen Sie für innerstädtische Fahrten großzügig und berücksichtigen Sie den Berufsverkehr. Wir kalkulieren die Abholzeit so, dass Sie ohne Stress einchecken können.\n\n2. Geben Sie Ihre Flugnummer an. So können wir Ihren Flug überwachen und die Abholung bei Verspätung oder früherer Landung automatisch anpassen.\n\n3. Wählen Sie das passende Fahrzeug. Reisen Sie allein oder zu zweit, genügt die E-Klasse. Für Familien oder Gruppen mit viel Gepäck sind V-Klasse oder Sprinter die bessere Wahl.\n\n4. Zahlen Sie bequem im Fahrzeug. Bei uns gibt es keine versteckten Kosten – der Festpreis steht vor der Fahrt fest, gezahlt wird bar oder mit Karte.\n\n5. Lehnen Sie sich zurück. Ihr Chauffeur kümmert sich um Gepäck, Route und Verkehr. Sie genießen die Fahrt und starten erholt in die Reise.',
      en: "A trip does not begin at the gate – it begins at your front door. Planning your transfer to Stuttgart Airport in advance saves you the rush, the parking search and the constant glance at the clock. These five tips get you there relaxed and on time.\n\n1. Build in a buffer. Allow generous time for city trips and account for rush hour. We calculate the pickup time so you can check in without stress.\n\n2. Provide your flight number. This lets us monitor your flight and adjust the pickup automatically in case of a delay or early landing.\n\n3. Choose the right vehicle. Travelling alone or as a pair? The E-Class is plenty. For families or groups with lots of luggage, the V-Class or Sprinter is the better choice.\n\n4. Pay conveniently in the car. There are no hidden costs – the fixed price is set before the ride and you pay by cash or card.\n\n5. Sit back. Your chauffeur takes care of luggage, route and traffic. You enjoy the ride and start your journey refreshed.",
      tr: 'Yolculuk kapıda değil, evin kapısında başlar. Stuttgart Havalimanı transferinizi önceden planlamak; telaşı, park yeri aramayı ve saate bakıp durmayı ortadan kaldırır. Bu beş ipucuyla rahat ve dakik ulaşırsınız.\n\n1. Pay bırakın. Şehir içi yolculuklar için bol zaman ayırın ve trafiği hesaba katın. Karşılama saatini, stressiz check-in yapabileceğiniz şekilde planlarız.\n\n2. Uçuş numaranızı verin. Böylece uçuşunuzu izler, gecikme veya erken iniş durumunda karşılamayı otomatik ayarlarız.\n\n3. Uygun aracı seçin. Tek veya çift kişilik seyahatte E-Serisi yeterlidir. Bol bagajlı aileler veya gruplar için V-Serisi ya da Sprinter daha iyidir.\n\n4. Araçta rahatça ödeyin. Gizli ücret yok – sabit fiyat yolculuktan önce bellidir, nakit veya kartla ödenir.\n\n5. Arkanıza yaslanın. Şoförünüz bagaj, güzergâh ve trafikle ilgilenir. Siz yolculuğun tadını çıkarır, seyahatinize dinlenmiş başlarsınız.',
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
