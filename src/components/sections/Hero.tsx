"use client";

import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

// Stat Card Component
function StatCard({ 
  icon, 
  value, 
  label, 
  shadowSide 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  shadowSide?: 'left' | 'right' | 'none';
}) {
  const shadowClass = shadowSide === 'left' 
    ? 'shadow-[-8px_8px_0px_0px_#E6CFE3]' 
    : shadowSide === 'right' 
      ? 'shadow-[8px_8px_0px_0px_#E6CFE3]' 
      : '';
  
  return (
    <div className={`bg-white/5 border border-[#E6CFE3] flex flex-col items-center justify-center px-6 py-6 lg:px-10 lg:py-9 w-full lg:w-56 ${shadowClass}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 text-[#E6CFE3]">
          {icon}
        </div>
        <div className="flex flex-col items-center gap-1 text-[#E6CFE3] text-center">
          <span className="text-3xl lg:text-5xl font-bold leading-none">{value}</span>
          <span className="text-sm lg:text-base font-medium leading-snug">{label}</span>
        </div>
      </div>
    </div>
  );
}

// Clock icon for 15min
function ClockIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" className="w-full h-full">
      <circle cx="25" cy="25" r="23" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M25 12V25L33 33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Headset icon for 24/7
function HeadsetIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" className="w-full h-full">
      <path d="M10 25C10 16.716 16.716 10 25 10C33.284 10 40 16.716 40 25V32C40 33.657 38.657 35 37 35H35C33.343 35 32 33.657 32 32V27C32 25.343 33.343 24 35 24H37.917C37.44 18.507 32.71 14 27 14H23C17.29 14 12.56 18.507 12.083 24H15C16.657 24 18 25.343 18 27V32C18 33.657 16.657 35 15 35H13C11.343 35 10 33.657 10 32V25Z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M32 35V37C32 39.209 30.209 41 28 41H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Shield icon for $50K
function ShieldIcon() {
  return (
    <svg viewBox="0 0 50 50" fill="none" className="w-full h-full">
      <path d="M25 4L8 12V24C8 34.5 15.2 44.2 25 47C34.8 44.2 42 34.5 42 24V12L25 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M18 25L23 30L33 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Hero({ locale, dict }: HeroProps) {
  const t = dict.hero;
  const isRtl = isRtlLocale(locale);

  return (
    <section className="relative min-h-svh lg:h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2126&auto=format&fit=crop')`
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Desktop Layout: Left cards + Right content */}
      <div className="relative z-10 h-full hidden lg:flex items-center px-5 lg:px-24 xl:px-48 2xl:px-72">
        <div className="flex items-center gap-24 xl:gap-36 2xl:gap-52">
          {/* Left - Stat Cards */}
          <div className="flex flex-col gap-5">
            <StatCard 
              icon={<ClockIcon />} 
              value="15мин" 
              label={t.stats?.minutesDesc || 'оформление'} 
              shadowSide="left"
            />
            <StatCard 
              icon={<HeadsetIcon />} 
              value="24/7" 
              label={t.stats?.support || 'поддержка'} 
              shadowSide="none"
            />
            <StatCard 
              icon={<ShieldIcon />} 
              value="$50K" 
              label={t.stats?.coverage || 'покрытие'} 
              shadowSide="right"
            />
          </div>

          {/* Right - Title Content */}
          <div className="flex flex-col gap-20 max-w-4xl">
            {/* Title Group */}
            <div className="flex flex-col gap-6 text-[#FAFAFA]">
              <p className="text-lg font-medium leading-snug">{t.badge}</p>
              <h1 className="text-5xl xl:text-7xl 2xl:text-8xl font-extrabold leading-none">
                {t.title}
                <br />
                {t.titleHighlight}
              </h1>
            </div>

            {/* CTA Group */}
            <div className="flex flex-col gap-5">
              <p className="text-lg font-medium leading-snug text-[#FAFAFA]">
                {t.subtitle}
              </p>
              <div className="flex items-center gap-10">
                {/* CTA Button */}
                <Link
                  href="#insurance"
                  className="group inline-flex items-center gap-5 bg-[#DE643B] rounded-full pl-8 pr-1 py-1 hover:opacity-90 transition-opacity"
                >
                  <span className="text-lg font-medium text-[#FAFAFA]">{t.cta}</span>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className={`w-6 h-6 text-white ${isRtl ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </Link>

                {/* Social Icons */}
                <div className="flex items-center gap-2.5">
                  <Link
                    href={CONTACT.whatsapp}
                    target="_blank"
                    className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </Link>
                  <Link
                    href={CONTACT.telegram}
                    target="_blank"
                    className="w-14 h-14 rounded-full bg-[#229ED9] flex items-center justify-center hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="relative z-10 min-h-svh flex flex-col lg:hidden px-5 pt-28 pb-10">
        {/* Title Content - Centered */}
        <div className="flex flex-col items-center text-center gap-5 pb-16">
          {/* Badge */}
          <p className="text-[16px] font-medium leading-[1.3] text-[#FAFAFA]">{t.badge}</p>
          
          {/* Title */}
          <h1 className="text-[42px] font-extrabold leading-[0.9] text-[#FAFAFA]">
            {t.title}
            <br />
            {t.titleHighlight}
          </h1>
          
          {/* Subtitle */}
          <p className="text-[16px] font-medium leading-[1.3] text-[#FAFAFA]">
            {t.subtitle}
          </p>
          
          {/* CTA Button */}
          <Link
            href="#insurance"
            className="inline-flex items-center gap-5 bg-[#DE643B] rounded-full pl-[30px] pr-[5px] py-[5px] hover:opacity-90 transition-opacity"
          >
            <span className="text-[18px] font-medium text-[#FAFAFA] leading-[1.3]">{t.cta}</span>
            <div className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center">
              <svg className={`w-6 h-6 text-white ${isRtl ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5">
            <Link
              href={CONTACT.whatsapp}
              target="_blank"
              className="w-[44px] h-[44px] rounded-full bg-[#25D366] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </Link>
            <Link
              href={CONTACT.telegram}
              target="_blank"
              className="w-[44px] h-[44px] rounded-full bg-[#229ED9] flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[20px]"></div>

        {/* Stat Cards - Bottom on Mobile */}
        <div className="flex flex-col gap-2.5 w-full">
            {/* Card 1 - 15min */}
            <div className="flex items-center gap-4 bg-white/5 border border-[#E6CFE3] px-5 py-4">
              <div className="w-[50px] h-[50px] rounded-full border border-[#E6CFE3] flex items-center justify-center shrink-0">
                <div className="w-6 h-6 text-[#E6CFE3]">
                  <ClockIcon />
                </div>
              </div>
              <div className="flex flex-col text-[#E6CFE3]">
                <span className="text-[34px] font-bold leading-[1.3]">15мин</span>
                <span className="text-[16px] font-medium leading-[1.3]">{t.clients || 'оформление'}</span>
              </div>
            </div>
            {/* Card 2 - 24/7 */}
            <div className="flex items-center gap-4 bg-white/5 border border-[#E6CFE3] px-5 py-4">
              <div className="w-[50px] h-[50px] rounded-full border border-[#E6CFE3] flex items-center justify-center shrink-0">
                <div className="w-6 h-6 text-[#E6CFE3]">
                  <HeadsetIcon />
                </div>
              </div>
              <div className="flex flex-col text-[#E6CFE3]">
                <span className="text-[34px] font-bold leading-[1.3]">24/7</span>
                <span className="text-[16px] font-medium leading-[1.3]">{t.support || 'поддержка'}</span>
              </div>
            </div>
            {/* Card 3 - $50K */}
            <div className="flex items-center gap-4 bg-white/5 border border-[#E6CFE3] px-5 py-4">
              <div className="w-[50px] h-[50px] rounded-full border border-[#E6CFE3] flex items-center justify-center shrink-0">
                <div className="w-6 h-6 text-[#E6CFE3]">
                  <ShieldIcon />
                </div>
              </div>
              <div className="flex flex-col text-[#E6CFE3]">
                <span className="text-[34px] font-bold leading-[1.3]">$50K</span>
                <span className="text-[16px] font-medium leading-[1.3]">{t.coverage || 'покрытие'}</span>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
