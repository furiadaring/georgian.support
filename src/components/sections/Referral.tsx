"use client";

import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface ReferralProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Referral({ locale, dict }: ReferralProps) {
  const t = dict.referral;
  const isRtl = isRtlLocale(locale);

  const plans = [
    {
      id: "optimum",
      name: "OPTIMUM",
      price: 250,
      discount: 50,
      maxReferrals: 5,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
    },
    {
      id: "premium",
      name: "PREMIUM",
      price: 300,
      discount: 100,
      maxReferrals: 3,
      color: "from-primary-blue to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-primary-blue",
      borderColor: "border-blue-200",
    },
  ];

  return (
    <section id="referral" className="relative bg-linear-to-b from-slate-50 via-white to-slate-50 py-16 lg:py-24 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[15%] w-80 h-80 bg-primary-blue/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="relative z-10" style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <div className="inline-flex items-center bg-linear-to-r from-emerald-100 to-blue-100 rounded-full" style={{ padding: '0.5rem 1.25rem', marginBottom: '1.5rem', gap: '0.5rem' }}>
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold text-emerald-700">{t.label}</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-black" style={{ marginBottom: '1.5rem' }}>
            {t.title} <span className="bg-linear-to-r from-emerald-500 to-primary-blue bg-clip-text text-transparent">{t.titleHighlight}</span>
          </h2>
          
          <p className="text-lg text-primary-grey max-w-2xl mx-auto" style={{ margin: '0 auto' }}>
            {t.description}
          </p>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: '48px' }}>
          {[
            { icon: "👥", step: "1", title: t.steps[0].title, desc: t.steps[0].description },
            { icon: "💰", step: "2", title: t.steps[1].title, desc: t.steps[1].description },
            { icon: "🎉", step: "3", title: t.steps[2].title, desc: t.steps[2].description },
          ].map((item, idx) => (
            <div key={idx} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow" style={{ padding: '1.5rem' }}>
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-linear-to-br from-emerald-500 to-primary-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
                {item.step}
              </div>
              <div className="text-3xl" style={{ marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 className="text-lg font-bold text-primary-black" style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
              <p className="text-sm text-primary-grey">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Referral Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white rounded-3xl border ${plan.borderColor} overflow-hidden`}>
              {/* Header gradient */}
              <div className={`bg-linear-to-r ${plan.color} p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-white/80 text-sm">{t.planPrice}: {plan.price} GEL</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.5rem' }}>
                {/* Discount info */}
                <div className={`${plan.bgLight} rounded-xl p-4`} style={{ marginBottom: '1.5rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                    <span className="text-primary-grey">{t.discountPerReferral}</span>
                    <span className={`text-xl font-bold ${plan.textColor}`}>{plan.discount} GEL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-grey">{t.maxReferrals}</span>
                    <span className={`text-xl font-bold ${plan.textColor}`}>{plan.maxReferrals} {t.people}</span>
                  </div>
                </div>

                {/* Progress visualization */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div className="flex items-center justify-between text-sm" style={{ marginBottom: '0.5rem' }}>
                    <span className="text-primary-grey">{t.yourDiscount}</span>
                    <span className={`font-semibold ${plan.textColor}`}>{plan.discount * plan.maxReferrals} GEL = {t.freeInsurance}</span>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: plan.maxReferrals }).map((_, i) => (
                      <div key={i} className={`flex-1 h-3 rounded-full bg-linear-to-r ${plan.color}`} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-primary-grey" style={{ marginTop: '0.25rem' }}>
                    {Array.from({ length: plan.maxReferrals }).map((_, i) => (
                      <span key={i}>{plan.discount * (i + 1)} GEL</span>
                    ))}
                  </div>
                </div>

                {/* Example */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-primary-grey">
                    <span className="font-semibold text-primary-black">{t.example}:</span> {t.exampleText.replace('{max}', String(plan.maxReferrals)).replace('{discount}', String(plan.discount * plan.maxReferrals))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center" style={{ marginTop: '48px' }}>
          <p className="text-primary-grey" style={{ marginBottom: '1rem' }}>{t.cta}</p>
          <Link
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-linear-to-r from-emerald-500 to-primary-blue text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
            style={{ padding: '1rem 2rem', gap: '0.75rem' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t.contactUs}
          </Link>

          {/* Social Share Buttons */}
          <div style={{ marginTop: '2rem' }}>
            <p className="text-sm text-primary-grey" style={{ marginBottom: '1rem' }}>{t.shareTitle}</p>
            <div className="flex items-center justify-center gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(t.shareText + ' https://visitgeorgia.online/' + locale + '#referral')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#25D366]/30"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent('https://visitgeorgia.online/' + locale + '#referral')}&text=${encodeURIComponent(t.shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#0088cc] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#0088cc]/30"
                aria-label="Share on Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://visitgeorgia.online/' + locale + '#referral')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#1877F2]/30"
                aria-label="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.shareText)}&url=${encodeURIComponent('https://visitgeorgia.online/' + locale + '#referral')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-black/30"
                aria-label="Share on X"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://visitgeorgia.online/' + locale + '#referral')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#0A66C2]/30"
                aria-label="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
