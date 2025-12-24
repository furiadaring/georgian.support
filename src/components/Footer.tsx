"use client";

import Link from "next/link";
import { CONTACT, COMPANY } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const t = dict.footer;
  const isRtl = isRtlLocale(locale);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navItems = [
    { href: "#advantages", label: dict.header.about },
    { href: "#insurance", label: dict.header.insurance },
    { href: "#faq", label: dict.header.faq },
    { href: "#contacts", label: dict.header.contacts },
  ];

  const tagline = locale === 'ru' ? 'Страхование в Грузии' : 
                  locale === 'en' ? 'Insurance in Georgia' :
                  locale === 'ka' ? 'დაზღვევა საქართველოში' :
                  locale === 'uk' ? 'Страхування в Грузії' :
                  locale === 'tr' ? 'Gürcistan\'da Sigorta' :
                  locale === 'he' ? 'ביטוח בגאורגיה' :
                  'تأمين في جورجيا';

  return (
    <footer className="relative bg-linear-to-b from-slate-900 to-slate-950 text-white w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>

      <div className="relative z-10" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '64px', paddingBottom: '32px' }}>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8" style={{ marginBottom: '48px' }}>
          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3" style={{ marginBottom: '20px' }}>
              <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-violet-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white leading-tight">{COMPANY.name}</span>
                <span className="text-sm text-slate-400">{tagline}</span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed" style={{ marginBottom: '24px', maxWidth: '280px' }}>
              {t.description}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <Link
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-slate-800 hover:bg-green-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </Link>
              <Link
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-11 h-11 bg-slate-800 hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </Link>
              <Link
                href={`mailto:${CONTACT.email}`}
                className="group w-11 h-11 bg-slate-800 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-purple-600/25"
                aria-label="Email"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '20px' }}>{t.navigation}</h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Insurance Plans */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '20px' }}>{t.insurancePlans}</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href={`/${locale}/insurance?category=main`} className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {dict.header.insuranceDropdown?.borderEntry || 'Border Entry'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/insurance?category=longterm`} className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {dict.header.insuranceDropdown?.fullMedical || 'Full Medical'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/auto-insurance`} className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                  {dict.header.insuranceDropdown?.autoEntry || 'Auto Entry'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ marginBottom: '20px' }}>{t.contacts}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p className="text-slate-500 text-sm" style={{ marginBottom: '4px' }}>{t.phoneWhatsapp}</p>
                <Link href={CONTACT.whatsapp} target="_blank" className="text-white hover:text-purple-400 transition-colors font-semibold">
                  {CONTACT.phone}
                </Link>
              </div>
              <div>
                <p className="text-slate-500 text-sm" style={{ marginBottom: '4px' }}>Email</p>
                <Link href={CONTACT.emailLink} className="text-white hover:text-purple-400 transition-colors font-semibold">
                  {CONTACT.email}
                </Link>
              </div>
              <div>
                <p className="text-slate-500 text-sm" style={{ marginBottom: '4px' }}>{t.workHours}</p>
                <p className="text-white font-semibold">{dict.contact.workHoursValue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {COMPANY.name}. {t.copyright}
          </p>
          <div className="flex items-center gap-6">
            <Link href={`/${locale}/privacy`} className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="text-slate-400 hover:text-white text-sm transition-colors">
              {t.terms}
            </Link>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-slate-800 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-all duration-200"
              aria-label="Scroll to top"
            >
              <svg className="w-5 h-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
