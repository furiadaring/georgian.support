"use client";

import Link from "next/link";
import { CONTACT, COMPANY, trackKeitaro } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Footer({ locale, dict }: FooterProps) {
  const t = dict.footer;
  const isRtl = isRtlLocale(locale);

  // Build legal disclaimer with highlighted company name
  const legalParts = t.legalDisclaimer?.split("{company}") || [];

  return (
    <footer className="w-full bg-[#2D1D38]" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1920px] mx-auto flex flex-col px-[20px] py-[40px] gap-[40px] md:px-[60px] lg:px-[100px] lg:pt-[80px] lg:pb-[50px] lg:gap-[60px] xl:px-[200px] 2xl:px-[310px]">

        {/* ===== Content Row ===== */}
        <div className="flex flex-col gap-[40px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">

          {/* ── Left Column: Brand ── */}
          <div className="flex flex-col lg:justify-between shrink-0 lg:w-[420px] lg:h-[343px] gap-[25px] lg:gap-[30px]">

            {/* Top group: logo + desc + buttons */}
            <div className="flex flex-col gap-[20px] w-full">

              {/* Logo */}
              <Link href={`/${locale}`} className="inline-flex items-center group" style={{ gap: 10 }}>
                {/* Icon */}
                <div
                  className="shrink-0 w-[50px] h-[50px] rounded-[16px] flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #FB2C36 0%, #E7000B 100%)",
                    boxShadow: "0px 10px 15px -3px rgba(251,44,54,0.25), 0px 4px 6px -4px rgba(251,44,54,0.25)",
                  }}
                >
                  <svg className="w-[28px] h-[28px] text-white" viewBox="0 0 32 32" fill="none">
                    <path d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5" fill="currentColor" opacity="0.9" />
                    <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                    <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
                {/* Text */}
                <div className="flex flex-col" style={{ gap: 3 }}>
                  <p className="text-[22px] font-bold leading-[1.3]">
                    <span className="text-[#FAFAFA]">Georgian</span>
                    <span className="bg-gradient-to-r from-[#FB2C36] to-[#E7000B] bg-clip-text" style={{ WebkitTextFillColor: "transparent" }}>Support</span>
                  </p>
                  <span className="text-[14px] font-semibold leading-[1.3] text-[#F4F3EE]">by Legal Residency Group</span>
                </div>
              </Link>

              {/* Description */}
              <p className="text-[14px] font-semibold lg:text-[16px] lg:font-medium leading-[1.3] text-[#ABA2A5] lg:max-w-[351px]">
                {t.description}
              </p>

              {/* WhatsApp + Telegram buttons */}
              <div className="flex flex-col lg:flex-row items-center gap-[10px] lg:gap-[20px] w-full lg:w-auto">
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackKeitaro('whatsapp')}
                  className="flex items-center justify-center bg-[#60D669] rounded-full w-full lg:w-[200px] hover:opacity-90 transition-opacity"
                  style={{ gap: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 12, paddingBottom: 12 }}
                >
                  <svg className="w-[24px] h-[24px] text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="text-[14px] font-semibold leading-[1.3] text-[#FAFAFA]">Whatsapp</span>
                </a>
                <a
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackKeitaro('telegram')}
                  className="flex items-center justify-center bg-[#2AABEE] rounded-full w-full lg:w-[200px] hover:opacity-90 transition-opacity"
                  style={{ gap: 15, paddingLeft: 15, paddingRight: 15, paddingTop: 12, paddingBottom: 12 }}
                >
                  <svg className="w-[24px] h-[24px] text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                  <span className="text-[14px] font-semibold leading-[1.3] text-[#FAFAFA]">Telegram</span>
                </a>
              </div>
            </div>

            {/* Legal disclaimer */}
            <p className="text-[12px] font-semibold leading-[1.3] text-[#ABA2A5]">
              {legalParts[0]}
              <span className="text-[#DE643B]">Legal Residency Group</span>
              {legalParts[1]}
            </p>
          </div>

          {/* ── Right Section ── */}
          <div className="flex flex-col gap-[40px] lg:flex-row shrink-0 lg:w-[640px] lg:gap-[115px]">

            {/* Nav + Insurance: side-by-side on mobile, stacked column on desktop */}
            <div className="flex flex-row justify-between lg:flex-col lg:flex-1 lg:gap-[60px]">

              {/* Navigation */}
              <div className="flex flex-col gap-[15px] lg:gap-[20px]">
                <p className="text-[16px] lg:text-[18px] font-medium leading-[1.3] text-[#ABA2A5]">{t.navigation}</p>
                <nav className="flex flex-col" style={{ gap: 10 }}>
                  <Link href={`/${locale}#advantages`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.about}
                  </Link>
                  <Link href={`/${locale}#insurance`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.insurance}
                  </Link>
                  <Link href={`/${locale}#faq`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.faq}
                  </Link>
                  <Link href={`/${locale}#contacts`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.contacts}
                  </Link>
                </nav>
              </div>

              {/* Insurance Plans */}
              <div className="flex flex-col gap-[15px] lg:gap-[20px]">
                <p className="text-[16px] lg:text-[18px] font-medium leading-[1.3] text-[#ABA2A5]">{t.insurancePlans}</p>
                <nav className="flex flex-col" style={{ gap: 10 }}>
                  <Link href={`/${locale}/insurance?category=main`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.insuranceDropdown?.borderEntry || "Travel Insurance"}
                  </Link>
                  <Link href={`/${locale}/insurance?category=longterm`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.insuranceDropdown?.fullMedical || "Medical Insurance"}
                  </Link>
                  <Link href={`/${locale}/auto-insurance`} className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] hover:text-[#DE643B] transition-colors">
                    {dict.header.insuranceDropdown?.autoEntry || "Auto Insurance"}
                  </Link>
                </nav>
              </div>
            </div>

            {/* Work Hours + Contacts: reversed on mobile (contacts first), normal on desktop */}
            <div className="flex flex-col-reverse gap-[40px] lg:flex-col lg:justify-between lg:flex-1 lg:h-[318px] lg:gap-0">

              {/* Work Hours (DOM first → visual bottom on mobile, visual top on desktop) */}
              <div className="flex flex-col gap-[15px] lg:gap-[20px]">
                <p className="text-[16px] lg:text-[18px] font-medium leading-[1.3] text-[#ABA2A5]">{t.workHours}</p>
                <div className="flex flex-col" style={{ gap: 10 }}>
                  {/* Clock + time */}
                  <div className="flex items-center" style={{ gap: 8 }}>
                    <svg className="w-[24px] h-[24px] shrink-0 text-[#F4F3EE]" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE] whitespace-nowrap">
                      {t.workHoursValue}
                    </span>
                  </div>
                  {/* Social icons row */}
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <a
                      href={CONTACT.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[40px] h-[40px] bg-[#F6F6CD] rounded-[8px] flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="WhatsApp"
                    >
                      <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="#2D1D38" />
                      </svg>
                    </a>
                    <a
                      href={CONTACT.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-[40px] h-[40px] bg-[#F6F6CD] rounded-[8px] flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Telegram"
                    >
                      <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#2D1D38" />
                      </svg>
                    </a>
                    <a
                      href={CONTACT.emailLink}
                      className="w-[40px] h-[40px] bg-[#F6F6CD] rounded-[8px] flex items-center justify-center hover:opacity-80 transition-opacity"
                      aria-label="Email"
                    >
                      <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24" fill="none">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="#2D1D38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contacts (DOM second → visual top on mobile, visual bottom on desktop) */}
              <div className="flex flex-col gap-[15px] lg:gap-[20px]">
                <p className="text-[16px] lg:text-[18px] font-medium leading-[1.3] text-[#ABA2A5]">{t.contacts}</p>
                <div className="flex flex-col" style={{ gap: 10 }}>
                  <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center hover:opacity-80 transition-opacity" style={{ gap: 8 }}>
                    <svg className="w-[24px] h-[24px] shrink-0 text-[#F4F3EE]" viewBox="0 0 24 24" fill="none">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE]">{CONTACT.phone}</span>
                  </a>
                  <a href={CONTACT.emailLink} className="flex items-center hover:opacity-80 transition-opacity" style={{ gap: 8 }}>
                    <svg className="w-[24px] h-[24px] shrink-0 text-[#F4F3EE]" viewBox="0 0 24 24" fill="none">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] text-[#F4F3EE]">{CONTACT.email}</span>
                  </a>
                  {/* Address - desktop only */}
                  <div className="hidden lg:flex items-start hover:opacity-80 transition-opacity" style={{ gap: 8 }}>
                    <svg className="w-[24px] h-[24px] shrink-0 text-[#F4F3EE] mt-[1px]" viewBox="0 0 24 24" fill="none">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span className="text-[16px] font-medium leading-[1.3] text-[#F4F3EE]" dangerouslySetInnerHTML={{ __html: dict.footer?.address || "28 Luka Asatiani street,<br />Batumi, 6000, Georgia" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="flex flex-col items-center gap-[10px] lg:flex-row lg:items-center lg:justify-between lg:gap-[20px] border-t border-[#776667] w-full pt-[30px]">
          <p className="text-[16px] font-medium leading-[1.3] text-[#DE643B] text-center lg:text-left lg:whitespace-nowrap shrink-0 lg:w-[420px]">
            © {new Date().getFullYear()} {COMPANY.name}. {t.copyright}
          </p>
          <div className="flex flex-col items-center gap-[10px] lg:flex-row lg:w-[640px] lg:shrink-0 lg:gap-[115px]">
            <span className="lg:flex-1">
              <Link
                href={`/${locale}/terms`}
                className="text-[16px] font-medium leading-[1.3] text-[#ABA2A5] hover:text-[#DE643B] transition-colors"
              >
                {t.terms}
              </Link>
            </span>
            <span className="lg:flex-1">
              <Link
                href={`/${locale}/privacy`}
                className="text-[16px] font-medium leading-[1.3] text-[#ABA2A5] hover:text-[#DE643B] transition-colors"
              >
                {t.privacy}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
