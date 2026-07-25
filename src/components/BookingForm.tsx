'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AddressInput } from './AddressInput';
import { formatEuroCents } from '@/lib/pricing';

type VehicleSlug = 'business' | 'van' | 'sprinter';

interface QuoteResponse {
  totalCents: number;
  currency: string;
  breakdown?: { isFixedRoute: boolean };
}

const VEHICLES: VehicleSlug[] = ['business', 'van', 'sprinter'];

export function BookingForm() {
  const t = useTranslations('Booking');
  const tf = useTranslations('Fleet');
  const locale = useLocale();

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleSlug, setVehicleSlug] = useState<VehicleSlug>('business');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [price, setPrice] = useState<QuoteResponse | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const pickupAtIso = date && time ? `${date}T${time}:00` : '';

  // Debounced live quote whenever the trip inputs change.
  useEffect(() => {
    setPrice(null);
    setQuoteError(null);
    if (pickup.length < 3 || dropoff.length < 3 || !pickupAtIso) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setQuoting(true);
      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pickup, dropoff, vehicleSlug, pickupAt: pickupAtIso }),
        });
        if (!res.ok) {
          setQuoteError(res.status === 422 ? t('errorRoute') : t('errorGeneric'));
          setPrice(null);
        } else {
          setPrice(await res.json());
        }
      } catch {
        setQuoteError(t('errorGeneric'));
      } finally {
        setQuoting(false);
      }
    }, 600);

    return () => debounceRef.current && clearTimeout(debounceRef.current);
  }, [pickup, dropoff, vehicleSlug, pickupAtIso, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup,
          dropoff,
          vehicleSlug,
          pickupAt: pickupAtIso,
          firstName,
          lastName,
          email,
          phone,
          passengers,
          luggage,
          notes,
          locale,
        }),
      });
      if (!res.ok) {
        // Distinguish input-validation failures from a genuine no-route result.
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === 'VALIDATION') setSubmitError(t('errorValidation'));
        else if (data?.error === 'NO_ROUTE') setSubmitError(t('errorRoute'));
        else setSubmitError(t('errorGeneric'));
      } else {
        setSuccess(true);
      }
    } catch {
      setSubmitError(t('errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-2xl text-gold-dark">
          ✓
        </div>
        <h3 className="font-display text-2xl font-normal text-brand">{t('successTitle')}</h3>
        <p className="mt-2 text-gray-600">{t('successDesc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-7">
      <h3 className="mb-5 font-display text-2xl font-normal text-brand">{t('title')}</h3>

      <div className="grid gap-4">
        <div>
          <label htmlFor="pickup" className="field-label">{t('pickup')}</label>
          <AddressInput id="pickup" value={pickup} onChange={setPickup} placeholder={t('pickupPlaceholder')} />
        </div>
        <div>
          <label htmlFor="dropoff" className="field-label">{t('dropoff')}</label>
          <AddressInput id="dropoff" value={dropoff} onChange={setDropoff} placeholder={t('dropoffPlaceholder')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="field-label">{t('date')}</label>
            <input id="date" type="date" className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="time" className="field-label">{t('time')}</label>
            <input id="time" type="time" className="field-input" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <div>
          <label htmlFor="vehicle" className="field-label">{t('vehicle')}</label>
          <select id="vehicle" className="field-input" value={vehicleSlug} onChange={(e) => setVehicleSlug(e.target.value as VehicleSlug)}>
            {VEHICLES.map((v) => (
              <option key={v} value={v}>{tf(`${v}.name`)}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="passengers" className="field-label">{t('passengers')}</label>
            <input id="passengers" type="number" min={1} max={16} className="field-input" value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="luggage" className="field-label">{t('luggage')}</label>
            <input id="luggage" type="number" min={0} max={30} className="field-input" value={luggage} onChange={(e) => setLuggage(Number(e.target.value))} />
          </div>
        </div>

        {/* Live price preview */}
        <div className="rounded-xl border border-gold/30 bg-brand p-5 text-center text-ivory">
          {quoting ? (
            <p className="text-sm text-ivory/70">{t('calculating')}</p>
          ) : quoteError ? (
            <p className="text-sm text-red-300">{quoteError}</p>
          ) : price ? (
            <>
              <p className="text-xs uppercase tracking-wider text-gold">{t('estimatedPrice')}</p>
              <p className="mt-1 font-display text-4xl font-normal text-ivory">{formatEuroCents(price.totalCents, locale)}</p>
              <p className="mt-1 text-xs text-ivory/60">{t('priceNote')}</p>
            </>
          ) : (
            <p className="text-sm text-ivory/50">{t('calculate')}</p>
          )}
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="field-label">{t('firstName')}</label>
            <input id="firstName" className="field-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="lastName" className="field-label">{t('lastName')}</label>
            <input id="lastName" className="field-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="field-label">{t('email')}</label>
            <input id="email" type="email" className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="phone" className="field-label">{t('phone')}</label>
            <input id="phone" type="tel" minLength={6} className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="field-label">{t('notes')}</label>
          <textarea id="notes" rows={2} className="field-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        {submitError && <p className="text-sm text-red-600">{submitError}</p>}

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
