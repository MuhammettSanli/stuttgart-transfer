'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { AddressInput } from './AddressInput';
import { formatEuroCents } from '@/lib/pricing';

type VehicleSlug = 'business' | 'first' | 'van' | 'sprinter';

interface QuoteResponse {
  totalCents: number;
  currency: string;
  breakdown?: { isFixedRoute: boolean };
}

const VEHICLES: VehicleSlug[] = ['business', 'first', 'van', 'sprinter'];

// Country dial codes for the phone field. Capturing the code makes the stored
// number unambiguous so the admin "Call / WhatsApp" actions always resolve the
// right country. German market default first.
const DIAL_CODES = [
  { code: '+49', label: '🇩🇪 +49' },
  { code: '+90', label: '🇹🇷 +90' },
  { code: '+43', label: '🇦🇹 +43' },
  { code: '+41', label: '🇨🇭 +41' },
  { code: '+33', label: '🇫🇷 +33' },
  { code: '+31', label: '🇳🇱 +31' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+1', label: '🇺🇸 +1' },
] as const;

const BACK_BTN =
  'shrink-0 border border-line px-5 py-3 text-sm font-medium text-ink transition hover:border-gold hover:text-gold-dark';

export function BookingForm() {
  const t = useTranslations('Booking');
  const tf = useTranslations('Fleet');
  const locale = useLocale();

  // Wizard step: 1 = trip & price, 2 = extras, 3 = contact & finish.
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vehicleSlug, setVehicleSlug] = useState<VehicleSlug>('business');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);
  // Extras
  const [babySeat, setBabySeat] = useState(0);
  const [childSeat, setChildSeat] = useState(0);
  const [boosterSeat, setBoosterSeat] = useState(0);
  const [minibar, setMinibar] = useState(false);
  // Contact
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+49');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [price, setPrice] = useState<QuoteResponse | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Earliest selectable date (local today) — prevents bookings in the past.
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const pickupAtIso = date && time ? `${date}T${time}:00` : '';
  const canProceed = pickup.length >= 3 && dropoff.length >= 3 && !!pickupAtIso && !!price;

  const STEPS = [
    { n: 1 as const, label: t('step1Label') },
    { n: 2 as const, label: t('step2Label') },
    { n: 3 as const, label: t('step3Label') },
  ];

  const SEATS = [
    { label: t('seatBaby'), val: babySeat, set: setBabySeat },
    { label: t('seatChild'), val: childSeat, set: setChildSeat },
    { label: t('seatBooster'), val: boosterSeat, set: setBoosterSeat },
  ];

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
          setQuoteError(
            res.status === 429 ? t('errorRateLimit') : res.status === 422 ? t('errorRoute') : t('errorGeneric'),
          );
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
    if (step !== 3) return; // only the final step submits
    setSubmitError(null);
    setSubmitting(true);

    // Combine dial code with the local number, dropping any leading trunk zero
    // so the stored value is a clean international number (e.g. +49 5519656049).
    const localPhone = phone.replace(/[^\d]/g, '').replace(/^0+/, '');
    const fullPhone = localPhone ? `${dialCode} ${localPhone}` : phone;

    // Fold the extras selection into the notes so they reach the admin + emails.
    const extras: string[] = [];
    if (babySeat > 0) extras.push(`${t('seatBaby')} ×${babySeat}`);
    if (childSeat > 0) extras.push(`${t('seatChild')} ×${childSeat}`);
    if (boosterSeat > 0) extras.push(`${t('seatBooster')} ×${boosterSeat}`);
    if (minibar) extras.push(t('minibar'));
    const extrasText = extras.length ? `[${t('extrasLabel')}: ${extras.join(', ')}]` : '';
    const combinedNotes = [extrasText, notes].filter(Boolean).join('\n').trim();

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
          phone: fullPhone,
          passengers,
          luggage,
          notes: combinedNotes,
          locale,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === 'RATE_LIMIT') setSubmitError(t('errorRateLimit'));
        else if (data?.error === 'VALIDATION') setSubmitError(t('errorValidation'));
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
      <div className="panel p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-none border border-signal text-xl text-signal">
          ✓
        </div>
        <h3 className="font-display text-2xl font-medium text-ink">{t('successTitle')}</h3>
        <p className="mt-2 text-gray-600">{t('successDesc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="panel overflow-hidden">
      {/* Gold top accent */}
      <div className="h-1 w-full bg-gold" />

      <div className="p-6 sm:p-7">
        <h3 className="font-display text-xl font-medium text-ink">{t('title')}</h3>

        {/* Step indicator */}
        <ol className="mb-6 mt-5 flex items-center border-b border-line pb-5">
          {STEPS.map((s, i) => {
            const state = step === s.n ? 'active' : step > s.n ? 'done' : 'todo';
            return (
              <li key={s.n} className="flex flex-1 items-center last:flex-none">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs ${
                      state === 'active'
                        ? 'bg-ink text-paper'
                        : state === 'done'
                        ? 'bg-gold text-charcoal'
                        : 'border border-line text-graphite'
                    }`}
                  >
                    {state === 'done' ? '✓' : s.n}
                  </span>
                  <span className={`text-xs font-medium ${state === 'todo' ? 'text-graphite' : 'text-ink'} hidden sm:inline`}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && <span className="mx-2 h-px flex-1 bg-line" />}
              </li>
            );
          })}
        </ol>

        {/* Compact price recap on later steps */}
        {step > 1 && price && (
          <div className="mb-5 flex items-center justify-between border border-gold bg-ink px-4 py-3 text-paper">
            <span className="mono-label text-paper/60">{t('estimatedPrice')}</span>
            <span className="font-mono text-2xl font-medium text-gold">{formatEuroCents(price.totalCents, locale)}</span>
          </div>
        )}

        {/* STEP 1 — trip & price */}
        {step === 1 && (
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
                <input id="date" type="date" min={todayStr} className="field-input" value={date} onChange={(e) => setDate(e.target.value)} />
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

            {/* Live price — instrument readout */}
            <div className={`border bg-ink px-5 py-5 text-paper transition-colors ${price ? 'border-gold' : 'border-ink'}`}>
              <div className="flex items-center justify-between">
                <span className="mono-label text-paper/60">{t('estimatedPrice')}</span>
                <span className="font-mono text-[11px] text-gold">{price ? 'FEST' : quoting ? '···' : '—'}</span>
              </div>
              {quoting ? (
                <p className="mt-1 font-mono text-4xl text-paper/40">·····</p>
              ) : quoteError ? (
                <p className="mt-2 text-sm text-red-300">{quoteError}</p>
              ) : price ? (
                <>
                  <p className="mt-1 font-mono text-5xl font-medium tracking-tight text-gold">
                    {formatEuroCents(price.totalCents, locale)}
                  </p>
                  <p className="mt-1 mono-label text-paper/50">{t('priceNote')}</p>
                </>
              ) : (
                <p className="mt-1 font-mono text-4xl text-paper/25">€ —,—</p>
              )}
            </div>

            <button type="button" className="btn-primary w-full" disabled={!canProceed} onClick={() => setStep(2)}>
              {t('next')}
            </button>
            {!canProceed && <p className="text-center text-xs text-graphite">{t('continueHint')}</p>}
          </div>
        )}

        {/* STEP 2 — extras */}
        {step === 2 && (
          <div className="grid gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="mono-label text-gold">{t('childSeatsLabel')}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {SEATS.map((s) => (
                  <div key={s.label}>
                    <label className="field-label block min-h-[2.5rem] text-[11px] leading-tight">{s.label}</label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      className="field-input"
                      value={s.val}
                      onChange={(e) => s.set(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 border border-line p-4 transition hover:border-gold/40">
              <input
                type="checkbox"
                className="h-4 w-4 accent-gold"
                checked={minibar}
                onChange={(e) => setMinibar(e.target.checked)}
              />
              <span>
                <span className="block text-sm font-semibold text-ink">{t('minibar')}</span>
                <span className="block text-xs text-graphite">{t('minibarHint')}</span>
              </span>
            </label>

            <p className="text-xs text-graphite">{t('extrasNote')}</p>

            <div className="flex gap-3">
              <button type="button" className={BACK_BTN} onClick={() => setStep(1)}>{t('back')}</button>
              <button type="button" className="btn-primary flex-1" onClick={() => setStep(3)}>{t('next')}</button>
            </div>
          </div>
        )}

        {/* STEP 3 — contact & finish */}
        {step === 3 && (
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <span className="mono-label text-gold">{t('contactLabel')}</span>
              <span className="h-px flex-1 bg-line" />
            </div>

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
                <div className="flex gap-2">
                  <select
                    aria-label={t('phone')}
                    className="field-input w-[92px] shrink-0 px-2"
                    value={dialCode}
                    onChange={(e) => setDialCode(e.target.value)}
                  >
                    {DIAL_CODES.map((d) => (
                      <option key={d.code} value={d.code}>{d.label}</option>
                    ))}
                  </select>
                  <input id="phone" type="tel" minLength={6} className="field-input" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="field-label">{t('notes')}</label>
              <textarea id="notes" rows={2} className="field-input" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex gap-3">
              <button type="button" className={BACK_BTN} onClick={() => setStep(2)}>{t('back')}</button>
              <button type="submit" className="btn-primary flex-1" disabled={submitting}>
                {submitting ? t('submitting') : t('submit')}
              </button>
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-line pt-4">
          {[t('badgeFixed'), t('badgeNoHidden'), t('badgePayInCar'), '24/7'].map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-graphite">
              <span className="text-gold">✦</span>
              {b}
            </span>
          ))}
        </div>
      </div>
    </form>
  );
}
