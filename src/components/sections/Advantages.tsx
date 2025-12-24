"use client";

import { type Locale, type Dictionary } from "@/lib/i18n";

interface AdvantagesProps {
  locale: Locale;
  dict: Dictionary;
}

const icons = [
  <svg key="fast" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>,
  <svg key="coverage" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>,
  <svg key="support" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>,
  <svg key="payment" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>,
];

const iconColors = ["bg-purple-600", "bg-emerald-500", "bg-violet-500", "bg-fuchsia-500"];
const hoverColors = ["hover:bg-purple-600", "hover:bg-emerald-500", "hover:bg-violet-500", "hover:bg-fuchsia-500"];
const statColors = ["text-purple-600", "text-emerald-500", "text-violet-500", "text-fuchsia-500"];

export default function Advantages({ locale, dict }: AdvantagesProps) {
  const t = dict.advantages;
  const items = t.items;
  
  const stats = [
    { value: "5000+", label: locale === 'ru' ? "Довольных клиентов" : locale === 'en' ? "Happy clients" : locale === 'ka' ? "კმაყოფილი კლიენტი" : locale === 'uk' ? "Задоволених клієнтів" : locale === 'tr' ? "Mutlu müşteri" : locale === 'he' ? "לקוחות מרוצים" : "عملاء سعداء" },
    { value: "24/7", label: t.items[2]?.title || "Support" },
    { value: "15", label: locale === 'ru' ? "Минут на оформление" : locale === 'en' ? "Minutes to process" : locale === 'ka' ? "წუთი გაფორმებისთვის" : locale === 'uk' ? "Хвилин на оформлення" : locale === 'tr' ? "Dakika işlem süresi" : locale === 'he' ? "דקות לטיפול" : "دقائق للمعالجة" },
    { value: "98%", label: locale === 'ru' ? "Одобренных выплат" : locale === 'en' ? "Approved claims" : locale === 'ka' ? "დამტკიცებული გადახდები" : locale === 'uk' ? "Схвалених виплат" : locale === 'tr' ? "Onaylanan talepler" : locale === 'he' ? "תביעות מאושרות" : "مطالبات معتمدة" },
  ];

  return (
    <section id="advantages" aria-labelledby="advantages-heading" className="bg-white py-16 lg:py-24 w-full">
      <div style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p className="text-purple-600 text-xs font-medium tracking-[0.2em] uppercase" style={{ margin: '0 0 20px 0' }}>{t.label}</p>
          <h2 id="advantages-heading" className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-black" style={{ margin: '0 0 20px 0' }}>
            {t.title} <span className="text-purple-600">{t.titleHighlight}</span>
          </h2>
          <p className="text-base text-primary-grey" style={{ margin: '0 auto', maxWidth: '600px' }}>
            {t.description}
          </p>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-2xl border border-gray-200 ${hoverColors[idx]} hover:border-transparent transition-all duration-300 flex flex-col overflow-hidden`}
            >
              {/* Icon Row with colored bar */}
              <div className="relative p-6 pb-0" style={{ marginBottom: '20px' }}>
                <div className={`absolute left-0 right-0 h-6 ${iconColors[idx]} group-hover:bg-white/20 transition-colors duration-300`} style={{ top: '32px' }} />
                <div className={`relative w-12 h-12 ${iconColors[idx]} group-hover:bg-white/20 rounded-xl flex items-center justify-center transition-colors duration-300 z-10`}>
                  <div className="text-white">
                    {icons[idx]}
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-base font-bold text-primary-black group-hover:text-white transition-colors duration-300 px-6" style={{ marginBottom: '8px' }}>
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-primary-grey group-hover:text-white/90 leading-relaxed grow transition-colors duration-300 px-6" style={{ marginBottom: '24px' }}>
                {item.description}
              </p>

              {/* Stat */}
              <div className="mt-auto mx-6 mb-6 text-center">
                <div className="border-t border-gray-200 group-hover:border-white/20 transition-colors duration-300" style={{ marginBottom: '16px' }} />
                <div className={`text-2xl lg:text-3xl font-bold ${statColors[idx]} group-hover:text-white transition-colors duration-300`}>{stats[idx].value}</div>
                <div className="text-sm text-primary-grey group-hover:text-white/80 transition-colors duration-300">{stats[idx].label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
