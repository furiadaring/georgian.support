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
    title: dict.insurancePage?.meta?.title || 'Health Insurance Plans | Visit Georgia',
    description: dict.insurancePage?.meta?.description || 'Medical insurance for tourists and expats in Georgia.',
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale] || 'en_US',
      url: `https://visitgeorgia.online/${locale}/insurance`,
      siteName: 'Visit Georgia Insurance',
      title: dict.insurancePage?.meta?.title || 'Health Insurance Plans | Visit Georgia',
      description: dict.insurancePage?.meta?.description || 'Medical insurance for tourists and expats in Georgia.',
      images: [
        {
          url: 'https://visitgeorgia.online/opengraph-image',
          width: 1200,
          height: 630,
          alt: dict.insurancePage?.meta?.title || 'Health Insurance Plans',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.insurancePage?.meta?.title || 'Health Insurance Plans | Visit Georgia',
      description: dict.insurancePage?.meta?.description || 'Medical insurance for tourists and expats in Georgia.',
      images: ['https://visitgeorgia.online/twitter-image'],
    },
  };
}

export default function InsuranceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
