"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary } from "@/lib/i18n";
import InsuranceModal from "@/components/ui/InsuranceModal";
import InsuranceOrderModal from "@/components/ui/InsuranceOrderModal";

interface InsurancePlansProps {
  locale: Locale;
  dict: Dictionary;
}

// Define plans with prices
const PLANS_DATA = [
  {
    id: "visitor",
    price: 4,
    period: "day",
    popular: false,
    coverageKeys: ["support247", "emergency", "outpatient", "dentalEmergency", "hospitalization"],
  },
  {
    id: "standard",
    price: 200,
    period: "months3",
    popular: false,
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  {
    id: "optimum",
    price: 250,
    period: "months6",
    popular: false,
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  {
    id: "premium",
    price: 300,
    period: "year",
    popular: true,
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  {
    id: "uno-active",
    price: 55,
    period: "month",
    popular: false,
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dental"],
  },
  {
    id: "uno-active-plus",
    price: 90,
    period: "month",
    popular: false,
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dental"],
  },
];

export default function InsurancePlans({ locale, dict }: InsurancePlansProps) {
  const t = dict.insurance;
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [orderPlan, setOrderPlan] = useState<{ id: string; name: string; price: number; period: string } | null>(null);
  
  const getModalData = (planId: string) => {
    const planTranslations = t.plans[planId as keyof typeof t.plans];
    const details = t.planDetails?.[planId as keyof typeof t.planDetails];
    
    return {
      planName: planTranslations?.name || "",
      planDescription: details?.description || planTranslations?.description || "",
      coverageItems: details?.coverage || [],
      faqItems: details?.faq || [],
    };
  };

  const modalData = selectedPlan ? getModalData(selectedPlan) : null;
  
  return (
    <section id="insurance" aria-labelledby="insurance-heading" className="relative bg-zinc-50 w-full overflow-hidden" style={{ padding: '80px 0 100px 0' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10" style={{ maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px' }}>
        {/* Header */}
        <div className="flex flex-col items-center text-center" style={{ marginBottom: '50px' }}>
          {/* Label badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-1.5" style={{ marginBottom: '24px' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-red-600 text-xs font-semibold tracking-wider uppercase">{t.label}</span>
          </div>
          
          {/* Title */}
          <h2 id="insurance-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900" style={{ marginBottom: '20px' }}>
            {t.title}{" "}
            <span className="text-red-600">{t.titleHighlight}</span>
          </h2>
          
          {/* Description */}
          <p className="text-base md:text-lg text-zinc-500 max-w-xl text-center leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Plans Grid - 3 columns on large, 2 on medium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PLANS_DATA.map((plan) => {
            const planTranslations = t.plans[plan.id as keyof typeof t.plans];
            const periodKey = plan.period as 'day' | 'month' | 'months6' | 'year';
            const periodText = t[periodKey] as string;
            const hasDetails = t.planDetails?.[plan.id as keyof typeof t.planDetails];
            
            return (
              <div
                key={plan.id}
                className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col ${
                  plan.popular 
                    ? "border-red-500 shadow-lg shadow-red-100" 
                    : "border-zinc-200 hover:border-red-200"
                }`}
                style={{ padding: '28px' }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold py-1.5 px-4 rounded-full whitespace-nowrap">
                    {t.recommend}
                  </div>
                )}

                {/* Plan Header */}
                <div style={{ marginBottom: '20px', paddingTop: plan.popular ? '8px' : '0' }}>
                  <h3 className="text-lg font-bold text-zinc-900 text-center" style={{ marginBottom: '6px' }}>
                    {planTranslations.name}
                  </h3>
                  <p className="text-zinc-500 text-sm text-center">
                    {planTranslations.description}
                  </p>
                </div>

                {/* Price */}
                <div className="text-center" style={{ marginBottom: '24px' }}>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-red-600">{plan.price}</span>
                    <span className="text-zinc-500 text-sm">GEL / {periodText}</span>
                  </div>
                </div>

                {/* Coverage List */}
                <ul className="grow" style={{ marginBottom: '24px' }}>
                  {plan.coverageKeys.map((key, idx) => (
                    <li key={idx} className="flex items-start gap-2" style={{ marginBottom: '12px' }}>
                      <svg className="w-5 h-5 text-emerald-500 shrink-0" style={{ marginTop: '1px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-zinc-600 text-sm">
                        {t.coverage[key as keyof typeof t.coverage]}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* More Details Button */}
                {hasDetails && (
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
                    style={{ marginBottom: '12px' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.moreDetails}
                  </button>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => setOrderPlan({ id: plan.id, name: planTranslations.name, price: plan.price, period: plan.period })}
                  className={`w-full text-center py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    plan.popular
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200"
                      : "bg-zinc-100 hover:bg-red-600 text-zinc-700 hover:text-white"
                  }`}
                >
                  {t.order}
                </button>
              </div>
            );
          })}
        </div>

        {/* See All Button */}
        <div className="flex justify-center" style={{ marginTop: '50px' }}>
          <Link
            href={`/${locale}/insurance`}
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white py-4 px-8 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl"
          >
            {t.seeAll}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Help Banner */}
        <div className="flex justify-center" style={{ marginTop: '30px' }}>
          <div className="inline-flex items-center gap-3 bg-white border border-zinc-200 rounded-full py-3 px-6 shadow-sm">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-zinc-600">{t.needHelp}</span>
            <Link href={CONTACT.whatsapp} target="_blank" className="text-red-600 hover:text-red-700 font-semibold">
              {t.writeUs}
            </Link>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedPlan && modalData && (
        <InsuranceModal
          isOpen={!!selectedPlan}
          onClose={() => setSelectedPlan(null)}
          planName={modalData.planName}
          planDescription={modalData.planDescription}
          coverageItems={modalData.coverageItems}
          faqItems={modalData.faqItems}
          locale={locale}
          labels={{
            covers: t.modalLabels?.covers || "INSURANCE COVERS",
            faq: t.modalLabels?.faq || "FREQUENTLY ASKED QUESTIONS",
            close: t.modalLabels?.close || "Close",
          }}
        />
      )}

      {/* Order Modal */}
      {orderPlan && (
        <InsuranceOrderModal
          isOpen={!!orderPlan}
          onClose={() => setOrderPlan(null)}
          planName={orderPlan.name}
          planPrice={orderPlan.price}
          planPeriod={orderPlan.period}
          locale={locale}
          dict={dict}
        />
      )}
    </section>
  );
}
