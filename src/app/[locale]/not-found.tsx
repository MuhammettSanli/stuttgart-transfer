import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('Nav');
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-4 text-gray-600">Seite nicht gefunden / Page not found / Sayfa bulunamadı</p>
      <Link href="/" className="btn-primary mt-8">{t('home')}</Link>
    </div>
  );
}
