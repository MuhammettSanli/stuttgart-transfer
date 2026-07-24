import { useTranslations } from 'next-intl';
import { BookingForm } from './BookingForm';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-light opacity-95" />
      <div className="container-page relative grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
            {t('badge')}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{t('title')}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/85">{t('subtitle')}</p>
        </div>
        <div className="lg:pl-6">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
