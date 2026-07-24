'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import { contactSchema, type ContactRequest } from '@/lib/validation';

// Contact form with zod validation. Posts to /api/contact, which emails the
// operator (or logs when Resend isn't configured yet).
export function ContactForm() {
  const t = useTranslations('ContactForm');
  const locale = useLocale();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactRequest>({
    resolver: zodResolver(contactSchema),
    defaultValues: { locale: locale as ContactRequest['locale'] },
  });

  async function onSubmit(data: ContactRequest) {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (res.ok) setSuccess(true);
      else setServerError(t('error'));
    } catch {
      setServerError(t('error'));
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h3 className="font-bold text-green-800">{t('successTitle')}</h3>
        <p className="mt-1 text-sm text-green-700">{t('successDesc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-bold text-brand">{t('title')}</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="c-name" className="field-label">{t('name')}</label>
          <input id="c-name" className="field-input" {...register('name')} aria-invalid={!!errors.name} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-email" className="field-label">{t('email')}</label>
            <input id="c-email" type="email" className="field-input" {...register('email')} aria-invalid={!!errors.email} />
          </div>
          <div>
            <label htmlFor="c-phone" className="field-label">{t('phone')}</label>
            <input id="c-phone" type="tel" className="field-input" {...register('phone')} />
          </div>
        </div>
        <div>
          <label htmlFor="c-msg" className="field-label">{t('message')}</label>
          <textarea id="c-msg" rows={5} className="field-input" {...register('message')} aria-invalid={!!errors.message} />
        </div>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </button>
      </div>
    </form>
  );
}
