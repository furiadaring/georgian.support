import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  
  const ogLocaleMap: Record<string, string> = {
    ru: 'ru_RU',
    en: 'en_US',
    ka: 'ka_GE',
    uk: 'uk_UA',
    tr: 'tr_TR',
    he: 'he_IL',
    ar: 'ar_SA',
  };

  return {
    title: dict.autoInsurancePage?.meta?.title || 'MTPL Auto Insurance | Visit Georgia',
    description: dict.autoInsurancePage?.meta?.description || 'Mandatory third-party liability insurance for foreign vehicles in Georgia.',
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale] || 'en_US',
      url: `https://visitgeorgia.online/${locale}/auto-insurance`,
      siteName: 'Visit Georgia Insurance',
      title: dict.autoInsurancePage?.meta?.title || 'MTPL Auto Insurance | Visit Georgia',
      description: dict.autoInsurancePage?.meta?.description || 'Mandatory third-party liability insurance for foreign vehicles in Georgia.',
      images: [
        {
          url: 'https://visitgeorgia.online/opengraph-image',
          width: 1200,
          height: 630,
          alt: dict.autoInsurancePage?.meta?.title || 'MTPL Auto Insurance',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.autoInsurancePage?.meta?.title || 'MTPL Auto Insurance | Visit Georgia',
      description: dict.autoInsurancePage?.meta?.description || 'Mandatory third-party liability insurance for foreign vehicles in Georgia.',
      images: ['https://visitgeorgia.online/twitter-image'],
    },
  };
}

export default function AutoInsuranceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
