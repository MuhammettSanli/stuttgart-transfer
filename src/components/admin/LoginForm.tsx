'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Admin login form. Posts to /api/admin/login, then refreshes to reveal the
// bookings table (server component re-checks the session cookie).
export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError('Anmeldung fehlgeschlagen.');
      }
    } catch {
      setError('Anmeldung fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-bold text-brand">Admin Login</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="u" className="field-label">Benutzername</label>
          <input id="u" className="field-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="p" className="field-label">Passwort</label>
          <input id="p" type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? '…' : 'Anmelden'}
        </button>
      </div>
    </form>
  );
}
