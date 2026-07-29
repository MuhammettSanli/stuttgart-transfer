'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

// Admin login form. Posts to /api/admin/login, then refreshes to reveal the
// bookings table (server component re-checks the session cookie).
export function LoginForm() {
  const t = useTranslations('Admin');
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
      if (res.ok) router.refresh();
      else if (res.status === 429) setError(t('loginRateLimited'));
      else setError(t('loginError'));
    } catch {
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="panel mx-auto max-w-sm overflow-hidden">
      <div className="h-1 w-full bg-gold" />
      <div className="p-7">
        <h1 className="mb-6 font-display text-2xl font-semibold text-ink">{t('loginTitle')}</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="u" className="field-label">{t('username')}</label>
            <input id="u" className="field-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="p" className="field-label">{t('password')}</label>
            <input id="p" type="password" className="field-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '…' : t('signIn')}
          </button>
        </div>
      </div>
    </form>
  );
}
