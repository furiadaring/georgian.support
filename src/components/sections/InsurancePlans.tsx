"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CONTACT, trackKeitaro } from "@/lib/constants";
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
      ru: 'Фаворит',
      en: 'Favorite',
      ka: 'ფავორიტი',
      uk: 'Фаворит',
      tr: 'Favori',
      he: 'מועדף',
      ar: 'المفضل',
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
      ru: 'Смотреть все виды страхования',
      en: 'See all insurance types',
      ka: 'ყველა სახის დაზღვევა',
      uk: 'Дивитися всі види страхування',
      tr: 'Tüm sigorta türlerini görün',
      he: 'צפו בכל סוגי הביטוח',
      ar: 'عرض جميع أنواع التأمين',
    },
    needHelp: {
      ru: 'Сомневаетесь, какая страховка подойдёт именно вам?',
      en: 'Not sure which insurance plan is right for you?',
      ka: 'არ იცით, რომელი დაზღვევა მოგერგებათ?',
      uk: 'Сумніваєтесь, яка страховка підійде саме вам?',
      tr: 'Hangi sigortanın size uygun olduğundan emin değil misiniz?',
      he: 'לא בטוחים איזה ביטוח מתאים לכם?',
      ar: 'هل تشك في أي تأمين يناسبك؟',
    },
    writeUs: {
      ru: 'Обратитесь к нам',
      en: 'Contact us',
      ka: 'დაგვიკავშირდით',
      uk: 'Зверніться до нас',
      tr: 'Bize ulaşın',
      he: 'פנו אלינו',
      ar: 'تواصل معنا',
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
    <section id="insurance" aria-labelledby="insurance-heading" className="relative bg-[#FAFAFA] w-full">
      {/* ===== DESKTOP ===== */}
      <div
        className="hidden lg:flex flex-col max-w-[1920px] mx-auto px-10 xl:px-20 2xl:px-32 3xl:px-[310px]"
        style={{ paddingTop: 80, paddingBottom: 80, gap: 40 }}
      >
        {/* Header - centered */}
        <div className="flex flex-col items-center text-center" style={{ gap: 20 }}>
          <span className="font-medium text-[#ABA2A5]" style={{ fontSize: 18, lineHeight: 1.3 }}>
            {t.label}
          </span>
          <h2
            id="insurance-heading"
            className="font-bold text-[#2D1D38]"
            style={{ fontSize: 55, lineHeight: 0.9 }}
          >
            {t.title} <span style={{ color: '#DE643B' }}>{t.titleHighlight}</span> {t.titleEnd}
          </h2>
          <p
            className="font-medium text-[#776667]"
            style={{ fontSize: 16, lineHeight: 1.3, maxWidth: 485 }}
          >
            {t.description}
          </p>
        </div>

        {/* Plans Row - 6 columns */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-b-2 border-[#DE643B]" style={{ borderRadius: '50%' }}></div>
          </div>
        ) : (
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 20 }}>
          {plans.map((plan) => {
            const translation = getPlanTranslation(plan);
            const features = plan.features || [];
            const hasDetails = features.length > 0 || (plan.coverageItems && plan.coverageItems.length > 0);

            return (
              <div
                key={plan.id}
                style={{
                  flex: '1 1 0',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: plan.isFavorite ? 16 : 12,
                  border: plan.isFavorite ? '2px solid #2D1D38' : '1px solid #E5E5E5',
                  overflow: 'hidden',
                  backgroundColor: '#FAFAFA',
                }}
              >
                {/* Favorite Badge - fixed height placeholder */}
                <div style={{ height: plan.isFavorite ? 'auto' : 0, minHeight: plan.isFavorite ? 24 : 0 }}>
                  {plan.isFavorite && (
                    <div style={{ textAlign: 'center', color: '#FAFAFA', fontWeight: 600, fontSize: 12, backgroundColor: '#2D1D38', padding: '4px 8px', lineHeight: 1.3 }}>
                      {labels.recommend}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '10px 15px 20px 15px', flex: 1 }}>
                  {/* SECTION 1: Title block */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 15, width: '100%', alignItems: 'center', textAlign: 'center' }}>
                    {/* Name - single line, fixed height, centered */}
                    <h3 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.2, color: '#2D1D38', height: 26, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%' }}>
                      {translation.name}
                    </h3>
                    
                    {/* Subtitle - single line, fixed height, centered */}
                    <p style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4, color: '#2D1D38', height: 17, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%' }}>
                      {translation.subtitle}
                    </p>
                    
                    {/* Legal badge - fixed height placeholder, centered */}
                    <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {plan.isLegalCompliant && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: '#F4EFF3', borderRadius: 1000, paddingLeft: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 5 }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M4 7L6 9L10 5" stroke="#DE643B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 10, color: '#2D1D38', whiteSpace: 'nowrap' }}>{labels.legalBadge}</span>
                        </div>
                      )}
                    </div>

                    {/* Price section - fixed heights, centered */}
                    <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 600, alignItems: 'center' }}>
                      {/* Original price - fixed height */}
                      <div style={{ height: 16 }}>
                        {plan.originalPrice && (
                          <span style={{ fontSize: 12, color: '#ABA2A5', textDecoration: 'line-through', lineHeight: 1.3 }}>{plan.originalPrice} GEL</span>
                        )}
                      </div>
                      {/* Current price - always on one line */}
                      <div style={{ display: 'flex', gap: 3, alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3, color: '#2D1D38' }}>{plan.price}</span>
                        <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: '#2D1D38' }}>GEL</span>
                        <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3, color: '#ABA2A5' }}>/{getPeriodLabel(plan)}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Buttons - fixed heights */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center' }}>
                    <button
                      onClick={() => setOrderPlan({ id: plan.id, slug: plan.slug, name: translation.name, price: plan.price, period: plan.period })}
                      className="cursor-pointer"
                      style={{
                        width: '100%',
                        height: 40,
                        padding: '10px 30px',
                        border: plan.isFavorite ? 'none' : '1px solid #DE643B',
                        backgroundColor: plan.isFavorite ? '#DE643B' : 'transparent',
                        color: plan.isFavorite ? '#FAFAFA' : '#DE643B',
                        borderRadius: 1000,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {labels.order}
                    </button>
                    {/* More details - fixed height */}
                    <div style={{ height: 20 }}>
                      {hasDetails && (
                        <button
                          onClick={() => setSelectedPlan(plan)}
                          className="cursor-pointer"
                          style={{ fontSize: 12, fontWeight: 600, padding: 0, background: 'transparent', border: 'none', color: '#ABA2A5', textDecoration: 'underline', lineHeight: 1.3 }}
                        >
                          {labels.moreDetails}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* SECTION 3: Features - takes remaining space */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #E5E5E5', paddingTop: 12, flex: 1 }}>
                    {features.length > 0 ? (
                      features.slice(0, 6).map((feature) => (
                        <div key={feature.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                            <path d="M3.5 7L5.5 9L10.5 4" stroke="#DE643B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 12, lineHeight: 1.3, color: '#776667' }}>{getFeatureName(feature)}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 12, color: '#ABA2A5', textAlign: 'center', padding: '12px 0' }}>
                        {labels.noFeatures}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* See All Link */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href={`/${locale}/insurance`}
            style={{ fontSize: 16, color: '#776667', textDecoration: 'underline', fontWeight: 500, lineHeight: 1.3 }}
          >
            {t.seeAll || labels.seeAll}
          </Link>
        </div>

        {/* Help Banner */}
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E6CFE3', borderRadius: 20, padding: '25px 40px', maxWidth: 731, width: '100%', marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            {/* WhatsApp Icon */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
              <path d="M18 0C8.059 0 0 8.059 0 18c0 3.183.832 6.167 2.281 8.757L.082 36l9.486-2.137A17.9 17.9 0 0018 36c9.941 0 18-8.059 18-18S27.941 0 18 0zm0 33.012A14.96 14.96 0 019.93 30.48l-.356-.213-5.376 1.41 1.434-5.244-.234-.372A14.94 14.94 0 013.012 18c0-8.271 6.717-14.988 14.988-14.988S33.012 9.729 33.012 18 26.271 33.012 18 33.012zm8.226-11.222c-.45-.225-2.67-1.317-3.084-1.467-.414-.15-.716-.225-1.017.225-.3.45-1.166 1.467-1.43 1.768-.264.3-.528.338-.978.113-.45-.225-1.9-.7-3.618-2.232-1.338-1.194-2.241-2.667-2.504-3.117-.264-.45-.029-.693.198-.918.204-.201.45-.526.675-.789.225-.264.3-.45.45-.75.15-.3.075-.563-.038-.789-.112-.225-1.017-2.452-1.392-3.352-.375-.9-.75-.75-1.017-.75-.264-.012-.564-.015-.864-.015s-.789.112-1.202.563c-.414.45-1.577 1.541-1.577 3.76s1.614 4.36 1.839 4.66c.225.3 3.176 4.852 7.695 6.804 1.076.464 1.915.741 2.57.948 1.08.344 2.063.296 2.84.18.866-.13 2.67-1.092 3.046-2.146.377-1.054.377-1.96.264-2.146-.113-.188-.414-.3-.864-.526z" fill="#25D366"/>
            </svg>
            <span style={{ fontWeight: 500, color: '#2D1D38', fontSize: 18, lineHeight: 1.3, maxWidth: 310 }}>
              {labels.needHelp}
            </span>
          </div>
          <Link
            href={CONTACT.whatsapp}
            target="_blank"
            onClick={() => trackKeitaro('whatsapp')}
            style={{ display: 'flex', alignItems: 'center', flexShrink: 0, fontWeight: 500, color: '#FAFAFA', backgroundColor: '#DE643B', borderRadius: 1000, paddingLeft: 30, paddingRight: 5, paddingTop: 5, paddingBottom: 5, fontSize: 18, gap: 20, textDecoration: 'none', lineHeight: 1.3 }}
          >
            {labels.writeUs}
            <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div
        className="flex lg:hidden flex-col"
        style={{ padding: '40px 20px', gap: 30 }}
      >
        {/* Header - centered */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const, gap: 15 }}>
          <span style={{ fontWeight: 500, color: '#ABA2A5', fontSize: 16, lineHeight: 1.3 }}>
            {t.label}
          </span>
          <h2
            style={{ fontWeight: 700, color: '#2D1D38', fontSize: 34, lineHeight: 1.3 }}
          >
            {t.title} <span style={{ color: '#DE643B' }}>{t.titleHighlight}</span> {t.titleEnd}
          </h2>
          <p
            style={{ fontWeight: 500, color: '#776667', fontSize: 14, lineHeight: 1.3 }}
          >
            {t.description}
          </p>
        </div>

        {/* Plans stacked */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-10 w-10 border-b-2 border-[#DE643B]" style={{ borderRadius: '50%' }}></div>
          </div>
        ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {plans.map((plan) => {
            const translation = getPlanTranslation(plan);
            const features = plan.features || [];
            const hasDetails = features.length > 0 || (plan.coverageItems && plan.coverageItems.length > 0);

            return (
              <div
                key={plan.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: plan.isFavorite ? 24 : 20,
                  border: plan.isFavorite ? '2px solid #2D1D38' : '1px solid #E5E5E5',
                  overflow: 'hidden',
                  backgroundColor: '#FAFAFA',
                }}
              >
                {/* Favorite Badge */}
                {plan.isFavorite && (
                  <div style={{ textAlign: 'center', color: '#FAFAFA', fontWeight: 500, fontSize: 16, backgroundColor: '#2D1D38', padding: '8px 0', lineHeight: 1.3 }}>
                    {labels.recommend}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 20px 25px 20px' }}>
                  {/* SECTION 1: Title block */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 25, width: '100%' }}>
                    {/* Name + Subtitle + Legal badge */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                      <h3 style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.3, color: '#2D1D38' }}>
                        {translation.name}
                      </h3>
                      <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, color: '#2D1D38', height: 45 }}>
                        {translation.subtitle}
                      </p>
                      {plan.isLegalCompliant && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, backgroundColor: '#F4EFF3', borderRadius: 1000, paddingLeft: 8, paddingRight: 10, paddingTop: 5, paddingBottom: 5, alignSelf: 'flex-start' }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                            <path d="M4 7L6 9L10 5" stroke="#DE643B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#2D1D38', whiteSpace: 'nowrap' }}>{labels.legalBadge}</span>
                        </div>
                      )}
                    </div>
                    {/* Price */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {plan.originalPrice && (
                        <span style={{ fontSize: 16, fontWeight: 500, color: '#ABA2A5', textDecoration: 'line-through', lineHeight: 1.3 }}>{plan.originalPrice} GEL</span>
                      )}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.3, color: '#2D1D38' }}>{plan.price} GEL</span>
                        <span style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, color: '#ABA2A5' }}>/{getPeriodLabel(plan)}</span>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 15, alignItems: 'center' }}>
                    <button
                      onClick={() => setOrderPlan({ id: plan.id, slug: plan.slug, name: translation.name, price: plan.price, period: plan.period })}
                      className="cursor-pointer"
                      style={{
                        width: '100%',
                        height: 48,
                        padding: '10px 30px',
                        border: plan.isFavorite ? 'none' : '1px solid #DE643B',
                        backgroundColor: plan.isFavorite ? '#DE643B' : 'transparent',
                        color: plan.isFavorite ? '#FAFAFA' : '#DE643B',
                        borderRadius: 1000,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {labels.order}
                    </button>
                    {hasDetails && (
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="cursor-pointer"
                        style={{ fontSize: 16, fontWeight: 500, padding: 0, background: 'transparent', border: 'none', color: '#ABA2A5', textDecoration: 'underline', lineHeight: 1.3 }}
                      >
                        {labels.moreDetails}
                      </button>
                    )}
                  </div>

                  {/* SECTION 3: Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #E5E5E5', paddingTop: 12 }}>
                    {features.length > 0 ? (
                      features.map((feature) => (
                        <div key={feature.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                            <path d="M4.5 10L8 13.5L15.5 6" stroke="#DE643B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, color: '#776667' }}>{getFeatureName(feature)}</span>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: 14, color: '#ABA2A5', textAlign: 'center', padding: '12px 0' }}>
                        {labels.noFeatures}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}

        {/* See All Link */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link
            href={`/${locale}/insurance`}
            style={{ fontSize: 16, color: '#776667', textDecoration: 'underline', fontWeight: 500, lineHeight: 1.3 }}
          >
            {t.seeAll || labels.seeAll}
          </Link>
        </div>

        {/* Help Banner */}
        <div
          style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#E6CFE3', borderRadius: 20, padding: '25px 20px', gap: 15, marginLeft: 10, marginRight: 10 }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 15 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0, marginTop: 4 }}>
              <path d="M18 0C8.059 0 0 8.059 0 18c0 3.183.832 6.167 2.281 8.757L.082 36l9.486-2.137A17.9 17.9 0 0018 36c9.941 0 18-8.059 18-18S27.941 0 18 0zm0 33.012A14.96 14.96 0 019.93 30.48l-.356-.213-5.376 1.41 1.434-5.244-.234-.372A14.94 14.94 0 013.012 18c0-8.271 6.717-14.988 14.988-14.988S33.012 9.729 33.012 18 26.271 33.012 18 33.012zm8.226-11.222c-.45-.225-2.67-1.317-3.084-1.467-.414-.15-.716-.225-1.017.225-.3.45-1.166 1.467-1.43 1.768-.264.3-.528.338-.978.113-.45-.225-1.9-.7-3.618-2.232-1.338-1.194-2.241-2.667-2.504-3.117-.264-.45-.029-.693.198-.918.204-.201.45-.526.675-.789.225-.264.3-.45.45-.75.15-.3.075-.563-.038-.789-.112-.225-1.017-2.452-1.392-3.352-.375-.9-.75-.75-1.017-.75-.264-.012-.564-.015-.864-.015s-.789.112-1.202.563c-.414.45-1.577 1.541-1.577 3.76s1.614 4.36 1.839 4.66c.225.3 3.176 4.852 7.695 6.804 1.076.464 1.915.741 2.57.948 1.08.344 2.063.296 2.84.18.866-.13 2.67-1.092 3.046-2.146.377-1.054.377-1.96.264-2.146-.113-.188-.414-.3-.864-.526z" fill="#25D366"/>
            </svg>
            <span style={{ fontWeight: 500, color: '#2D1D38', fontSize: 16, lineHeight: 1.3 }}>
              {labels.needHelp}
            </span>
          </div>
          <Link
            href={CONTACT.whatsapp}
            target="_blank"
            onClick={() => trackKeitaro('whatsapp')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#FAFAFA', backgroundColor: '#DE643B', borderRadius: 1000, paddingLeft: 30, paddingRight: 5, paddingTop: 5, paddingBottom: 5, fontSize: 18, gap: 20, textDecoration: 'none', width: '100%', lineHeight: 1.3 }}
          >
            {labels.writeUs}
            <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Details Modal */}
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
            borderRadius: 0,
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
              borderBottom: '1px solid #E5E5E5',
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
                      border: '1px solid #E5E5E5',
                      backgroundColor: '#FAFAFA',
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
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
            <div style={{ padding: '16px 24px', borderTop: '1px solid #E5E5E5' }}>
              <button
                onClick={() => setSelectedPlan(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E5E5E5',
                  backgroundColor: '#FAFAFA',
                  color: '#2D1D38',
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
      <section className="relative bg-[#FAFAFA] py-16 lg:py-24 w-full">
        <div className="flex justify-center py-12">
          <div className="animate-spin h-12 w-12 border-b-2 border-[#DE643B]" style={{ borderRadius: '50%' }}></div>
        </div>
      </section>
    }>
      <InsurancePlansContent locale={locale} dict={dict} />
    </Suspense>
  );
}

