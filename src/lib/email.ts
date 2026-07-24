import { Resend } from 'resend';
import { formatEuroCents } from './pricing';
import { siteConfig } from '@/config/site';

// Thin Resend wrapper. If RESEND_API_KEY is missing (e.g. local dev without a
// key) we log instead of throwing, so bookings still succeed during setup.
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

interface BookingEmailData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupAt: Date;
  passengers: number;
  luggage: number;
  vehicleName: string;
  priceCents: number;
  notes?: string | null;
}

function formatRow(label: string, value: string): string {
  return `<tr><td style="padding:4px 12px 4px 0;color:#555;">${label}</td><td style="padding:4px 0;font-weight:600;">${value}</td></tr>`;
}

function buildSummaryTable(b: BookingEmailData): string {
  const when = b.pickupAt.toLocaleString('de-DE');
  return `<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
    ${formatRow('Von', b.pickupAddress)}
    ${formatRow('Nach', b.dropoffAddress)}
    ${formatRow('Datum/Zeit', when)}
    ${formatRow('Fahrzeug', b.vehicleName)}
    ${formatRow('Personen', String(b.passengers))}
    ${formatRow('Gepäck', String(b.luggage))}
    ${formatRow('Preis', formatEuroCents(b.priceCents, 'de'))}
    ${b.notes ? formatRow('Anmerkung', b.notes) : ''}
  </table>`;
}

/** Notify the operator and confirm to the customer. Never throws to the caller. */
export async function sendBookingEmails(b: BookingEmailData): Promise<void> {
  const from = process.env.BOOKING_FROM_EMAIL ?? 'no-reply@example.de';
  const notify = process.env.BOOKING_NOTIFY_EMAIL ?? siteConfig.email;
  const summary = buildSummaryTable(b);

  if (!resend) {
    console.info('[email] RESEND_API_KEY missing — skipping send for booking', b.id);
    return;
  }

  try {
    // Operator notification
    await resend.emails.send({
      from,
      to: notify,
      replyTo: b.email,
      subject: `Neue Buchung: ${b.firstName} ${b.lastName} (${b.pickupAt.toLocaleDateString('de-DE')})`,
      html: `<h2>Neue Buchung #${b.id.slice(-6)}</h2>
        <p>${b.firstName} ${b.lastName} · ${b.phone} · ${b.email}</p>
        ${summary}`,
    });

    // Customer confirmation
    await resend.emails.send({
      from,
      to: b.email,
      subject: `Ihre Transfer-Anfrage bei ${siteConfig.shortName}`,
      html: `<p>Hallo ${b.firstName},</p>
        <p>vielen Dank für Ihre Buchung. Wir bestätigen Ihre Fahrt in Kürze.</p>
        ${summary}
        <p>Zahlung erfolgt bar oder mit Karte im Fahrzeug.</p>
        <p>${siteConfig.name} · ${siteConfig.phone}</p>`,
    });
  } catch (err) {
    console.error('[email] Failed to send booking emails for', b.id, err);
  }
}
