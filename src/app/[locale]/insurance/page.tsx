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
  pricingType: "per_day" | "per_month" | "per_3_months" | "per_6_months" | "per_year" | "fixed";
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
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      );
    case "emergency":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "hospital":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "ambulance":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "dental":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "plane":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    case "shield":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "heart":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "home":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "dollar":
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" fill="none" stroke="#DE643B" viewBox="0 0 24 24">
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

  // Category filter labels
  const categoryLabels: Record<string, Record<Locale, string>> = {
    tourist: {
      ru: 'Туристическая страховка',
      en: 'Tourist Insurance',
      ka: 'ტურისტული დაზღვევა',
      uk: 'Туристична страховка',
      tr: 'Turist Sigortası',
      he: 'ביטוח תיירים',
      ar: 'تأمين السياح',
    },
    medical: {
      ru: 'Медицинская страховка',
      en: 'Medical Insurance',
      ka: 'სამედიცინო დაზღვევა',
      uk: 'Медична страховка',
      tr: 'Sağlık Sigortası',
      he: 'ביטוח רפואי',
      ar: 'التأمين الطبي',
    },
    auto: {
      ru: 'Автостраховка',
      en: 'Auto Insurance',
      ka: 'ავტო დაზღვევა',
      uk: 'Автострахування',
      tr: 'Kasko Sigortası',
      he: 'ביטוח רכב',
      ar: 'تأمين السيارات',
    },
  };

  // Breadcrumb labels
  const breadcrumbLabels: Record<string, Record<Locale, string>> = {
    home: {
      ru: 'Главная',
      en: 'Home',
      ka: 'მთავარი',
      uk: 'Головна',
      tr: 'Ana Sayfa',
      he: 'בית',
      ar: 'الرئيسية',
    },
    insurance: {
      ru: 'Страховки',
      en: 'Insurance',
      ka: 'დაზღვევა',
      uk: 'Страховки',
      tr: 'Sigorta',
      he: 'ביטוח',
      ar: 'التأمين',
    },
  };

  // Title parts
  const titleParts: Record<string, Record<Locale, string>> = {
    all: {
      ru: 'Все ',
      en: 'All ',
      ka: 'ყველა ',
      uk: 'Всі ',
      tr: 'Tüm ',
      he: 'כל ',
      ar: 'جميع ',
    },
    insurance: {
      ru: 'страховые',
      en: 'insurance',
      ka: 'სადაზღვეო',
      uk: 'страхові',
      tr: 'sigorta',
      he: 'הביטוח',
      ar: 'التأمين',
    },
    plans: {
      ru: ' планы',
      en: ' plans',
      ka: ' გეგმები',
      uk: ' плани',
      tr: ' planları',
      he: ' תוכניות',
      ar: ' خطط',
    },
  };

  return (
    <div className="w-full flex flex-col bg-[#FAFAFA]">
      <Header locale={locale} dict={dict} darkText={true} />
      <main className="main-content w-full flex flex-col items-center" style={{ paddingTop: '90px' }}>
        {/* Plans Section */}
        <section className="w-full bg-[#F4F3EE]" style={{ paddingTop: '50px', paddingBottom: '80px' }}>
          <div className="px-[20px] lg:px-[310px]" style={{ maxWidth: '1920px', marginLeft: 'auto', marginRight: 'auto' }}>
            {/* Title Section */}
            <div className="flex flex-col" style={{ gap: '20px', marginBottom: '40px' }}>
              {/* Breadcrumb */}
              <div className="font-medium text-[16px]" style={{ lineHeight: 1.3 }}>
                <Link href={`/${locale}`} className="text-[#ABA2A5] hover:text-[#2D1D38] transition-colors">
                  {breadcrumbLabels.home[locale]}
                </Link>
                <span className="text-[#2D1D38]"> / {breadcrumbLabels.insurance[locale]}</span>
              </div>
              
              {/* Main Title */}
              <h1 className="font-bold text-[#2D1D38] text-[34px] md:text-[55px] leading-[1.3] md:leading-[0.9]">
                {titleParts.all[locale]}
                <span className="text-[#DE643B]">{titleParts.insurance[locale]}</span>
                {titleParts.plans[locale]}
              </h1>
            </div>

            {/* Category Filters */}
            <div className="flex flex-col lg:flex-row lg:flex-wrap" style={{ gap: '20px', marginBottom: '40px' }}>
              <button
                onClick={() => setActiveCategory("main")}
                className={`font-medium text-[16px] transition-all duration-200 w-full lg:w-auto ${
                  activeCategory === "main"
                    ? "bg-[#E6CFE3] text-[#2D1D38]"
                    : "bg-transparent border border-[#E6CFE3] text-[#ABA2A5] hover:text-[#2D1D38]"
                }`}
                style={{ padding: '15px 25px', lineHeight: 1.3 }}
              >
                {categoryLabels.tourist[locale]}
              </button>
              <button
                onClick={() => setActiveCategory("longterm")}
                className={`font-medium text-[16px] transition-all duration-200 w-full lg:w-auto ${
                  activeCategory === "longterm"
                    ? "bg-[#E6CFE3] text-[#2D1D38]"
                    : "bg-transparent border border-[#E6CFE3] text-[#ABA2A5] hover:text-[#2D1D38]"
                }`}
                style={{ padding: '15px 25px', lineHeight: 1.3 }}
              >
                {categoryLabels.medical[locale]}
              </button>
              <Link
                href={`/${locale}/auto-insurance`}
                className="font-medium text-[16px] bg-transparent border border-[#E6CFE3] text-[#ABA2A5] hover:text-[#2D1D38] transition-all duration-200 w-full lg:w-auto text-center"
                style={{ padding: '15px 25px', lineHeight: 1.3 }}
              >
                {categoryLabels.auto[locale]}
              </Link>
            </div>

            {/* Plans Grid */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DE643B]"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '20px' }}>
                {filteredPlans.map((plan) => {
                  const translation = getPlanTranslation(plan);
                  const features = plan.features || [];
                  const hasDetails = features.length > 0 || (plan.coverageItems && plan.coverageItems.length > 0);

                  return (
                    <div
                      key={plan.id}
                      className={`flex flex-col ${
                        plan.isFavorite
                          ? "border-2 border-[#2D1D38] rounded-[24px]"
                          : "bg-[#2D1D38] rounded-[16px]"
                      }`}
                    >
                      {/* Favorite Badge */}
                      {plan.isFavorite && (
                        <div 
                          className="bg-[#2D1D38] flex items-center justify-center rounded-tl-[24px] rounded-tr-[24px]"
                          style={{ padding: '8px 0' }}
                        >
                          <span className="font-medium text-[16px] text-[#FAFAFA]" style={{ lineHeight: 1.3 }}>
                            {labels.recommend.replace('★ ', '')}
                          </span>
                        </div>
                      )}
                      
                      {/* Card Content */}
                      <div 
                        className={`bg-[#FAFAFA] flex flex-col h-full ${
                          plan.isFavorite 
                            ? "rounded-bl-[24px] rounded-br-[24px]" 
                            : "rounded-[16px]"
                        }`}
                        style={{ padding: '20px 20px 25px', gap: '25px' }}
                      >
                        {/* Title Section */}
                        <div className="flex flex-col" style={{ gap: '25px' }}>
                          {/* Plan Info */}
                          <div className="flex flex-col" style={{ gap: '15px' }}>
                            {/* Plan Name */}
                            <h3 className="font-bold text-[34px] text-[#2D1D38]" style={{ lineHeight: 1.3 }}>
                              {translation.name}
                            </h3>
                            
                            {/* Subtitle */}
                            <p 
                              className="font-medium text-[16px] text-[#2D1D38]"
                              style={{ lineHeight: 1.3, height: '45px' }}
                            >
                              {translation.subtitle}
                            </p>
                            
                            {/* Legal Badge */}
                            {plan.isLegalCompliant && (
                              <div 
                                className="inline-flex items-center bg-[#F4EFF3] rounded-full self-start"
                                style={{ gap: '5px', padding: '5px 10px 5px 8px' }}
                              >
                                {/* Checkmark Icon */}
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM10.5303 5.53033L6.53033 9.53033C6.23744 9.82322 5.76256 9.82322 5.46967 9.53033L3.46967 7.53033C3.17678 7.23744 3.17678 6.76256 3.46967 6.46967C3.76256 6.17678 4.23744 6.17678 4.53033 6.46967L6 7.93934L9.46967 4.46967C9.76256 4.17678 10.2374 4.17678 10.5303 4.46967C10.8232 4.76256 10.8232 5.23744 10.5303 5.53033Z" fill="#2D1D38"/>
                                </svg>
                                <span className="font-semibold text-[14px] text-[#2D1D38]" style={{ lineHeight: 1.3 }}>
                                  {labels.legalBadge}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Price */}
                          <div className="flex flex-col">
                            {plan.originalPrice && (
                              <span className="font-medium text-[16px] text-[#ABA2A5] line-through" style={{ lineHeight: 1.3 }}>
                                {plan.originalPrice} GEL
                              </span>
                            )}
                            <div className="flex items-center" style={{ gap: '10px' }}>
                              <span className="font-bold text-[34px] text-[#2D1D38]" style={{ lineHeight: 1.3 }}>
                                {plan.price} GEL
                              </span>
                              <span className="font-medium text-[18px] text-[#ABA2A5]" style={{ lineHeight: 1.3 }}>
                                /{getPeriodLabel(plan)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Buttons */}
                        <div className="flex flex-col items-center" style={{ gap: '15px' }}>
                          <button
                            onClick={() => setOrderPlan({ id: plan.id, slug: plan.slug, name: translation.name, price: plan.price, period: plan.period })}
                            className={`w-full flex items-center justify-center h-[48px] rounded-full font-medium text-[16px] transition-colors duration-200 ${
                              plan.isFavorite
                                ? "bg-[#DE643B] text-[#FAFAFA] hover:bg-[#c9572f]"
                                : "bg-transparent border border-[#DE643B] text-[#DE643B] hover:bg-[#DE643B] hover:text-[#FAFAFA]"
                            }`}
                            style={{ lineHeight: 1.3 }}
                          >
                            {labels.order}
                          </button>
                          
                          {hasDetails && (
                            <button
                              onClick={() => setSelectedPlan(plan)}
                              className="font-medium text-[16px] text-[#ABA2A5] underline hover:text-[#2D1D38] transition-colors"
                              style={{ lineHeight: 1.3 }}
                            >
                              {labels.moreDetails}
                            </button>
                          )}
                        </div>
                        
                        {/* Features */}
                        {features.length > 0 && (
                          <div className="flex flex-col" style={{ gap: '6px' }}>
                            {features.slice(0, 6).map((feature, index) => (
                              <div key={feature.id} className="flex items-start" style={{ gap: '10px' }}>
                                {index === 0 ? (
                                  /* Phone/Support icon for first feature */
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                                    <path d="M18.3333 14.1V16.6C18.3343 16.8321 18.2867 17.0618 18.1937 17.2745C18.1008 17.4871 17.9644 17.678 17.7934 17.8349C17.6224 17.9918 17.4205 18.1112 17.2006 18.1856C16.9808 18.26 16.7478 18.2876 16.5167 18.2667C13.9523 17.988 11.4892 17.1118 9.32499 15.7083C7.31151 14.4289 5.60443 12.7218 4.32499 10.7083C2.91663 8.53435 2.04019 6.05917 1.76665 3.48333C1.74583 3.2529 1.77321 3.02063 1.84707 2.80133C1.92092 2.58203 2.03963 2.38058 2.19562 2.20971C2.35162 2.03884 2.54152 1.90229 2.75314 1.80878C2.96476 1.71527 3.19348 1.66688 3.42499 1.66666H5.92499C6.32953 1.66273 6.72147 1.80591 7.02812 2.06962C7.33478 2.33333 7.53505 2.69954 7.59165 3.1C7.69721 3.90006 7.89286 4.68562 8.17499 5.44166C8.28708 5.73996 8.31137 6.06447 8.24498 6.37581C8.1786 6.68715 8.02434 6.97278 7.79999 7.2L6.74165 8.25833C7.92795 10.3446 9.65539 12.0721 11.7417 13.2583L12.8 12.2C13.0272 11.9757 13.3128 11.8214 13.6242 11.755C13.9355 11.6886 14.26 11.7129 14.5583 11.825C15.3144 12.1071 16.0999 12.3028 16.9 12.4083C17.3048 12.4655 17.6745 12.6694 17.9388 12.9813C18.203 13.2932 18.3434 13.6914 18.3333 14.1Z" stroke="#DE643B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                ) : (
                                  /* Checkmark icon for other features */
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                                    <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="#DE643B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                                <span className="font-medium text-[16px] text-[#776667] flex-1" style={{ lineHeight: 1.3 }}>
                                  {getFeatureName(feature)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
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

      {/* Details Modal */}
      {selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(45, 29, 56, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
        }}>
          <div style={{
            backgroundColor: '#FAFAFA',
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
              borderBottom: '1px solid #E6CFE3',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#2D1D38' }}>
                  {getPlanTranslation(selectedPlan).name}
                </h3>
                <p style={{ margin: '16px 0 0', fontSize: '14px', color: '#776667', lineHeight: 1.6 }}>
                  {getPlanTranslation(selectedPlan).description || getPlanTranslation(selectedPlan).subtitle || ""}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#ABA2A5', fontSize: '24px', marginLeft: '16px' }}
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
              <p style={{ fontSize: '12px', color: '#DE643B', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '20px' }}>
                {labels.coverage}
              </p>

              {/* Coverage Grid */}
              {selectedPlan.coverageItems && selectedPlan.coverageItems.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                  {selectedPlan.coverageItems.map((item) => (
                    <div key={item.id} style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #E6CFE3',
                      backgroundColor: '#F4F3EE',
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#E6CFE3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '12px',
                      }}>
                        <CoverageIcon icon={item.icon} />
                      </div>
                      <div style={{ fontSize: '13px', color: '#2D1D38', marginBottom: '6px', lineHeight: 1.4 }}>
                        {getCoverageTitle(item)}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#DE643B' }}>
                        {getCoverageLimit(item)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#ABA2A5', padding: '40px 0' }}>
                  {labels.noCoverage}
                </p>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E6CFE3' }}>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '1000px',
                  border: 'none',
                  backgroundColor: '#2D1D38',
                  color: '#FAFAFA',
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
          initialPromocode={searchParams.get('promo') || undefined}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DE643B]"></div></div>}>
      <InsurancePageContent locale={locale} dict={dict} />
    </Suspense>
  );
}

