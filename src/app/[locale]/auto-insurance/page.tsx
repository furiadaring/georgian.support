"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/constants";
import { getDictionary, type Locale, type Dictionary } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";
import { getAttribution } from "@/lib/attribution";

// Pricing data (only prices - names/descriptions come from translations)
const PRICING = [
  { id: "motorcycle", prices: [26, 46, 91, 280] },
  { id: "car", prices: [39, 65, 117, 384], highlight: true },
  { id: "bus", prices: [59, 98, 182, 624] },
  { id: "truck", prices: [78, 130, 221, 793] },
  { id: "trailer", prices: [18, 33, 52, 189] },
  { id: "agricultural", prices: [33, 59, 91, 325] },
];

function AutoInsurancePageContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.autoInsurancePage;
  const insurancePage = dict.insurancePage;
  const autoIns = insurancePage.autoInsurance;
  const vehicles = autoIns.vehicles;
  const limits = autoIns.limits;
  const table = autoIns.table;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Get vehicle name/description from translations
  const getVehicleName = (id: string) => vehicles[id as keyof typeof vehicles] || id;
  const getVehicleDesc = (id: string) => vehicles[`${id}Desc` as keyof typeof vehicles] || '';

  // Period column headers
  const periodHeaders = [`15 ${table.days}`, `30 ${table.days}`, `90 ${table.days}`, `1 ${table.year}`];

  // Track lead and open link - Hybrid approach: Keitaro SDK + our database
  const trackAndOpenLink = useCallback(async (url: string, channel: 'whatsapp' | 'telegram') => {
    // 1. Official Keitaro SDK (reliable, waits for SDK ready)
    if (typeof window !== 'undefined' && (window as { KTracking?: { ready: (fn: () => void) => void; reportConversion: (p: number, s: string) => void } }).KTracking) {
      (window as { KTracking: { ready: (fn: () => void) => void; reportConversion: (p: number, s: string) => void } }).KTracking.ready(() => {
        (window as { KTracking: { reportConversion: (p: number, s: string) => void } }).KTracking.reportConversion(0, channel);
      });
    }

    // 2. Save to our database for CRM
    try {
      const attr = getAttribution();
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type: channel,
          plan_interest: 'Auto Insurance (OSAGO)',
          source_domain: typeof window !== 'undefined' ? window.location.hostname : '',
          subid: attr.subid || '',
          click_id: attr.click_id || '',
          ad_source: attr.ad_source || '',
          keyword: attr.keyword || '',
          utm_source: attr.utm_source || '',
          utm_medium: attr.utm_medium || '',
          utm_campaign: attr.utm_campaign || '',
          utm_term: attr.utm_term || '',
          utm_content: attr.utm_content || '',
        }),
      }).catch(() => {});
    } catch (e) {
      console.error('Lead tracking error:', e);
    }
    window.open(url, '_blank');
  }, []);

  return (
    <div className="w-full flex flex-col" style={{ backgroundColor: '#FAFAFA' }}>
      <Header locale={locale} dict={dict} darkText={true} />
      <main className="main-content w-full flex flex-col items-center">
        {/* Hero Section with Breadcrumb */}
        <section className="w-full" style={{ backgroundColor: '#F4F3EE' }}>
          <div className="px-5 lg:px-[310px] pt-[100px] lg:pt-[130px] pb-[40px] lg:pb-[50px]" style={{ maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}>
            {/* Breadcrumb */}
            <div className="font-medium mb-5 lg:mb-10">
              <span className="text-[14px] lg:text-[16px] text-[#ABA2A5]" style={{ lineHeight: '1.3' }}>
                <Link href={`/${locale}`} className="hover:opacity-80 transition-opacity">
                  {dict.common?.home || "Home"}
                </Link>
              </span>
              <span className="text-[14px] lg:text-[16px] text-[#ABA2A5]" style={{ lineHeight: '1.3' }}> / </span>
              <span className="text-[14px] lg:text-[16px] text-[#ABA2A5]" style={{ lineHeight: '1.3' }}>
                <Link href={`/${locale}/insurance`} className="hover:opacity-80 transition-opacity">
                  {dict.header?.insurance || "Страховки"}
                </Link>
              </span>
              <span className="text-[14px] lg:text-[16px] text-[#2D1D38]" style={{ lineHeight: '1.3' }}> / {dict.header?.insuranceDropdown?.autoEntry || "Автостраховка"}</span>
            </div>

            {/* Title Section - Centered */}
            <div className="flex flex-col items-center gap-4 lg:gap-5 w-full">
              {/* Small label */}
              <p 
                className="font-medium text-center text-[16px] lg:text-[18px] text-[#ABA2A5]"
                style={{ lineHeight: '1.3' }}
              >
                {t?.badge || "MANDATORY INSURANCE"}
              </p>
              
              {/* Main title */}
              <h1 
                className="font-bold text-center text-[34px] lg:text-[55px] text-[#2D1D38] leading-[1.3] lg:leading-[0.9]"
              >
                {t?.title || "Auto Insurance"} <span className="text-[#DE643B]">{t?.titleHighlight || "MTPL"}</span>
              </h1>
              
              {/* Description */}
              <p 
                className="font-medium text-center text-[14px] lg:text-[16px] text-[#776667]"
                style={{ lineHeight: '1.3', maxWidth: '500px' }}
              >
                {t?.subtitle || "Обязательное страхование гражданской ответственности для иностранных автомобилей при въезде в Грузию"}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-5 w-full lg:w-auto">
                <button
                  onClick={() => trackAndOpenLink(CONTACT.whatsapp, 'whatsapp')}
                  className="inline-flex items-center justify-center gap-[5px] font-medium transition-all hover:opacity-90 w-full lg:w-[230px] cursor-pointer border-none"
                  style={{ 
                    backgroundColor: '#60D669', 
                    color: '#FAFAFA', 
                    padding: '12px 15px',
                    borderRadius: '1000px',
                    fontSize: '16px'
                  }}
                >
                  <svg className="w-[30px] h-[30px]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {t?.ctaButton || "Get MTPL"}
                </button>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center gap-[5px] font-medium transition-all hover:opacity-90 w-full lg:w-[230px]"
                  style={{ 
                    backgroundColor: '#DE643B', 
                    color: '#FAFAFA', 
                    padding: '12px 8px 12px 15px',
                    borderRadius: '1000px',
                    fontSize: '16px'
                  }}
                >
                  {t?.seePrices || "See Prices"}
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Conditions Section */}
        <section className="w-full bg-[#FAFAFA] py-10 lg:py-20">
          <div className="px-5 lg:px-[310px]" style={{ maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="flex flex-col lg:flex-row gap-5">
              {/* Card 1 - Обязательно (Yellow) */}
              <div 
                className="flex flex-col gap-6 lg:gap-[35px] p-6 lg:p-[35px_40px] w-full lg:w-[420px]"
                style={{ backgroundColor: '#F6F6CD' }}
              >
                <h3 
                  className="font-bold text-[24px] lg:text-[34px] text-[#2D1D38]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.mandatory || "Обязательно"}
                </h3>
                <p 
                  className="font-medium text-[14px] lg:text-[16px] text-[#2D1D38]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.mandatoryDesc || "Требуется для всех иностранных автомобилей при въезде в Грузию"}
                </p>
              </div>
              
              {/* Card 2 - Покрытие ущерба (Purple/Main) */}
              <div 
                className="flex flex-col gap-6 lg:gap-[35px] p-6 lg:p-[35px_40px] w-full lg:w-[420px]"
                style={{ backgroundColor: '#2D1D38' }}
              >
                <h3 
                  className="font-bold text-[24px] lg:text-[34px] text-[#FAFAFA]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.coverage || "Покрытие ущерба"}
                </h3>
                <p 
                  className="font-medium text-[14px] lg:text-[16px] text-[#FAFAFA]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.coverageDesc || "До 300,000 GEL за ущерб здоровью, до 50,000 GEL за имущество"}
                </p>
              </div>
              
              {/* Card 3 - Гибкие периоды (Pink) */}
              <div 
                className="flex flex-col gap-6 lg:gap-[35px] p-6 lg:p-[35px_40px] w-full lg:w-[420px]"
                style={{ backgroundColor: '#E6CFE3' }}
              >
                <h3 
                  className="font-bold text-[24px] lg:text-[34px] text-[#2D1D38]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.periods || "Гибкие периоды"}
                </h3>
                <p 
                  className="font-medium text-[14px] lg:text-[16px] text-[#2D1D38]"
                  style={{ lineHeight: '1.3' }}
                >
                  {insurancePage?.autoInsurance?.features?.periodsDesc || "15 дней, 30 дней, 90 дней или 1 год"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section - Pricing + Coverage Limits */}
        <section id="pricing" className="w-full bg-[#FAFAFA] py-10 lg:py-20">
          <div className="px-5 lg:px-[310px]" style={{ maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}>
            {/* Section Title */}
            <div className="mb-8 lg:mb-10">
              <h2 
                className="font-bold text-[34px] lg:text-[55px] text-[#2D1D38] leading-[1.3] lg:leading-[0.9] mb-4 lg:mb-5"
              >
                <span className="text-[#DE643B]">{t?.pricingTitle || "Rates by Vehicle Category"}</span>
              </h2>
              <p 
                className="font-medium text-[14px] lg:text-[16px] text-[#ABA2A5]"
                style={{ lineHeight: '1.3', maxWidth: '406px' }}
              >
                {t?.pricingSubtitle || "Выберите период страхования в зависимости от длительности вашей поездки"}
              </p>
            </div>

            {/* Table Section */}
            <div className="mb-8 lg:mb-10">
              {/* Table Subtitle */}
              <h3 
                className="font-bold text-[18px] lg:text-[22px] text-[#2D1D38] mb-4 lg:mb-5"
                style={{ lineHeight: '1.3' }}
              >
                {autoIns.pricingTitle}
              </h3>

              {/* Mobile: Category Cards */}
              <div className="flex flex-col gap-4 lg:hidden">
                {PRICING.map((vehicle) => (
                  <div 
                    key={vehicle.id}
                    className="border border-[#E5E5E5] bg-white"
                  >
                    {/* Category Header */}
                    <div className="px-4 py-3 border-b border-[#E5E5E5]">
                      <div 
                        className="font-medium text-[16px]"
                        style={{ color: vehicle.highlight ? '#DE643B' : '#2D1D38', lineHeight: '1.3' }}
                      >
                        {getVehicleName(vehicle.id)}
                      </div>
                      <div className="font-normal text-[14px] text-[#ABA2A5]" style={{ lineHeight: '1.3' }}>
                        {getVehicleDesc(vehicle.id)}
                      </div>
                    </div>
                    {/* Price Rows */}
                    <div className="flex flex-col">
                      {periodHeaders.map((period, i) => (
                        <div 
                          key={period}
                          className={`flex items-center justify-between px-4 py-3 ${i < 3 ? 'border-b border-[#F4EFF3]' : ''}`}
                        >
                          <span className="font-normal text-[14px] text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                            {period}
                          </span>
                          <span 
                            className="font-medium text-[14px]"
                            style={{ color: vehicle.highlight ? '#DE643B' : '#2D1D38', lineHeight: '1.3' }}
                          >
                            {vehicle.prices[i]} GEL
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop: Pricing Table */}
              <div className="hidden lg:block">
                <div className="w-[1300px]">
                  {/* Table Header */}
                  <div 
                    className="flex items-center gap-5 bg-[#F4EFF3] px-[15px] py-5"
                  >
                    <div className="font-medium text-[18px] text-[#2D1D38] w-[405px]" style={{ lineHeight: '1.3' }}>
                      {table.vehicle}
                    </div>
                    {periodHeaders.map((period) => (
                      <div key={period} className="font-medium text-[18px] text-[#2D1D38] w-[200px]" style={{ lineHeight: '1.3' }}>
                        {period}
                      </div>
                    ))}
                  </div>

                  {/* Table Rows */}
                  {PRICING.map((vehicle) => (
                    <div 
                      key={vehicle.id}
                      className="flex items-center gap-5 bg-[#FAFAFA] px-[15px] py-5 border-b border-[#F4EFF3]"
                    >
                      <div className="w-[405px]">
                        <div 
                          className="font-medium text-[18px]" 
                          style={{ 
                            color: vehicle.highlight ? '#DE643B' : '#2D1D38', 
                            lineHeight: '1.3' 
                          }}
                        >
                          {getVehicleName(vehicle.id)}
                        </div>
                        <div className="font-semibold text-[14px] text-[#ABA2A5]" style={{ lineHeight: '1.3' }}>
                          {getVehicleDesc(vehicle.id)}
                        </div>
                      </div>
                      {vehicle.prices.map((price, i) => (
                        <div 
                          key={i} 
                          className="font-medium text-[18px] w-[200px]"
                          style={{ 
                            color: vehicle.highlight ? '#DE643B' : '#2D1D38', 
                            lineHeight: '1.3' 
                          }}
                        >
                          {price} GEL
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coverage Limits */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full lg:w-[1300px]">
              {/* Health & Life */}
              <div 
                className="border border-[#E5E5E5] bg-white lg:border-0 lg:bg-[#F4EFF3] p-4 lg:p-[35px_30px] w-full lg:w-[640px]"
              >
                <div className="flex flex-col gap-4 lg:gap-[50px] w-full">
                  <h3 
                    className="font-bold text-[18px] lg:text-[34px] text-[#2D1D38]"
                    style={{ lineHeight: '1.3' }}
                  >
                    {limits.health}
                  </h3>
                  <div className="flex flex-col gap-2 lg:gap-0 w-full">
                    <div className="flex items-center justify-between w-full py-2 lg:py-0 border-b border-[#F4EFF3] lg:border-0">
                      <span className="font-normal text-[14px] lg:text-[16px] lg:font-medium text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        {limits.healthPerPerson}
                      </span>
                      <span className="font-medium text-[14px] lg:text-[22px] lg:font-bold text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        30,000 GEL
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full py-2 lg:py-0">
                      <span className="font-normal text-[14px] lg:text-[16px] lg:font-medium text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        {limits.healthTotal}
                      </span>
                      <span className="font-medium text-[14px] lg:text-[22px] lg:font-bold text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        300,000 GEL
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property */}
              <div 
                className="border border-[#E5E5E5] bg-white lg:border-0 lg:bg-[#F4EFF3] p-4 lg:p-[35px_30px] w-full lg:w-[640px]"
              >
                <div className="flex flex-col gap-4 lg:gap-[50px] w-full">
                  <h3 
                    className="font-bold text-[18px] lg:text-[34px] text-[#2D1D38]"
                    style={{ lineHeight: '1.3' }}
                  >
                    {limits.property}
                  </h3>
                  <div className="flex flex-col gap-2 lg:gap-0 w-full">
                    <div className="flex items-center justify-between w-full py-2 lg:py-0 border-b border-[#F4EFF3] lg:border-0">
                      <span className="font-normal text-[14px] lg:text-[16px] lg:font-medium text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        {limits.propertyPerPerson}
                      </span>
                      <span className="font-medium text-[14px] lg:text-[22px] lg:font-bold text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        25,000 GEL
                      </span>
                    </div>
                    <div className="flex items-center justify-between w-full py-2 lg:py-0">
                      <span className="font-normal text-[14px] lg:text-[16px] lg:font-medium text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        {limits.propertyTotal}
                      </span>
                      <span className="font-medium text-[14px] lg:text-[22px] lg:font-bold text-[#2D1D38]" style={{ lineHeight: '1.3' }}>
                        50,000 GEL
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full bg-[#FAFAFA] py-10 lg:py-20">
          <div className="px-5 lg:pl-[310px] lg:pr-0" style={{ maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-[70px]">
              {/* FAQ Content */}
              <div className="flex flex-col gap-6 lg:gap-[50px] w-full lg:w-[640px]">
                <div className="flex flex-col gap-3 lg:gap-[20px]">
                  <h2 
                    className="font-bold text-[28px] lg:text-[55px] text-[#2D1D38] leading-[1.2] lg:leading-[0.9]"
                  >
                    {t?.faqTitle || "Frequently Asked Questions"}
                  </h2>
                  <p 
                    className="font-normal text-[14px] lg:text-[18px] lg:font-medium text-[#ABA2A5]"
                    style={{ lineHeight: '1.4' }}
                  >
                    {t?.faqSubtitle || "Answers to common questions about auto insurance in Georgia"}
                  </p>
                </div>

                <div className="flex flex-col gap-0 w-full lg:w-[640px]">
                  {(t?.faq || []).map((item: { q: string; a: string }, index: number) => (
                    <div 
                      key={index}
                      className="cursor-pointer w-full border-b border-[#E5E5E5] py-4 lg:py-5"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <div className="flex items-center justify-between w-full gap-3">
                        <p 
                          className="font-normal lg:font-medium flex-1 text-[14px] lg:text-[18px] text-[#2D1D38]"
                          style={{ lineHeight: '1.4' }}
                        >
                          {item.q}
                        </p>
                        <div 
                          className="w-7 h-7 lg:w-[28px] lg:h-[28px] flex-shrink-0 bg-[#DE643B] rounded-full flex items-center justify-center"
                        >
                          {/* Arrow icon for mobile, plus for desktop */}
                          <svg 
                            className="block lg:hidden"
                            width="12" 
                            height="12" 
                            viewBox="0 0 12 12" 
                            fill="none"
                          >
                            <path d="M4.5 2.5L8 6L4.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <svg 
                            className="hidden lg:block"
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none"
                            style={{ 
                              transform: openFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}
                          >
                            <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                      {openFaq === index && (
                        <p 
                          className="font-normal text-[14px] lg:text-[16px] text-[#776667] mt-3 lg:mt-[15px]"
                          style={{ lineHeight: '1.4' }}
                        >
                          {item.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Image - visible on both mobile and desktop */}
              <div 
                className="w-full h-[200px] lg:w-[900px] lg:h-[640px] flex-shrink-0 overflow-hidden"
              >
                <img 
                  src="/images/faq-consultation.jpg" 
                  alt={t?.faqTitle || "FAQ"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.style.backgroundColor = '#E6CFE3';
                      target.parentElement.innerHTML = `
                        <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                          <div style="width:200px;height:200px;border-radius:50%;background-color:#F4EFF3;display:flex;align-items:center;justify-content:center;">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2D1D38" stroke-width="1.5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      `;
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="w-full py-10 lg:py-20 px-5 lg:px-[310px]" style={{ backgroundColor: '#F4F3EE' }}>
          <div className="flex flex-col items-center justify-center gap-5 lg:gap-[30px]">
            <div className="flex flex-col items-center gap-[15px] text-center" style={{ color: '#2D1D38' }}>
              <h2 
                className="font-bold text-[34px] lg:text-[55px] leading-[1.3] lg:leading-[0.9]"
              >
                {t?.contactTitle || "Ready to get insured?"}
              </h2>
              <p 
                className="font-medium text-[14px] lg:text-[18px]"
                style={{ lineHeight: '1.3' }}
              >
                {t?.contactSubtitle || "Contact us and get your policy in minutes"}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-[20px] w-full lg:w-auto">
              <button
                onClick={() => trackAndOpenLink(CONTACT.whatsapp, 'whatsapp')}
                className="inline-flex items-center justify-center gap-[5px] font-medium transition-all hover:opacity-90 w-full lg:w-[185px] cursor-pointer border-none"
                style={{ 
                  backgroundColor: '#60D669', 
                  color: '#FAFAFA', 
                  padding: '12px 15px',
                  borderRadius: '1000px',
                  fontSize: '16px',
                  lineHeight: '1.3'
                }}
              >
                <svg className="w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                  <path d="M15 0C6.716 0 0 6.716 0 15c0 2.823.784 5.462 2.14 7.712L0 30l7.535-2.065A14.932 14.932 0 0015 30c8.284 0 15-6.716 15-15S23.284 0 15 0zm7.463 21.228c-.312.878-1.831 1.683-2.522 1.756-.691.073-1.344.312-4.522-.942-3.831-1.512-6.263-5.463-6.453-5.716-.19-.253-1.553-2.066-1.553-3.94 0-1.875 1.003-2.794 1.355-3.172.352-.378.769-.472.1.025-.472 1.278-.472 1.406-.253 2.288 0 2.288-.006 2.537.188 2.85.378.613 1.372 1.453 2.166 1.769.872.347 2.953 1.437 3.506 1.722.553.284.919.425 1.053.663.134.237.134.878-.066 1.728-.2.85-.084 1.053-.381 1.053-.297-.631-.297-1.137-.612-1.641-1.025-.5-.287-1.072-.472-1.144-.556-.072-.084-.297-.134-.619-.237-.322-.103-1.903-.937-2.2-1.044-.297-.106-.512-.159-.728.159-.216.319-.837 1.044-1.025 1.259-.188.216-.378.241-.7.084-.322-.159-1.356-.5-2.584-1.594-.956-.85-1.6-1.9-1.787-2.222-.188-.319-.02-.491.141-.65.145-.143.322-.374.484-.562.162-.188.216-.32.325-.534.108-.216.054-.403-.027-.563-.08-.159-.728-1.753-1-2.4-.263-.628-.53-.544-.728-.553-.188-.009-.403-.013-.619-.013-.216 0-.566.08-.862.403-.297.322-1.131 1.103-1.131 2.69 0 1.588 1.159 3.122 1.322 3.337.162.216 2.266 3.534 5.5 4.956.769.331 1.369.53 1.837.678.772.247 1.475.212 2.031.128.619-.093 1.903-.778 2.172-1.528.269-.75.269-1.393.188-1.528-.081-.134-.297-.216-.619-.378z" fill="currentColor"/>
                </svg>
                Whatsapp
              </button>
              <button
                onClick={() => trackAndOpenLink(CONTACT.telegram, 'telegram')}
                className="inline-flex items-center justify-center gap-[5px] font-medium transition-all hover:opacity-90 w-full lg:w-[185px] cursor-pointer border-none"
                style={{ 
                  backgroundColor: '#2AABEE', 
                  color: '#FAFAFA', 
                  padding: '12px 15px',
                  borderRadius: '1000px',
                  fontSize: '16px',
                  lineHeight: '1.3'
                }}
              >
                <svg className="w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                  <path d="M15 0C6.716 0 0 6.716 0 15s6.716 15 15 15 15-6.716 15-15S23.284 0 15 0zm6.95 10.29l-2.28 10.76c-.17.77-.63.96-1.28.6l-3.53-2.6-1.7 1.64c-.19.19-.35.35-.71.35l.25-3.58 6.53-5.9c.28-.25-.06-.4-.44-.15l-8.07 5.08-3.48-1.09c-.76-.24-.77-.76.16-1.13l13.62-5.25c.63-.23 1.18.15.97 1.13l.01-.01z" fill="currentColor"/>
                </svg>
                Telegram
              </button>
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
