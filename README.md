# Stuttgart Flughafen Transfer

Stuttgart bölgesi için özel olarak geliştirilmiş bir **havalimanı transfer / VIP şoför rezervasyon sitesi**. Ziyaretçi alış ve varış noktasını, tarih/saat ve aracı seçer; **mesafeye göre anlık sabit fiyatı** görür ve rezervasyon oluşturur. Korumalı bir yönetim paneli, işletmecinin rezervasyonları yönetmesini ve müşterilere dönüş yapmasını sağlar.

Sıfırdan modern bir web uygulaması olarak geliştirildi (WordPress değil). Çok dilli: **Almanca / İngilizce / Türkçe** — varsayılan dil Almanca.

🔗 **Canlı site:** https://stuttgart-transfer-pa8b6r2na-muhamemt.vercel.app/tr

> **Ödeme kapsam dışıdır (tasarım gereği).** Ücretler araçta ödenir (nakit veya kart). Online ödeme / Stripe entegrasyonu yoktur.

---

## Özellikler

- **Anlık fiyat hesabı** – gerçek sürüş mesafesinden (Google Distance Matrix) canlı fiyat; sunucu tarafı otoriter fiyat motoru.
- **3 adımlı rezervasyon** – (1) yolculuk & fiyat → (2) ekstralar → (3) iletişim & tamamla.
- **Ücretli ekstralar** – araç içi minibar (su, kola, soda, meyve suyu, bira, şarap, prosecco) toplama eklenir; yaşa göre ücretsiz çocuk koltuğu (bebek / çocuk / yükseltici).
- **Sabit güzergâh fiyatları** – uzak şehir çiftleri için sabit fiyat, mesafeli hesabı geçersiz kılar.
- **3 kademe filo** – Business (E-Serisi), First Class (S-Serisi), Van (V-Serisi), Sprinter; her birinin kendi fiyat çarpanı var.
- **Çok dilli (DE / EN / TR)** – tüm metinler `next-intl` katalogları üzerinden; Almanca yedek dildir.
- **Yönetim paneli** – tek yönetici girişi, durum akışlı rezervasyon listesi (Yeni → Onaylı → Tamamlandı / İptal), canlı arama ve tek tıkla **Ara / WhatsApp / E-posta** yanıtı (müşterinin dilinde hazır onay mesajıyla).
- **E-posta bildirimleri** – işletmeye bildirim + müşteriye onay (Resend).
- **Kötüye kullanım koruması** – IP başına hız sınırı (Postgres destekli) fiyat, rezervasyon, iletişim ve yönetici girişi uç noktalarında.

## Teknolojiler

| Alan | Tercih |
|------|--------|
| Çatı | Next.js (App Router) + TypeScript |
| Tasarım | Tailwind CSS, Framer Motion |
| Çoklu dil | next-intl (`[locale]` segmenti) |
| Veritabanı | PostgreSQL (Supabase) + Prisma |
| Harita | Google Maps Places (adres tamamlama) + Distance Matrix (mesafe/süre) |
| E-posta | Resend |
| Barındırma | Vercel (uygulama) + Supabase (veritabanı) |

## Mimari

Birbiriyle uyumlu olması gereken üç katman:

1. **Rezervasyon arayüzü** (`components/BookingForm.tsx`) yolculuk bilgilerini alır, canlı fiyatı gösterir.
2. **Fiyat API'si** (`app/api/quote/`) mesafe için `lib/maps.ts`, ardından fiyat motoru `lib/pricing.ts`'i çağırır.
3. **Rezervasyon API'si** (`app/api/booking/`) fiyatı sunucuda yeniden hesaplar (otoriter), rezervasyonu kaydeder ve e-posta gönderir.

**Fiyat motoru (`lib/pricing.ts`) uygulamanın kalbidir:**

```
fiyat = temel ücret
      + (mesafeKm × kmÜcreti × araçÇarpanı)
      + gece zammı   (22:00–06:00)
      + havalimanı ücreti
      + ücretli ekstralar (minibar)
```

Ücretler, çarpanlar ve sabit güzergâhlar **veritabanında** tutulur (`pricing_rules`, `vehicles`, `routes`) — bileşenlere gömülmez; böylece istemci önizlemesi ile sunucu fiyatı hep aynı çıkar. **Sunucu fiyatı otoriterdir; istemci önizlemesi yalnızca kullanıcı kolaylığıdır.** Tüm para **tam sayı cent (EUR)** olarak tutulur — asla ondalık (float) değil.

## Proje yapısı

```
src/
  app/[locale]/        de | en | tr yerelleştirilmiş sayfalar
    page.tsx           anasayfa (hero + rezervasyon formu)
    about, services/[slug], fleet, blog/[slug], contact
    admin/             korumalı: rezervasyon listesi + durum + hızlı yanıt
  app/api/
    quote/             fiyat hesabı
    booking/           rezervasyon kaydı + e-posta
    contact/           iletişim formu e-postası
    admin/             giriş / çıkış / durum güncelleme
  components/          arayüz (BookingForm, Header, admin/BookingsTable, …)
  lib/                 pricing.ts, maps.ts, quote-service.ts, email.ts,
                       auth.ts, validation.ts, extras.ts, rate-limit.ts, prisma.ts
  i18n/                next-intl yönlendirme
  config/site.ts       firma iletişim bilgileri & hizmet slug'ları
messages/{de,en,tr}.json   çeviri katalogları
prisma/schema.prisma + seed.ts
```

Ana tablolar: `bookings`, `vehicles`, `pricing_rules`, `routes`, `rate_limits`.

## Kurallar

- **Para** her zaman tam sayı cent (EUR) — asla float.
- **Bileşenlerde metin gömülü olmaz** — tüm yazılar `next-intl` kataloglarından gelir.
- **İçerik statiktir** — blog yazıları ve hizmet metinleri repoda (CMS yok).
- **Gizli anahtarlar** yalnızca `.env.local` / Vercel ortamında — asla repoya işlenmez.
