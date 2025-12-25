"use client";

import Link from "next/link";
import { CONTACT, COMPANY } from "@/lib/constants";
import { type Locale, type Dictionary } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const t = dict.footer;

  return (
    <footer className="relative overflow-hidden" style={{ background: '#fafafa' }}>
      {/* Red accent strip at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #ef4444, #dc2626, #ef4444)' }} />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className="relative">
        {/* Main Content */}
        <div style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px', paddingTop: '64px', paddingBottom: '32px' }}>
          
          {/* Top Section - Brand & CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginBottom: '64px' }} className="lg:!flex-row lg:!items-end lg:!justify-between">
            <div style={{ maxWidth: '400px' }}>
              {/* Logo */}
              <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/25 group-hover:shadow-red-500/40 transition-shadow">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 32 32" fill="none">
                    <path 
                      d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                    <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <span className="text-2xl font-bold text-zinc-800">Georgian</span>
                  <span className="text-2xl font-bold text-red-500">Support</span>
                </div>
              </Link>
              
              <p className="text-zinc-600 text-base leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-sky-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e4e4e7, transparent)', marginBottom: '48px' }} />

          {/* Links Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginBottom: '48px' }} className="!grid-cols-2 md:!grid-cols-4">
            {/* Navigation */}
            <div>
              <h4 className="text-zinc-800 font-semibold mb-4">{t.navigation}</h4>
              <nav className="flex flex-col gap-3">
                <Link href={`/${locale}#advantages`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.about}
                </Link>
                <Link href={`/${locale}#insurance`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.insurance}
                </Link>
                <Link href={`/${locale}#faq`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.faq}
                </Link>
                <Link href={`/${locale}#contacts`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.contacts}
                </Link>
              </nav>
            </div>

            {/* Insurance */}
            <div>
              <h4 className="text-zinc-800 font-semibold mb-4">{t.insurancePlans}</h4>
              <nav className="flex flex-col gap-3">
                <Link href={`/${locale}/insurance?category=main`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.insuranceDropdown?.borderEntry || 'Border Entry'}
                </Link>
                <Link href={`/${locale}/insurance?category=longterm`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.insuranceDropdown?.fullMedical || 'Full Medical'}
                </Link>
                <Link href={`/${locale}/auto-insurance`} className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {dict.header.insuranceDropdown?.autoEntry || 'Auto Entry'}
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-zinc-800 font-semibold mb-4">{t.contacts}</h4>
              <div className="flex flex-col gap-3">
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-500 transition-colors text-sm">
                  {CONTACT.phone}
                </a>
                <a href={CONTACT.emailLink} className="text-zinc-500 hover:text-red-500 transition-colors text-sm break-all">
                  {CONTACT.email}
                </a>
              </div>
            </div>

            {/* Work Hours */}
            <div>
              <h4 className="text-zinc-800 font-semibold mb-4">{t.workHours}</h4>
              <p className="text-zinc-500 text-sm">{dict.contact?.workHoursValue || '24/7'}</p>
              <div className="flex gap-2 mt-4">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-200 hover:bg-green-500 flex items-center justify-center transition-all group"
                  aria-label="WhatsApp"
                >
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-zinc-200 hover:bg-sky-500 flex items-center justify-center transition-all group"
                  aria-label="Telegram"
                >
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </a>
                <a
                  href={CONTACT.emailLink}
                  className="w-9 h-9 rounded-lg bg-zinc-200 hover:bg-red-500 flex items-center justify-center transition-all group"
                  aria-label="Email"
                >
                  <svg className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e4e4e7, transparent)', marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }} className="sm:!flex-row">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} {COMPANY.name}. {t.copyright}
            </p>
            
            <div className="flex items-center gap-6">
              <Link 
                href={`/${locale}/privacy`} 
                className="text-zinc-500 hover:text-red-500 text-sm transition-colors"
              >
                {t.privacy}
              </Link>
              <Link 
                href={`/${locale}/terms`} 
                className="text-zinc-500 hover:text-red-500 text-sm transition-colors"
              >
                {t.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
