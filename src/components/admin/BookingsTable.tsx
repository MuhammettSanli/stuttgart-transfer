'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { formatEuroCents } from '@/lib/pricing';

export interface AdminBooking {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickupAddress: string;
  dropoffAddress: string;
  pickupAt: string; // ISO
  passengers: number;
  luggage: number;
  vehicleName: string;
  priceCents: number;
}

const STATUSES = ['NEW', 'CONFIRMED', 'DONE', 'CANCELLED'] as const;

const STATUS_STYLE: Record<string, string> = {
  NEW: 'bg-gold/15 text-gold-dark border border-gold/30',
  CONFIRMED: 'bg-green-100 text-green-800 border border-green-200',
  DONE: 'bg-line text-graphite border border-line',
  CANCELLED: 'bg-red-100 text-red-700 border border-red-200',
};

export function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | (typeof STATUSES)[number]>('ALL');

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: bookings.length };
    STATUSES.forEach((s) => (c[s] = bookings.filter((b) => b.status === s).length));
    return c;
  }, [bookings]);

  const visible = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter);

  async function updateStatus(id: string, status: string) {
    setSavingId(id);
    try {
      await fetch(`/api/admin/booking/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setSavingId(null);
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.refresh();
  }

  const statusLabel = (s: string) => t(`status${s}` as 'statusNEW');

  return (
    <div>
      <div className="mb-6 flex items-center justify-between border-b border-line pb-5">
        <h1 className="font-display text-2xl font-semibold text-ink">
          {t('title')} <span className="text-graphite">· {bookings.length}</span>
        </h1>
        <button
          onClick={logout}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite transition hover:text-gold-dark"
        >
          {t('logout')}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['ALL', ...STATUSES] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 rounded-none border px-4 py-2 text-xs font-medium uppercase tracking-wide transition ${
              filter === key
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-graphite hover:border-gold/40'
            }`}
          >
            {key === 'ALL' ? t('all') : statusLabel(key)}
            <span className={`font-mono ${filter === key ? 'text-gold' : 'text-ink/50'}`}>{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-line bg-paper">
            <tr className="text-[11px] uppercase tracking-wider text-graphite">
              <th className="p-4 font-medium">{t('colDate')}</th>
              <th className="p-4 font-medium">{t('colCustomer')}</th>
              <th className="p-4 font-medium">{t('colRoute')}</th>
              <th className="p-4 font-medium">{t('colVehicle')}</th>
              <th className="p-4 font-medium">{t('colPrice')}</th>
              <th className="p-4 font-medium">{t('colStatus')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((b) => (
              <tr key={b.id} className="align-top transition hover:bg-paper/60">
                <td className="p-4 font-mono text-xs text-graphite">
                  {new Date(b.pickupAt).toLocaleString(locale)}
                </td>
                <td className="p-4">
                  <div className="font-medium text-ink">{b.firstName} {b.lastName}</div>
                  <div className="text-xs text-graphite">{b.phone}</div>
                  <div className="text-xs text-graphite">{b.email}</div>
                </td>
                <td className="p-4 text-graphite">
                  <div className="text-ink">{b.pickupAddress}</div>
                  <div className="text-graphite">→ {b.dropoffAddress}</div>
                  <div className="mt-1 font-mono text-xs text-graphite">👤 {b.passengers} · 🧳 {b.luggage}</div>
                </td>
                <td className="p-4 text-graphite">{b.vehicleName}</td>
                <td className="p-4 font-mono font-semibold text-ink">{formatEuroCents(b.priceCents, locale)}</td>
                <td className="p-4">
                  <span className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_STYLE[b.status]}`}>
                    {statusLabel(b.status)}
                  </span>
                  <select
                    className="block w-full rounded-none border border-line bg-white px-2 py-1.5 text-xs outline-none focus:border-gold"
                    value={b.status}
                    disabled={savingId === b.id}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{statusLabel(s)}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-graphite">{t('empty')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
