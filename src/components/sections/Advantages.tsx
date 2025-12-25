"use client";

import { type Locale, type Dictionary } from "@/lib/i18n";

interface AdvantagesProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Advantages({ locale, dict }: AdvantagesProps) {
  const t = dict.advantages;
  const items = t.items;

  const cardIcons = [
    // Fast Processing - Clock
    <svg key="clock" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>,
    // Wide Coverage - Shield
    <svg key="shield" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>,
    // 24/7 Support - Headphones
    <svg key="support" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>,
    // Direct Billing - Credit Card
    <svg key="billing" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>,
  ];

  const stats = [
    { value: "15", suffix: locale === 'ru' ? "мин" : locale === 'en' ? "min" : locale === 'ka' ? "წთ" : locale === 'uk' ? "хв" : locale === 'tr' ? "dk" : locale === 'he' ? "דק׳" : "د" },
    { value: "$50K", suffix: "" },
    { value: "24/7", suffix: "" },
    { value: "98%", suffix: "" },
  ];

  return (
    <section id="advantages" aria-labelledby="advantages-heading" className="relative bg-white py-20 lg:py-28 w-full overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '60px' }}>
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5" style={{ marginBottom: '24px' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-red-600 text-xs font-semibold tracking-wider uppercase">{t.label}</span>
          </div>
          
          {/* Title */}
          <h2 id="advantages-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900" style={{ marginBottom: '20px' }}>
            {t.title}{" "}
            <span className="text-red-600">{t.titleHighlight}</span>
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg text-zinc-500 max-w-xl text-center leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Cards - 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-100 hover:border-red-200 transition-all duration-300 hover:shadow-xl hover:shadow-red-100/50"
              style={{ padding: '28px 28px 32px 28px' }}
            >
              {/* Top row: Icon + Stat */}
              <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                  {cardIcons[idx]}
                </div>
                
                {/* Stat */}
                <div className="text-right">
                  <div className="text-2xl lg:text-3xl font-bold text-red-600">
                    {stats[idx]?.value}
                    {stats[idx]?.suffix && <span className="text-lg text-red-400 ml-1">{stats[idx].suffix}</span>}
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-lg lg:text-xl font-bold text-zinc-900" style={{ marginBottom: '10px' }}>
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm lg:text-base text-zinc-500 leading-relaxed">
                {item.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-red-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
            </div>
          ))}
        </div>

        {/* Bottom highlight strip */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-12" style={{ marginTop: '50px' }}>
          {[
            { value: "5000+", label: locale === 'ru' ? "Клиентов" : locale === 'en' ? "Clients" : locale === 'ka' ? "კლიენტი" : locale === 'uk' ? "Клієнтів" : locale === 'tr' ? "Müşteri" : locale === 'he' ? "לקוחות" : "عميل" },
            { value: "7", label: locale === 'ru' ? "Языков" : locale === 'en' ? "Languages" : locale === 'ka' ? "ენა" : locale === 'uk' ? "Мов" : locale === 'tr' ? "Dil" : locale === 'he' ? "שפות" : "لغات" },
            { value: "3+", label: locale === 'ru' ? "Года опыта" : locale === 'en' ? "Years" : locale === 'ka' ? "წელი" : locale === 'uk' ? "Роки" : locale === 'tr' ? "Yıl" : locale === 'he' ? "שנים" : "سنوات" },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-2xl lg:text-3xl font-bold text-zinc-900">{stat.value}</span>
              <span className="text-sm text-zinc-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
