"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceModal from "@/components/ui/InsuranceModal";
import InsuranceOrderModal from "@/components/ui/InsuranceOrderModal";
import { CONTACT } from "@/lib/constants";
import { getDictionary, type Locale, type Dictionary } from "@/lib/i18n";
import { useParams, useSearchParams } from "next/navigation";

// All insurance plans data
const ALL_PLANS = [
  // Main Plans
  {
    id: "visitor",
    price: 4,
    period: "day",
    popular: false,
    category: "main",
    coverageKeys: ["support247", "emergency", "outpatient", "dentalEmergency", "hospitalization"],
  },
  {
    id: "standard",
    price: 200,
    period: "months3",
    popular: false,
    category: "main",
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  {
    id: "optimum",
    price: 250,
    period: "months6",
    popular: false,
    category: "main",
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  {
    id: "premium",
    price: 300,
    period: "year",
    popular: true,
    category: "main",
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dentalEmergency"],
  },
  // Long-term Plans
  {
    id: "uno-active",
    price: 55,
    period: "month",
    popular: false,
    category: "longterm",
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dental"],
  },
  {
    id: "uno-active-plus",
    price: 90,
    period: "month",
    popular: false,
    category: "longterm",
    coverageKeys: ["support247", "emergency", "hospitalization", "outpatient", "dental"],
  },
];

function InsurancePageContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.insurance;
  const insurancePage = dict.insurancePage;
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [orderPlan, setOrderPlan] = useState<{ id: string; name: string; price: number; period: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<"main" | "longterm" | null>(
    categoryFromUrl === 'main' || categoryFromUrl === 'longterm' ? categoryFromUrl : null
  );

  // Update category when URL changes
  useEffect(() => {
    if (categoryFromUrl === 'main' || categoryFromUrl === 'longterm') {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredPlans = activeCategory === null 
    ? ALL_PLANS 
    : ALL_PLANS.filter(plan => plan.category === activeCategory);

  // Get modal data for selected plan
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
    <div className="w-full flex flex-col items-center">
      <Header locale={locale} dict={dict} />
      <main className="main-content w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full bg-linear-to-br from-primary-blue via-primary-blue-dark to-slate-900 overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary-blue-light/20 rounded-full blur-3xl" />
            <div className="absolute top-40 right-[15%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />
          </div>
          <div className="relative z-10" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center">
              <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white transition-colors text-sm" style={{ marginBottom: '1rem' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                {dict.common.backToHome}
              </Link>
              <h1 className="text-3xl lg:text-5xl font-bold text-white">
                {insurancePage.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="w-full bg-white border-b border-gray-100" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
          <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setActiveCategory("main")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === "main"
                    ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30"
                    : "bg-gray-100 text-primary-grey hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {insurancePage.categories.main}
              </button>
              <button
                onClick={() => setActiveCategory("longterm")}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === "longterm"
                    ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/30"
                    : "bg-gray-100 text-primary-grey hover:bg-gray-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {insurancePage.categories.longterm}
              </button>
              <Link
                href={`/${locale}/auto-insurance`}
                className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 bg-linear-to-r from-orange-100 to-amber-100 text-orange-700 hover:from-orange-200 hover:to-amber-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
                {insurancePage.categories?.auto || "ОСАГО"}
              </Link>
            </div>
          </div>
        </section>

        {/* Plans Grid */}
        <section className="w-full bg-linear-to-b from-slate-50 via-blue-50/30 to-white" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
          <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => {
                const planTranslations = t.plans[plan.id as keyof typeof t.plans];
                const periodKey = plan.period as 'day' | 'month' | 'months3' | 'months6' | 'year';
                const periodText = t[periodKey] as string;
                const hasDetails = t.planDetails?.[plan.id as keyof typeof t.planDetails];

                return (
                  <div
                    key={plan.id}
                    className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col ${
                      plan.popular
                        ? "border-primary-blue shadow-lg shadow-primary-blue/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-blue text-white text-xs font-semibold py-1.5 px-4 rounded-full whitespace-nowrap">
                        {t.recommend}
                      </div>
                    )}

                    <div className={`p-6 flex flex-col grow ${plan.popular ? "pt-8" : ""}`}>
                      {/* Plan Name & Description */}
                      <div style={{ marginBottom: '16px' }}>
                        <h3 className="text-xl font-bold text-primary-black text-center" style={{ marginBottom: '8px' }}>
                          {planTranslations.name}
                        </h3>
                        <p className="text-primary-grey text-sm text-center">
                          {planTranslations.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center" style={{ marginBottom: '24px' }}>
                        <div className="flex items-baseline justify-center gap-1 flex-wrap">
                          <span className="text-4xl font-bold text-primary-blue">{plan.price}</span>
                          <span className="text-primary-grey">GEL/{periodText}</span>
                        </div>
                      </div>

                      {/* Coverage List */}
                      <ul className="grow" style={{ marginBottom: '20px' }}>
                        {plan.coverageKeys.map((key, idx) => (
                          <li key={idx} className="flex items-start gap-2" style={{ marginBottom: '10px' }}>
                            <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-primary-grey text-sm leading-tight">
                              {t.coverage[key as keyof typeof t.coverage]}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Buttons */}
                      <div className="flex flex-col gap-3" style={{ marginTop: 'auto' }}>
                        {hasDetails && (
                          <button
                            onClick={() => setSelectedPlan(plan.id)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-primary-blue bg-primary-blue/5 hover:bg-primary-blue/10 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t.moreDetails}
                          </button>
                        )}
                        <button
                          onClick={() => setOrderPlan({ id: plan.id, name: planTranslations.name, price: plan.price, period: plan.period })}
                          className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                            plan.popular
                              ? "bg-primary-blue hover:bg-primary-blue-dark text-white shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
                              : "bg-gray-100 hover:bg-primary-blue/10 text-primary-black hover:text-primary-blue"
                          }`}
                        >
                          {t.order}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />

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
    </div>
  );
}

export default function InsurancePage() {
  const params = useParams();
  const locale = (params.locale as string) as Locale;
  const dict = getDictionary(locale);

  return <InsurancePageContent locale={locale} dict={dict} />;
}
