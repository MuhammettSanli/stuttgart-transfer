'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  NEW: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  DONE: 'bg-gray-200 text-gray-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export function BookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

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

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand">Buchungen ({bookings.length})</h1>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-brand">Abmelden</button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Datum</th>
              <th className="p-3">Kunde</th>
              <th className="p-3">Route</th>
              <th className="p-3">Fahrzeug</th>
              <th className="p-3">Preis</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="p-3 align-top text-gray-600">
                  {new Date(b.pickupAt).toLocaleString('de-DE')}
                </td>
                <td className="p-3 align-top">
                  <div className="font-medium text-brand">{b.firstName} {b.lastName}</div>
                  <div className="text-xs text-gray-500">{b.phone}</div>
                  <div className="text-xs text-gray-500">{b.email}</div>
                </td>
                <td className="p-3 align-top text-gray-600">
                  <div>{b.pickupAddress}</div>
                  <div className="text-gray-400">→ {b.dropoffAddress}</div>
                  <div className="text-xs text-gray-400">{b.passengers}👤 · {b.luggage}🧳</div>
                </td>
                <td className="p-3 align-top text-gray-600">{b.vehicleName}</td>
                <td className="p-3 align-top font-semibold text-brand">{formatEuroCents(b.priceCents)}</td>
                <td className="p-3 align-top">
                  <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[b.status]}`}>
                    {b.status}
                  </span>
                  <select
                    className="block rounded border border-gray-300 px-2 py-1 text-xs"
                    value={b.status}
                    disabled={savingId === b.id}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-400">Noch keine Buchungen.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
