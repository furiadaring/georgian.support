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
        {/* Keitaro subid tracking - fills hidden field from URL */}
        <Script id="keitaro-subid" strategy="afterInteractive">
          {`
            (function () {
              var params = new URLSearchParams(window.location.search);
              var subid = params.get('subid') || '';
              
              // Save to localStorage for persistence
              if (subid) {
                try { localStorage.setItem('kt_subid', subid); } catch(e) {}
              } else {
                try { subid = localStorage.getItem('kt_subid') || ''; } catch(e) {}
              }
              
              // Fill all subid inputs
              function fillSubid() {
                var input = document.getElementById('kt_subid');
                if (input) input.value = subid;
                document.querySelectorAll('input[name="subid"]').forEach(function(i) {
                  i.value = subid;
                });
              }
              
              fillSubid();
              console.log('Keitaro subid:', subid);
              
              // Keep filling while modals open
              setInterval(fillSubid, 500);
            })();
          `}
        </Script>
        
        {/* Keitaro conversion tracking - postback on success/clicks */}
        <Script id="keitaro-conversion" strategy="afterInteractive">
          {`
            (function () {
              function getSubid() {
                var input = document.getElementById('kt_subid');
                if (input && input.value) return input.value;
                try { return localStorage.getItem('kt_subid') || ''; } catch(e) { return ''; }
              }
              
              function sendPostback(status) {
                var subid = getSubid();
                if (!subid) return;
                fetch('https://track.georgian.support/postback?subid=' + encodeURIComponent(subid) + '&status=' + status);
                console.log('Keitaro postback sent:', status);
              }
              
              // WhatsApp / Telegram click tracking
              document.addEventListener('click', function (e) {
                var a = e.target.closest && e.target.closest('a');
                if (!a) return;
                var href = (a.getAttribute('href') || '').trim();
                if (href.startsWith('https://wa.me/') || href.startsWith('https://api.whatsapp.com/') || href.startsWith('whatsapp://')) {
                  sendPostback('whatsapp');
                  return;
                }
                if (href.startsWith('https://t.me/') || href.startsWith('tg://')) {
                  sendPostback('telegram');
                }
              }, true);
              
              // Form success detection - send lead on "спасибо" / "thank" / success message
              var leadSent = false;
              var observer = new MutationObserver(function () {
                if (leadSent) return;
                var bodyText = document.body.innerText.toLowerCase();
                // Check for success indicators
                if (bodyText.includes('спасибо') || bodyText.includes('thank') || 
                    document.querySelector('.bg-green-50.text-green-700') ||
                    document.querySelector('[class*="success"]')) {
                  leadSent = true;
                  sendPostback('lead');
                }
              });
              observer.observe(document.body, { childList: true, subtree: true });
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
