import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { siteConfig } from '@/config/site';

export function Footer() {
  const t = useTranslations('Footer');
  const nav = useTranslations('Nav');

  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <div className="text-lg font-bold text-white">
            <span className="text-gold">Stuttgart</span> Transfer
          </div>
          <p className="mt-3 text-sm">{t('tagline')}</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">{t('quickLinks')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/services" className="hover:text-gold">{nav('services')}</Link></li>
            <li><Link href="/fleet" className="hover:text-gold">{nav('fleet')}</Link></li>
            <li><Link href="/about" className="hover:text-gold">{nav('about')}</Link></li>
            <li><Link href="/blog" className="hover:text-gold">{nav('blog')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">{t('legal')}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-gold">{t('imprint')}</Link></li>
            <li><Link href="/contact" className="hover:text-gold">{t('privacy')}</Link></li>
            <li><Link href="/contact" className="hover:text-gold">{t('terms')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">{t('contact')}</h3>
          <ul className="space-y-2 text-sm">
            <li><a href={siteConfig.phoneHref} className="hover:text-gold">{siteConfig.phone}</a></li>
            <li><a href={`mailto:${siteConfig.email}`} className="hover:text-gold">{siteConfig.email}</a></li>
            <li>{siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. {t('rights')}
      </div>
    </footer>
  );
}
