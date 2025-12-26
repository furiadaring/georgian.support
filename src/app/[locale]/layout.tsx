import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteMetadata } from "@/lib/metadata";
import { montserrat } from "@/lib/fonts";
import { getDictionary, isRtlLocale, locales } from "@/lib/i18n";
import CookieConsent from "@/components/ui/CookieConsent";
import ClickTracking from "@/components/ui/ClickTracking";
import TelegramChat from "@/components/ui/TelegramChat";
import "../globals.css";

type Locale = 'ru' | 'en' | 'ka' | 'uk' | 'tr' | 'he' | 'ar';

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  
  // Locale to OpenGraph locale mapping
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
    ...siteMetadata,
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://georgian.support/${locale}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `https://georgian.support/${loc}`])
      ),
    },
    openGraph: {
      type: 'website',
      locale: ogLocaleMap[locale] || 'en_US',
      url: `https://georgian.support/${locale}`,
      siteName: 'Georgian Support',
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        {
          url: `https://georgian.support/${locale}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`https://georgian.support/${locale}/twitter-image`],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1E3A8A",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const isRtl = isRtlLocale(locale);
  const dict = getDictionary(locale);
  
  return (
    <html 
      lang={locale} 
      dir={isRtl ? 'rtl' : 'ltr'} 
      className={montserrat.variable}
    >
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17722179248"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17722179248');
            
            // Google Ads conversion tracking for lead form submission
            function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                'send_to': 'AW-17722179248/KRKnCOCOwcIbELD9y4JC',
                'event_callback': callback
              });
              return false;
            }
          `}
        </Script>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className={`font-montserrat antialiased overflow-x-hidden w-full flex flex-col items-center ${isRtl ? 'rtl' : ''}`}>
        <ClickTracking />
        {children}
        <TelegramChat locale={locale} />
        <CookieConsent 
          title={dict.cookie.title}
          message={dict.cookie.message}
          learnMore={dict.cookie.learnMore}
          accept={dict.cookie.accept}
          decline={dict.cookie.decline}
        />
      </body>
    </html>
  );
}
