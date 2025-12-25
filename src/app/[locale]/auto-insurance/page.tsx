"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/constants";
import { getDictionary, type Locale, type Dictionary } from "@/lib/i18n";
import { useParams } from "next/navigation";

// Pricing data
const PRICING = [
  { id: "motorcycle", emoji: "🏍️", prices: [26, 46, 91, 280] },
  { id: "car", emoji: "🚗", prices: [39, 65, 117, 384], highlight: true },
  { id: "bus", emoji: "🚌", prices: [59, 98, 182, 624] },
  { id: "truck", emoji: "🚛", prices: [78, 130, 221, 793] },
  { id: "trailer", emoji: "🚚", prices: [18, 33, 52, 189] },
  { id: "agricultural", emoji: "🚜", prices: [33, 59, 91, 325] },
];

function AutoInsurancePageContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.autoInsurancePage;
  const insurancePage = dict.insurancePage;

  return (
    <div className="w-full flex flex-col">
      <Header locale={locale} dict={dict} />
      <main className="main-content w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full bg-linear-to-br from-red-600 via-red-700 to-red-800 overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute top-40 right-[15%] w-96 h-96 bg-red-300/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />
          </div>

          <div className="relative z-10" style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center flex flex-col items-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full" style={{ padding: '0.5rem 1.25rem', marginBottom: '1.5rem', gap: '0.5rem' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm font-semibold text-white">{t?.badge || "ОБЯЗАТЕЛЬНОЕ СТРАХОВАНИЕ"}</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center" style={{ marginBottom: '1.5rem' }}>
                {t?.title || "Автострахование"} <span className="text-red-200">{t?.titleHighlight || "ОСАГО"}</span>
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl text-center" style={{ marginBottom: '2rem' }}>
                {t?.subtitle || "Обязательное страхование гражданской ответственности для иностранных автомобилей при въезде в Грузию"}
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-red-600 py-3 px-8 rounded-full font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t?.ctaButton || "Оформить ОСАГО"}
                </Link>
                <a
                  href="#pricing"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white py-3 px-8 rounded-full font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  {t?.seePrices || "Смотреть тарифы"}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-white py-16">
          <div style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto" style={{ marginBottom: '16px' }}>
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-black" style={{ marginBottom: '8px' }}>
                  {insurancePage?.autoInsurance?.features?.mandatory || "Обязательно"}
                </h3>
                <p className="text-primary-grey">
                  {insurancePage?.autoInsurance?.features?.mandatoryDesc || "Требуется для всех иностранных автомобилей при въезде в Грузию"}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto" style={{ marginBottom: '16px' }}>
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-black" style={{ marginBottom: '8px' }}>
                  {insurancePage?.autoInsurance?.features?.coverage || "Покрытие ущерба"}
                </h3>
                <p className="text-primary-grey">
                  {insurancePage?.autoInsurance?.features?.coverageDesc || "До 300,000 GEL за ущерб здоровью, до 50,000 GEL за имущество"}
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto" style={{ marginBottom: '16px' }}>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-primary-black" style={{ marginBottom: '8px' }}>
                  {insurancePage?.autoInsurance?.features?.periods || "Гибкие периоды"}
                </h3>
                <p className="text-primary-grey">
                  {insurancePage?.autoInsurance?.features?.periodsDesc || "15 дней, 30 дней, 90 дней или 1 год"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full bg-linear-to-b from-slate-50 to-white py-16 lg:py-24">
          <div style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                {t?.pricingTitle || "Тарифы по категориям транспорта"}
              </h2>
              <p className="text-lg text-primary-grey max-w-2xl mx-auto">
                {t?.pricingSubtitle || "Выберите период страхования в зависимости от длительности вашей поездки"}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="bg-linear-to-r from-red-600 to-red-500 p-6">
                <h3 className="text-xl font-bold text-white text-center">
                  {insurancePage?.autoInsurance?.pricingTitle || "Тарифы ОСАГО по категориям транспорта"}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-primary-black">{insurancePage?.autoInsurance?.table?.vehicle || "Транспорт"}</th>
                      <th className="text-center p-4 font-semibold text-primary-black">15 {insurancePage?.autoInsurance?.table?.days || "дней"}</th>
                      <th className="text-center p-4 font-semibold text-primary-black">30 {insurancePage?.autoInsurance?.table?.days || "дней"}</th>
                      <th className="text-center p-4 font-semibold text-primary-black">90 {insurancePage?.autoInsurance?.table?.days || "дней"}</th>
                      <th className="text-center p-4 font-semibold text-primary-black">1 {insurancePage?.autoInsurance?.table?.year || "год"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICING.map((vehicle, index) => (
                      <tr key={vehicle.id} className={`border-b border-gray-100 hover:bg-gray-50 ${vehicle.highlight ? 'bg-red-50/50' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{vehicle.emoji}</span>
                            <div>
                              <p className="font-medium text-primary-black">
                                {insurancePage?.autoInsurance?.vehicles?.[vehicle.id as keyof typeof insurancePage.autoInsurance.vehicles] || vehicle.id}
                              </p>
                              <p className="text-xs text-primary-grey">
                                {insurancePage?.autoInsurance?.vehicles?.[`${vehicle.id}Desc` as keyof typeof insurancePage.autoInsurance.vehicles] || ""}
                              </p>
                            </div>
                          </div>
                        </td>
                        {vehicle.prices.map((price, i) => (
                          <td key={i} className={`text-center p-4 font-semibold ${vehicle.highlight ? 'text-red-600' : 'text-primary-black'}`}>
                            {price} ₾
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Coverage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: '48px' }}>
              <div className="bg-white rounded-2xl border border-green-200 p-6 shadow-sm">
                <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-primary-black">{insurancePage?.autoInsurance?.limits?.health || "Здоровье и жизнь"}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-grey">{insurancePage?.autoInsurance?.limits?.healthPerPerson || "На одного пострадавшего"}</span>
                    <span className="font-bold text-green-600 text-lg">30,000 ₾</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-grey">{insurancePage?.autoInsurance?.limits?.healthTotal || "Общий лимит на случай"}</span>
                    <span className="font-bold text-green-600 text-lg">300,000 ₾</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm">
                <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-primary-black">{insurancePage?.autoInsurance?.limits?.property || "Имущество"}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-grey">{insurancePage?.autoInsurance?.limits?.propertyPerPerson || "На одного пострадавшего"}</span>
                    <span className="font-bold text-blue-600 text-lg">25,000 ₾</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-grey">{insurancePage?.autoInsurance?.limits?.propertyTotal || "Общий лимит на случай"}</span>
                    <span className="font-bold text-blue-600 text-lg">50,000 ₾</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full bg-white py-16 lg:py-24">
          <div style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center" style={{ marginBottom: '48px' }}>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                {t?.faqTitle || "Часто задаваемые вопросы"}
              </h2>
              <p className="text-lg text-primary-grey">
                {t?.faqSubtitle || "Ответы на популярные вопросы об автостраховании в Грузии"}
              </p>
            </div>

            <div className="space-y-4">
              {(t?.faq || [
                { q: "Обязательно ли оформлять ОСАГО при въезде в Грузию?", a: "Да, страхование гражданской ответственности обязательно для всех иностранных транспортных средств, въезжающих на территорию Грузии." },
                { q: "Где можно оформить полис ОСАГО?", a: "Полис можно оформить на границе или заранее онлайн. Мы поможем оформить страховку быстро и без очередей." },
                { q: "Что покрывает страховка ОСАГО?", a: "Страховка покрывает ущерб, причинённый третьим лицам: до 300,000 GEL за вред здоровью и до 50,000 GEL за имущественный ущерб." },
                { q: "На какой срок можно оформить страховку?", a: "Доступны периоды: 15 дней, 30 дней, 90 дней или 1 год. Выберите в зависимости от длительности поездки." },
                { q: "Что будет если не оформить ОСАГО?", a: "Без действующего полиса ОСАГО въезд в Грузию на автомобиле невозможен. На границе вас развернут." },
              ]).map((item: { q: string; a: string }, index: number) => (
                <details key={index} className="group bg-slate-50 rounded-2xl border border-gray-200 overflow-hidden">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-primary-black pr-4">{item.q}</span>
                    <svg className="w-5 h-5 text-primary-grey transition-transform duration-200 group-open:rotate-180 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-primary-grey">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full bg-linear-to-br from-red-600 via-red-700 to-red-800 py-16 lg:py-24">
          <div style={{ maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '1rem' }}>
                {t?.contactTitle || "Готовы оформить страховку?"}
              </h2>
              <p className="text-xl text-white/90" style={{ marginBottom: '2rem' }}>
                {t?.contactSubtitle || "Свяжитесь с нами и получите полис за несколько минут"}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4" style={{ marginBottom: '3rem' }}>
                <Link
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white text-red-600 py-4 px-8 rounded-2xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </Link>
                <Link
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm text-white py-4 px-8 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  Telegram
                </Link>
              </div>

              <div className="flex justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-flex items-center gap-3 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${CONTACT.email}`} className="hover:underline">{CONTACT.email}</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}

export default function AutoInsurancePage() {
  const params = useParams();
  const locale = (params.locale as string) as Locale;
  const dict = getDictionary(locale);

  return <AutoInsurancePageContent locale={locale} dict={dict} />;
}
