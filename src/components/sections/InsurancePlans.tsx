"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONTACT } from "@/lib/constants";
import { type Locale, type Dictionary } from "@/lib/i18n";
import InsuranceOrderModal from "@/components/ui/InsuranceOrderModal";

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
  pricingType: "per_day" | "per_month" | "per_3_months" | "per_6_months" | "per_year" | "fixed";
  period: string;
  periodLabel: string;
  isActive: boolean;
  sortOrder: number;
  translations: Record<string, { name: string; description: string }>;
  features: PlanFeature[];
  coverageItems: CoverageItem[];
}

interface InsurancePlansProps {
  locale: Locale;
  dict: Dictionary;
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

function InsurancePlansContent({ locale, dict }: InsurancePlansProps) {
  const t = dict.insurance;
  const searchParams = useSearchParams();
  const promoFromUrl = searchParams.get('promo');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orderPlan, setOrderPlan] = useState<{ id: number; slug: string; name: string; price: number; period: string } | null>(null);

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
    // Fallback to Russian
    return {
      name: plan.name,
      subtitle: getPlanSubtitle(plan),
      description: getPlanDescription(plan),
    };
  };

  // Labels with all language translations
  const labelTranslations: Record<string, Record<Locale, string>> = {
    recommend: {
      ru: '⭐ Фаворит',
      en: '⭐ Favorite',
      ka: '⭐ ფავორიტი',
      uk: '⭐ Фаворит',
      tr: '⭐ Favori',
      he: '⭐ מועדף',
      ar: '⭐ المفضل',
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
    seeAll: {
      ru: 'Все планы',
      en: 'See all plans',
      ka: 'ყველა გეგმა',
      uk: 'Всі плани',
      tr: 'Tüm planlar',
      he: 'כל התוכניות',
      ar: 'جميع الخطط',
    },
    needHelp: {
      ru: 'Нужна помощь?',
      en: 'Need help?',
      ka: 'დახმარება გჭირდებათ?',
      uk: 'Потрібна допомога?',
      tr: 'Yardım mı lazım?',
      he: 'צריך עזרה?',
      ar: 'تحتاج مساعدة؟',
    },
    writeUs: {
      ru: 'Напишите нам',
      en: 'Contact us',
      ka: 'დაგვიკავშირდით',
      uk: 'Напишіть нам',
      tr: 'Bize yazın',
      he: 'צור קשר',
      ar: 'اتصل بنا',
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
    // Period labels
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
    per3Months: {
      ru: '3 месяца',
      en: '3 months',
      ka: '3 თვე',
      uk: '3 місяці',
      tr: '3 ay',
      he: '3 חודשים',
      ar: '3 أشهر',
    },
    per6Months: {
      ru: '6 месяцев',
      en: '6 months',
      ka: '6 თვე',
      uk: '6 місяців',
      tr: '6 ay',
      he: '6 חודשים',
      ar: '6 أشهر',
    },
  };

  const labels = {
    recommend: labelTranslations.recommend[locale] || labelTranslations.recommend.en,
    legalBadge: labelTranslations.legalBadge[locale] || labelTranslations.legalBadge.en,
    moreDetails: labelTranslations.moreDetails[locale] || labelTranslations.moreDetails.en,
    order: labelTranslations.order[locale] || labelTranslations.order.en,
    seeAll: labelTranslations.seeAll[locale] || labelTranslations.seeAll.en,
    needHelp: labelTranslations.needHelp[locale] || labelTranslations.needHelp.en,
    writeUs: labelTranslations.writeUs[locale] || labelTranslations.writeUs.en,
    coverage: labelTranslations.coverage[locale] || labelTranslations.coverage.en,
    close: labelTranslations.close[locale] || labelTranslations.close.en,
    noFeatures: labelTranslations.noFeatures[locale] || labelTranslations.noFeatures.en,
    noCoverage: labelTranslations.noCoverage[locale] || labelTranslations.noCoverage.en,
    perDay: labelTranslations.perDay[locale] || labelTranslations.perDay.en,
    perMonth: labelTranslations.perMonth[locale] || labelTranslations.perMonth.en,
    perYear: labelTranslations.perYear[locale] || labelTranslations.perYear.en,
    per3Months: labelTranslations.per3Months[locale] || labelTranslations.per3Months.en,
    per6Months: labelTranslations.per6Months[locale] || labelTranslations.per6Months.en,
  };

  // Get period label by pricing type
  const getPeriodLabel = (plan: Plan): string => {
    if (plan.pricingType === 'per_day') return labels.perDay;
    if (plan.pricingType === 'per_month') return labels.perMonth;
    if (plan.pricingType === 'per_3_months') return labels.per3Months;
    if (plan.pricingType === 'per_6_months') return labels.per6Months;
    if (plan.pricingType === 'per_year' || plan.pricingType === 'fixed') return labels.perYear;
    return labels.perDay;
  };
  
  return (
    <section id="insurance" aria-labelledby="insurance-heading" className="relative bg-zinc-50 py-16 lg:py-24 w-full overflow-hidden bg-[linear-gradient(rgba(30,58,138,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.02)_1px,transparent_1px)] bg-size-[60px_60px]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl" />
        <div className="absolute -top-12 right-0 w-72 h-72 bg-red-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-300/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-primary-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10" style={{ maxWidth: '1440px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p className="text-primary-blue text-xs font-medium tracking-[0.2em] uppercase" style={{ margin: '0 0 20px 0' }}>{t.label}</p>
          <h2 id="insurance-heading" className="text-3xl lg:text-4xl xl:text-5xl font-bold text-zinc-800" style={{ margin: '0 0 20px 0' }}>
            {t.title} <span className="text-primary-blue">{t.titleHighlight}</span>
          </h2>
          <p className="text-base text-zinc-600" style={{ margin: '0 auto', maxWidth: '600px' }}>
            {t.description}
          </p>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {plans.map((plan) => {
            const translation = getPlanTranslation(plan);
            const features = plan.features || [];
            const hasDetails = features.length > 0 || (plan.coverageItems && plan.coverageItems.length > 0);
            
            return (
              <div
                key={plan.id}
                className="group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl flex flex-col overflow-hidden"
                style={{
                  borderColor: plan.isFavorite ? '#dc2626' : '#e5e7eb',
                  borderWidth: plan.isFavorite ? '2px' : '1px',
                  boxShadow: plan.isFavorite ? '0 10px 25px rgba(37,99,235,0.15)' : '0 4px 12px rgba(0,0,0,0.05)',
                  transform: plan.isFavorite ? 'scale(1.02)' : 'none',
                  zIndex: plan.isFavorite ? 10 : 1,
                }}
              >
                {/* Popular Badge */}
                {plan.isFavorite && (
                  <div style={{ position: 'relative', textAlign: 'center', marginTop: '-1px' }}>
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '6px 16px',
                      borderRadius: '0 0 12px 12px',
                    }}>
                      {labels.recommend}
                    </span>
                  </div>
                )}

                <div style={{ padding: '16px', paddingTop: plan.isFavorite ? '8px' : '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
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
                  
                  {/* Plan Name & Subtitle */}
                  <div style={{ minHeight: '70px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#27272a', margin: '0 0 6px' }}>
                      {translation.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#71717a', margin: 0 }}>
                      {translation.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    {plan.originalPrice ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '13px', color: '#9ca3af', textDecoration: 'line-through' }}>{plan.originalPrice} GEL</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '28px', fontWeight: 700, color: '#dc2626' }}>{plan.price}</span>
                          <span style={{ fontSize: '12px', color: '#71717a' }}>GEL/{getPeriodLabel(plan)}</span>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 700, color: '#dc2626' }}>{plan.price}</span>
                        <span style={{ fontSize: '12px', color: '#71717a' }}>GEL/{getPeriodLabel(plan)}</span>
                      </div>
                    )}
                  </div>

                  {/* Features List - all active features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', minHeight: '100px', flexGrow: 1 }}>
                    {features.length > 0 ? (
                      features.map((feature) => (
                        <li key={feature.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px' }}>
                          <svg width="14" height="14" fill="none" stroke="#dc2626" viewBox="0 0 24 24" style={{ marginTop: '2px', flexShrink: 0 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span style={{ fontSize: '12px', color: '#52525b', lineHeight: 1.4 }}>{getFeatureName(feature)}</span>
                        </li>
                      ))
                    ) : (
                      <li style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', padding: '20px 0' }}>
                        {labels.noFeatures}
                      </li>
                    )}
                  </ul>

                  {/* More Details Button */}
                  {hasDetails && (
                    <div style={{ borderTop: '1px solid #f4f4f5', paddingTop: '12px', marginBottom: '12px' }}>
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: 'none',
                          backgroundColor: '#eff6ff',
                          color: '#dc2626',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {labels.moreDetails}
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* CTA Button */}
                  <button
                    onClick={() => setOrderPlan({ id: plan.id, slug: plan.slug, name: translation.name, price: plan.price, period: plan.period })}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: plan.isFavorite ? '#dc2626' : '#f4f4f5',
                      color: plan.isFavorite ? 'white' : '#27272a',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: plan.isFavorite ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                    }}
                  >
                    {labels.order}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* See All Button */}
        <div className="text-center" style={{ marginTop: '40px' }}>
          <Link
            href={`/${locale}/insurance`}
            className="inline-flex items-center gap-2 bg-primary-blue hover:bg-primary-red-dark text-white py-3 px-8 rounded-full font-semibold transition-all duration-200 shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40"
          >
            {labels.seeAll}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-center" style={{ marginTop: '24px' }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full py-3 px-6 shadow-sm">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="text-zinc-600">{labels.needHelp}</span>
            <Link href={CONTACT.whatsapp} target="_blank" onClick={() => typeof window !== 'undefined' && (window as any).keitaro?.track({event:'whatsapp'})} className="text-primary-blue hover:underline font-semibold">
              {labels.writeUs}
            </Link>
          </div>
        </div>
      </div>

      {/* Details Modal - exactly like admin preview */}
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
                        backgroundColor: '#eff6ff', 
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
          planId={orderPlan.id}
          planName={orderPlan.name}
          planPrice={orderPlan.price}
          planPeriod={orderPlan.period}
          initialPromocode={promoFromUrl || undefined}
          locale={locale}
          dict={dict}
        />
      )}
    </section>
  );
}

export default function InsurancePlans({ locale, dict }: InsurancePlansProps) {
  return (
    <Suspense fallback={
      <section className="relative bg-zinc-50 py-16 lg:py-24 w-full overflow-hidden">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
        </div>
      </section>
    }>
      <InsurancePlansContent locale={locale} dict={dict} />
    </Suspense>
  );
}

