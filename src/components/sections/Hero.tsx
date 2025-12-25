"use client";

import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Hero({ locale, dict }: HeroProps) {
  const t = dict.hero;
  const isRtl = isRtlLocale(locale);

  return (
    <section className="relative min-h-[100svh] w-full bg-white overflow-hidden">
      {/* Subtle gradient blobs - Georgian flag red */}
      <div className="absolute -top-[20%] -right-[30%] md:-top-[40%] md:-right-[20%] w-[100vw] md:w-[80vw] h-[100vw] md:h-[80vw] rounded-full bg-gradient-to-br from-red-100 via-red-50 to-red-100 opacity-70 blur-[80px] md:blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
      <div className="absolute -bottom-[10%] -left-[30%] md:-bottom-[30%] md:-left-[20%] w-[80vw] md:w-[60vw] h-[80vw] md:h-[60vw] rounded-full bg-gradient-to-tr from-red-50 via-red-100 to-red-50 opacity-60 blur-[60px] md:blur-[100px] animate-[pulse_10s_ease-in-out_infinite_1s]" />
      
      {/* Floating particles - Georgian red */}
      <div className="absolute top-1/4 left-1/5 w-2 h-2 bg-red-500 rounded-full animate-[float_6s_ease-in-out_infinite] opacity-40" />
      <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-red-600 rounded-full animate-[float_8s_ease-in-out_infinite_1s] opacity-30" />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-red-400 rounded-full animate-[float_7s_ease-in-out_infinite_2s] opacity-40" />
      <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-red-500 rounded-full animate-[float_5s_ease-in-out_infinite_0.5s] opacity-50" />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-red-400 rounded-full animate-[float_9s_ease-in-out_infinite_3s] opacity-30" />

      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex flex-col justify-center items-center text-center px-6 py-32">
        
        {/* Animated badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 backdrop-blur-sm border border-red-200 rounded-full px-4 py-2 mb-8 animate-[fadeInUp_0.6s_ease-out]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="text-zinc-600 text-sm">{t.badge}</span>
        </div>

        {/* Oversized headline with stagger animation */}
        <h1 className="text-[11vw] md:text-[9vw] lg:text-[7vw] font-black leading-[1.1] tracking-tight text-zinc-900">
          <span className="block animate-[fadeInUp_0.8s_ease-out]">{t.title}</span>
          <span className="block mt-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease-out_0.2s_both] bg-[length:200%_auto] hover:animate-[gradient_3s_linear_infinite]">
            {t.titleHighlight}
          </span>
        </h1>

        {/* Spacer */}
        <div className="h-8 md:h-12" />

        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-zinc-500 max-w-3xl font-light animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
          {t.subtitle}
        </p>

        {/* Spacer */}
        <div className="h-12 md:h-16" />

        {/* CTA Buttons with hover glow */}
        <div className="flex flex-wrap justify-center gap-4 animate-[fadeInUp_0.8s_ease-out_0.6s_both]">
          <Link
            href="#insurance"
            className="group relative px-8 py-4 bg-red-600 text-white font-bold text-base rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.cta}
              <svg className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <Link
            href={CONTACT.whatsapp}
            target="_blank"
            className="group px-6 py-4 bg-zinc-100 backdrop-blur-sm text-zinc-800 font-semibold text-base rounded-full border border-zinc-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </Link>
          
          <Link
            href={CONTACT.telegram}
            target="_blank"
            className="group px-6 py-4 bg-zinc-100 backdrop-blur-sm text-zinc-800 font-semibold text-base rounded-full border border-zinc-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </Link>
        </div>

        {/* Spacer */}
        <div className="h-12 md:h-16" />

        {/* Bento Grid with stagger */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Coverage */}
          <div className="group relative bg-white backdrop-blur-xl rounded-2xl p-6 border border-zinc-200 shadow-lg hover:border-red-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] animate-[fadeInUp_0.8s_ease-out_0.8s_both]">
            <div className="text-5xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
              $50K
            </div>
            <div className="text-zinc-600 text-base font-medium">{t.coverage}</div>
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          {/* Card 2 - Support */}
          <div className="group relative bg-white backdrop-blur-xl rounded-2xl p-6 border border-zinc-200 shadow-lg hover:border-red-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] animate-[fadeInUp_0.8s_ease-out_1s_both]">
            <div className="text-5xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
              24/7
            </div>
            <div className="text-zinc-600 text-base font-medium">{t.support}</div>
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>

          {/* Card 3 - Clients */}
          <div className="group relative bg-white backdrop-blur-xl rounded-2xl p-6 border border-zinc-200 shadow-lg hover:border-red-300 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] animate-[fadeInUp_0.8s_ease-out_1.2s_both]">
            <div className="text-5xl font-black bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300">
              5K+
            </div>
            <div className="text-zinc-600 text-base font-medium">{t.clients}</div>
            <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-zinc-300 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-red-500 rounded-full animate-[scrollDown_2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
