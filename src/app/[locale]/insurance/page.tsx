"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InsuranceOrderModal from "@/components/ui/InsuranceOrderModal";
import { CONTACT } from "@/lib/constants";
import { getDictionary, type Locale, type Dictionary } from "@/lib/i18n";
import { useParams, useSearchParams } from "next/navigation";

// Feature interface matching API response
interface PlanFeature {
  id: number;
  featureKey: string;
  nameRu: string;
  nameEn: string | null;
  nameKa: string | null;
  nameUk: string | null;
  nameTr: string | null;
  nameHe: string | null;
  nameAr: string | null;
  sortOrder: number;
}

// Coverage item interface matching API response
interface CoverageItem {
  id: number;
  icon: string;
  titleRu: string;
  titleEn: string | null;
  titleKa: string | null;
  titleUk: string | null;
  titleTr: string | null;
  titleHe: string | null;
  titleAr: string | null;
  limitRu: string | null;
  limitEn: string | null;
  limitKa: string | null;
  limitUk: string | null;
  limitTr: string | null;
  limitHe: string | null;
  limitAr: string | null;
  sortOrder: number;
}

// Plan interface matching API response
interface Plan {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  descriptionRu: string;
  descriptionEn: string;
  descriptionKa: string;
  descriptionUk: string;
  descriptionTr: string;
  descriptionHe: string;
  descriptionAr: string;
  subtitleRu: string;
  subtitleEn: string;
  subtitleKa: string;
  subtitleUk: string;
  subtitleTr: string;
  subtitleHe: string;
  subtitleAr: string;
  isFavorite: boolean;
  isLegalCompliant: boolean;
  price: number;
  originalPrice: number | null;
  discountPercent: number | null;
  discountFixed: number | null;
  pricingType: "per_day" | "fixed" | "per_month";
  period: string;
  periodLabel: string;
  isActive: boolean;
  sortOrder: number;
  translations: Record<string, { name: string; description: string }>;
  features: PlanFeature[];
  coverageItems: CoverageItem[];
}

// Icon component for coverage items
function CoverageIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "phone":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case "emergency":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "hospital":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "ambulance":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "dental":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "plane":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "heart":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "home":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "dollar":
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
  }
}

function InsurancePageContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.insurance;
  const insurancePage = dict.insurancePage;
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orderPlan, setOrderPlan] = useState<{ id: number; slug: string; name: string; price: number; period: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState<"main" | "longterm" | null>(
    categoryFromUrl === 'main' || categoryFromUrl === 'longterm' ? categoryFromUrl : null
  );

  // Fetch plans from API v2
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/v2/plans", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans || []);
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Update category when URL changes
  useEffect(() => {
    if (categoryFromUrl === 'main' || categoryFromUrl === 'longterm') {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  const filteredPlans = activeCategory === null 
    ? plans 
    : plans.filter(plan => plan.categorySlug === activeCategory);

  // Get feature name by locale
  const getFeatureName = (feature: PlanFeature) => {
    const localeMap: Record<string, keyof PlanFeature> = {
      ru: 'nameRu', en: 'nameEn', ka: 'nameKa', uk: 'nameUk',
      tr: 'nameTr', he: 'nameHe', ar: 'nameAr',
    };
    const key = localeMap[locale] || 'nameRu';
    return (feature[key] as string) || feature.nameRu;
  };

  // Get coverage title by locale
  const getCoverageTitle = (item: CoverageItem) => {
    const titleMap: Record<string, keyof CoverageItem> = {
      ru: 'titleRu', en: 'titleEn', ka: 'titleKa', uk: 'titleUk',
      tr: 'titleTr', he: 'titleHe', ar: 'titleAr',
    };
    const key = titleMap[locale] || 'titleRu';
    return (item[key] as string) || item.titleRu;
  };

  // Get coverage limit by locale
  const getCoverageLimit = (item: CoverageItem) => {
    const limitMap: Record<string, keyof CoverageItem> = {
      ru: 'limitRu', en: 'limitEn', ka: 'limitKa', uk: 'limitUk',
      tr: 'limitTr', he: 'limitHe', ar: 'limitAr',
    };
    const key = limitMap[locale] || 'limitRu';
    return (item[key] as string) || item.limitRu || "✓";
  };

  // Get plan subtitle by locale
  const getPlanSubtitle = (plan: Plan): string => {
    const subtitleMap: Record<Locale, string> = {
      ru: plan.subtitleRu,
      en: plan.subtitleEn,
      ka: plan.subtitleKa,
      uk: plan.subtitleUk,
      tr: plan.subtitleTr,
      he: plan.subtitleHe,
      ar: plan.subtitleAr,
    };
    return subtitleMap[locale] || plan.subtitleRu || "";
  };

  // Get plan description by locale
  const getPlanDescription = (plan: Plan): string => {
    const descMap: Record<Locale, string> = {
      ru: plan.descriptionRu,
      en: plan.descriptionEn,
      ka: plan.descriptionKa,
      uk: plan.descriptionUk,
      tr: plan.descriptionTr,
      he: plan.descriptionHe,
      ar: plan.descriptionAr,
    };
    return descMap[locale] || plan.descriptionRu || "";
  };

  // Get plan name/subtitle by locale (from translations or fallback)
  const getPlanTranslation = (plan: Plan) => {
    const translation = plan.translations?.[locale];
    if (translation?.name) {
      return {
        name: translation.name,
        subtitle: getPlanSubtitle(plan),
        description: getPlanDescription(plan),
      };
    }
    return {
      name: plan.name,
      subtitle: getPlanSubtitle(plan),
      description: getPlanDescription(plan),
    };
  };

  // Labels with all language translations
  const labelTranslations: Record<string, Record<Locale, string>> = {
    recommend: {
      ru: '★ Фаворит',
      en: '★ Favorite',
      ka: '★ ფავორიტი',
      uk: '★ Фаворит',
      tr: '★ Favori',
      he: '★ מועדף',
      ar: '★ المفضل',
    },
    legalBadge: {
      ru: 'Соответствует закону',
      en: 'Legal compliant',
      ka: 'კანონთან შესაბამისი',
      uk: 'Відповідає закону',
      tr: 'Yasaya uygun',
      he: 'עומד בדרישות החוק',
      ar: 'متوافق مع القانون',
    },
    moreDetails: {
      ru: 'Подробнее',
      en: 'More details',
      ka: 'დეტალები',
      uk: 'Детальніше',
      tr: 'Detaylar',
      he: 'פרטים נוספים',
      ar: 'المزيد من التفاصيل',
    },
    order: {
      ru: 'Оформить',
      en: 'Order',
      ka: 'შეკვეთა',
      uk: 'Оформити',
      tr: 'Sipariş',
      he: 'הזמן',
      ar: 'طلب',
    },
    coverage: {
      ru: 'СТРАХОВОЕ ПОКРЫТИЕ',
      en: 'INSURANCE COVERAGE',
      ka: 'სადაზღვევო დაფარვა',
      uk: 'СТРАХОВЕ ПОКРИТТЯ',
      tr: 'SİGORTA KAPSAMI',
      he: 'כיסוי ביטוחי',
      ar: 'التغطية التأمينية',
    },
    close: {
      ru: 'Закрыть',
      en: 'Close',
      ka: 'დახურვა',
      uk: 'Закрити',
      tr: 'Kapat',
      he: 'סגור',
      ar: 'إغلاق',
    },
    noFeatures: {
      ru: 'Нет активных функций',
      en: 'No active features',
      ka: 'აქტიური ფუნქციები არ არის',
      uk: 'Немає активних функцій',
      tr: 'Aktif özellik yok',
      he: 'אין תכונות פעילות',
      ar: 'لا توجد ميزات نشطة',
    },
    noCoverage: {
      ru: 'Нет элементов покрытия',
      en: 'No coverage items',
      ka: 'დაფარვის ელემენტები არ არის',
      uk: 'Немає елементів покриття',
      tr: 'Kapsam öğesi yok',
      he: 'אין פריטי כיסוי',
      ar: 'لا توجد عناصر تغطية',
    },
    perDay: {
      ru: 'день',
      en: 'day',
      ka: 'დღე',
      uk: 'день',
      tr: 'gün',
      he: 'יום',
      ar: 'يوم',
    },
    perMonth: {
      ru: 'месяц',
      en: 'month',
      ka: 'თვე',
      uk: 'місяць',
      tr: 'ay',
      he: 'חודש',
      ar: 'شهر',
    },
    perYear: {
      ru: 'год',
      en: 'year',
      ka: 'წელი',
      uk: 'рік',
      tr: 'yıl',
      he: 'שנה',
      ar: 'سنة',
    },
  };

  const labels = {
    recommend: labelTranslations.recommend[locale] || labelTranslations.recommend.en,
    legalBadge: labelTranslations.legalBadge[locale] || labelTranslations.legalBadge.en,
    moreDetails: labelTranslations.moreDetails[locale] || labelTranslations.moreDetails.en,
    order: labelTranslations.order[locale] || labelTranslations.order.en,
    coverage: labelTranslations.coverage[locale] || labelTranslations.coverage.en,
    close: labelTranslations.close[locale] || labelTranslations.close.en,
    noFeatures: labelTranslations.noFeatures[locale] || labelTranslations.noFeatures.en,
    noCoverage: labelTranslations.noCoverage[locale] || labelTranslations.noCoverage.en,
    perDay: labelTranslations.perDay[locale] || labelTranslations.perDay.en,
    perMonth: labelTranslations.perMonth[locale] || labelTranslations.perMonth.en,
    perYear: labelTranslations.perYear[locale] || labelTranslations.perYear.en,
  };

  // Get period label by pricing type
  const getPeriodLabel = (plan: Plan): string => {
    if (plan.pricingType === 'per_day') return labels.perDay;
    if (plan.pricingType === 'per_month') return labels.perMonth;
    if (plan.pricingType === 'fixed') return labels.perYear;
    return labels.perDay;
  };

  return (
    <div className="w-full flex flex-col">
      <Header locale={locale} dict={dict} />
      <main className="main-content w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative w-full bg-linear-to-br from-red-600 via-red-700 to-slate-900 overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-[10%] w-72 h-72 bg-red-400/20 rounded-full blur-3xl" />
            <div className="absolute top-40 right-[15%] w-96 h-96 bg-red-300/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />
          </div>
          <div className="relative z-10" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="text-center">
              <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-red-200/70 hover:text-white transition-colors text-sm" style={{ marginBottom: '1rem' }}>
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
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
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
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/30"
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
                className="px-6 py-2.5 rounded-full font-medium transition-all duration-200 bg-linear-to-r from-red-100 to-red-50 text-red-700 hover:from-red-200 hover:to-red-100 flex items-center gap-2"
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
        <section className="w-full bg-linear-to-b from-slate-50 via-red-50/30 to-white" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
          <div style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => {
                const translation = getPlanTranslation(plan);
                const features = plan.features || [];
                const hasDetails = features.length > 0 || (plan.coverageItems && plan.coverageItems.length > 0);

                return (
                  <div
                    key={plan.id}
                    className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col ${
                      plan.isFavorite
                        ? "border-red-500 shadow-lg shadow-red-500/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {plan.isFavorite && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-xs font-semibold py-1.5 px-4 rounded-full whitespace-nowrap">
                        {labels.recommend}
                      </div>
                    )}

                    <div className={`p-6 flex flex-col grow ${plan.isFavorite ? "pt-8" : ""}`}>
                      {/* Legal Badge */}
                      {plan.isLegalCompliant && (
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: 600,
                            background: 'linear-gradient(to right, #10b981, #14b8a6)',
                            color: 'white',
                          }}>
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {labels.legalBadge}
                          </span>
                        </div>
                      )}

                      {/* Plan Name & Description */}
                      <div style={{ marginBottom: '16px' }}>
                        <h3 className="text-xl font-bold text-primary-black text-center" style={{ marginBottom: '8px' }}>
                          {translation.name}
                        </h3>
                        <p className="text-primary-grey text-sm text-center">
                          {translation.subtitle}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-center" style={{ marginBottom: '24px' }}>
                        {plan.originalPrice ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                            <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>{plan.originalPrice} GEL</span>
                            <div className="flex items-baseline justify-center gap-1 flex-wrap">
                              <span className="text-4xl font-bold text-red-600">{plan.price}</span>
                              <span className="text-primary-grey">GEL/{getPeriodLabel(plan)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-baseline justify-center gap-1 flex-wrap">
                            <span className="text-4xl font-bold text-red-600">{plan.price}</span>
                            <span className="text-primary-grey">GEL/{getPeriodLabel(plan)}</span>
                          </div>
                        )}
                      </div>

                      {/* Coverage List */}
                      <ul className="grow" style={{ marginBottom: '20px' }}>
                        {features.length > 0 ? (
                          features.map((feature) => (
                            <li key={feature.id} className="flex items-start gap-2" style={{ marginBottom: '10px' }}>
                              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-primary-grey text-sm leading-tight">
                                {getFeatureName(feature)}
                              </span>
                            </li>
                          ))
                        ) : (
                          <li style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', padding: '20px 0' }}>
                            {labels.noFeatures}
                          </li>
                        )}
                      </ul>

                      {/* Buttons */}
                      <div className="flex flex-col gap-3" style={{ marginTop: 'auto' }}>
                        {hasDetails && (
                          <button
                            onClick={() => setSelectedPlan(plan)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all duration-200"
                          >
                            <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {labels.moreDetails}
                          </button>
                        )}
                        <button
                          onClick={() => setOrderPlan({ id: plan.id, slug: plan.slug, name: translation.name, price: plan.price, period: plan.period })}
                          className={`block w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                            plan.isFavorite
                              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40"
                              : "bg-gray-100 hover:bg-red-50 text-primary-black hover:text-red-600"
                          }`}
                        >
                          {labels.order}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </section>
      </main>
      <Footer locale={locale} dict={dict} />

      {/* Details Modal - inline like Visitgeorgia */}
      {selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>
                  {getPlanTranslation(selectedPlan).name}
                </h3>
                <p style={{ margin: '16px 0 0', fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
                  {getPlanTranslation(selectedPlan).description || getPlanTranslation(selectedPlan).subtitle || ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#9ca3af', fontSize: '24px', marginLeft: '16px' }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <p style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px' }}>
                {labels.coverage}
              </p>

              {/* Coverage Grid */}
              {selectedPlan.coverageItems && selectedPlan.coverageItems.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {selectedPlan.coverageItems.map((item) => (
                    <div key={item.id} style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#fafafa',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}>
                        <CoverageIcon icon={item.icon} />
                      </div>
                      <div style={{ fontSize: '13px', color: '#374151', marginBottom: '6px', lineHeight: 1.4 }}>
                        {getCoverageTitle(item)}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626' }}>
                        {getCoverageLimit(item)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px 0' }}>
                  {labels.noCoverage}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#f4f4f5',
                  color: '#27272a',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {labels.close}
              </button>
            </div>
          </div>
        </div>
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

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>}>
      <InsurancePageContent locale={locale} dict={dict} />
    </Suspense>
  );
}

