// Builds a ready-to-send customer reply (email subject/body + WhatsApp text)
// from a booking, in the CUSTOMER's language. Used by the admin panel's quick
// contact buttons so the operator can confirm a ride in one click.

import { formatEuroCents } from './pricing';
import { siteConfig } from '@/config/site';

export interface ReplyBooking {
  firstName: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupAt: string; // ISO
  vehicleName: string;
  passengers: number;
  priceCents: number;
}

type L = 'de' | 'en' | 'tr';

const LOCALE_TAG: Record<L, string> = { de: 'de-DE', en: 'en-GB', tr: 'tr-TR' };

interface Fields {
  firstName: string;
  pickup: string;
  dropoff: string;
  when: string;
  vehicle: string;
  pax: number;
  price: string;
  company: string;
  companyPhone: string;
}

const REPLY: Record<L, { subject: (company: string) => string; body: (f: Fields) => string }> = {
  de: {
    subject: (c) => `Ihre Transfer-Buchung bei ${c}`,
    body: (f) => `Hallo ${f.firstName},

vielen Dank für Ihre Buchung bei ${f.company}. Wir bestätigen Ihre Fahrt gerne:

Von: ${f.pickup}
Nach: ${f.dropoff}
Datum/Zeit: ${f.when}
Fahrzeug: ${f.vehicle}
Personen: ${f.pax}
Festpreis: ${f.price}

Die Zahlung erfolgt bar oder mit Karte im Fahrzeug. Bei Fragen erreichen Sie uns unter ${f.companyPhone}.

Beste Grüße
${f.company}`,
  },
  en: {
    subject: (c) => `Your transfer booking with ${c}`,
    body: (f) => `Hello ${f.firstName},

thank you for your booking with ${f.company}. We are happy to confirm your ride:

From: ${f.pickup}
To: ${f.dropoff}
Date/Time: ${f.when}
Vehicle: ${f.vehicle}
Passengers: ${f.pax}
Fixed price: ${f.price}

Payment is made by cash or card in the vehicle. If you have any questions, reach us at ${f.companyPhone}.

Best regards
${f.company}`,
  },
  tr: {
    subject: (c) => `${c} transfer rezervasyonunuz`,
    body: (f) => `Merhaba ${f.firstName},

${f.company} rezervasyonunuz için teşekkür ederiz. Yolculuğunuzu memnuniyetle onaylıyoruz:

Nereden: ${f.pickup}
Nereye: ${f.dropoff}
Tarih/Saat: ${f.when}
Araç: ${f.vehicle}
Kişi: ${f.pax}
Sabit fiyat: ${f.price}

Ödeme araçta nakit veya kartla yapılır. Sorularınız için ${f.companyPhone} numaralı hattımızdan bize ulaşabilirsiniz.

İyi günler
${f.company}`,
  },
};

export function buildReply(b: ReplyBooking, locale: string): { subject: string; body: string } {
  const l: L = (['de', 'en', 'tr'] as const).includes(locale as L) ? (locale as L) : 'de';
  const when = new Date(b.pickupAt).toLocaleString(LOCALE_TAG[l]);
  const fields: Fields = {
    firstName: b.firstName,
    pickup: b.pickupAddress,
    dropoff: b.dropoffAddress,
    when,
    vehicle: b.vehicleName,
    pax: b.passengers,
    price: formatEuroCents(b.priceCents, l),
    company: siteConfig.name,
    companyPhone: siteConfig.phone,
  };
  return { subject: REPLY[l].subject(fields.company), body: REPLY[l].body(fields) };
}

/**
 * Normalize a customer phone number for a wa.me link (digits only, German
 * default). Handles +49…, 0049…, and local 0711… formats. Best-effort — the
 * operator can still correct the number in WhatsApp if it was entered oddly.
 */
export function waPhone(phone: string): string {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '49' + d.slice(1);
  return d;
}
