"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";
import InsuranceOrderModal from "@/components/ui/InsuranceOrderModal";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Hero({ locale, dict }: HeroProps) {
  const t = dict.hero;
  const isRtl = isRtlLocale(locale);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Features for PREMIUM plan (matching planDetails coverage: phone, emergency, doctor, hospital, outpatient)
  const features = [
    dict.insurance.coverage.support247,
    dict.insurance.coverage.emergency,
    dict.insurance.coverage.hospitalization,
    dict.insurance.coverage.outpatient
  ];

  return (
    <section className="relative min-h-screen bg-linear-to-br from-purple-800 via-violet-900 to-slate-900 overflow-hidden w-full" style={{ paddingTop: '80px' }}>
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-[15%] w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-[20%] w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="w-full" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          
          <div className="grid lg:grid-cols-2 items-center" style={{ gap: '4rem' }}>
            
            {/* Text Column */}
            <div className={`order-1 ${isRtl ? 'lg:order-2' : ''}`}>
              {/* Mobile Referral Banner - visible only on mobile */}
              <Link 
                href="#referral" 
                className="flex lg:hidden group relative overflow-hidden bg-linear-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl hover:border-amber-400/50 transition-all duration-300 cursor-pointer"
                style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="relative flex items-center justify-between w-full">
                  <div className="flex items-center" style={{ gap: '0.75rem' }}>
                    <div className="shrink-0 w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-amber-300 text-sm font-semibold">{t.referralBadge}</span>
                      <p className="text-white/70 text-xs">{t.referralTeaser}</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <svg className={`w-3.5 h-3.5 text-amber-300 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Label */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full" style={{ padding: '0.5rem 1rem', marginBottom: '2rem', gap: '0.5rem' }}>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white/90 text-sm font-medium">{t.badge}</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight" style={{ marginBottom: '1.5rem' }}>
                {t.title}
                <br />
                <span className="bg-linear-to-r from-purple-300 via-violet-200 to-white bg-clip-text text-transparent">
                  {t.titleHighlight}
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-purple-100/80 leading-relaxed max-w-md" style={{ marginBottom: '2.5rem' }}>
                {t.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row md:items-center" style={{ gap: '1rem', marginBottom: '3rem' }}>
                <Link
                  href="#insurance"
                  className="inline-flex items-center justify-center bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300 hover:shadow-xl hover:shadow-white/20 whitespace-nowrap w-full md:w-auto"
                  style={{ padding: '1rem 2rem', gap: '0.75rem' }}
                >
                  {t.cta}
                  <svg className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <div className="flex flex-row flex-1" style={{ gap: '0.5rem' }}>
                  <Link
                    href={CONTACT.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 flex-1"
                    style={{ padding: '1rem', height: '52px' }}
                    aria-label="WhatsApp"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </Link>
                  <Link
                    href={CONTACT.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#0088cc]/30 flex-1"
                    style={{ padding: '1rem', height: '52px' }}
                    aria-label="Telegram"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 border-t border-white/10" style={{ gap: '2rem', paddingTop: '2rem' }}>
                <div>
                  <div className="text-3xl font-bold text-white">5k+</div>
                  <div className="text-sm text-purple-200/60" style={{ marginTop: '0.5rem' }}>{t.clients}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-purple-200/60" style={{ marginTop: '0.5rem' }}>{t.support}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">$50K</div>
                  <div className="text-sm text-purple-200/60" style={{ marginTop: '0.5rem' }}>{t.coverage}</div>
                </div>
              </div>
            </div>

            {/* Pricing Cards Column */}
            <div className={`order-2 ${isRtl ? 'lg:order-1' : ''}`} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Referral Program Banner - Desktop only */}
              <Link 
                href="#referral" 
                className="hidden lg:block group relative overflow-hidden bg-linear-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl hover:border-amber-400/50 transition-all duration-300 cursor-pointer"
                style={{ padding: '1.25rem 1.5rem' }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: '1rem' }}>
                    {/* Gift icon */}
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center" style={{ gap: '0.5rem' }}>
                        <span className="text-amber-300 text-sm font-semibold">{t.referralBadge}</span>
                        <span className="px-2 py-0.5 bg-amber-400/20 rounded-full text-amber-200 text-xs font-medium">{t.referralNew}</span>
                      </div>
                      <p className="text-white/80 text-sm" style={{ marginTop: '0.25rem' }}>{t.referralTeaser}</p>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <svg className={`w-4 h-4 text-amber-300 transition-transform group-hover:translate-x-0.5 ${isRtl ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Featured Card - Premium */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-3xl opacity-30 blur-lg group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl" style={{ padding: '2rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <span className="text-xs font-semibold text-white bg-blue-500 rounded-full" style={{ padding: '0.5rem 1rem' }}>{t.recommend}</span>
                    <span className="text-blue-200/70 text-sm">PREMIUM</span>
                  </div>
                  
                  <div className="flex items-baseline" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="text-5xl font-bold text-white">300</span>
                    <span className="text-blue-200/70">{t.perYear}</span>
                  </div>
                  <p className="text-blue-100/60 text-sm" style={{ marginBottom: '2rem' }}>{t.forTourists}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {features.map((item, i) => (
                      <div key={i} className="flex items-center" style={{ gap: '0.75rem' }}>
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <svg className="w-3 h-3 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-white/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="block w-full text-center bg-white text-primary-blue font-semibold rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                    style={{ padding: '1rem' }}
                  >
                    {t.orderNow}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Insurance Order Modal */}
      <InsuranceOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        planName={dict.insurance.plans.premium.name}
        planPrice={300}
        planPeriod="year"
        locale={locale}
        dict={dict}
      />
    </section>
  );
}
