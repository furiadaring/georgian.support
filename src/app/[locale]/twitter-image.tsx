import { ImageResponse } from "next/og";
import { type Locale } from "@/lib/i18n/config";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Font URLs for different scripts (TTF format required by @vercel/og)
const fontUrls: Record<string, string> = {
  // Noto Sans for Latin, Cyrillic (Bold 700)
  default: "https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9d.ttf",
  // Noto Sans Georgian (Bold 700)
  ka: "https://fonts.gstatic.com/s/notosansgeorgian/v48/PlIaFke5O6RzLfvNNVSitxkr76PRHBC4Ytyq-Gof7PUs4S7zWn-8YDB09HFNdpsAy1j-.ttf",
  // Noto Sans Hebrew (Bold 700)
  he: "https://fonts.gstatic.com/s/notosanshebrew/v50/or3HQ7v33eiDljA1IufXTtVf7V6RvEEdhQlk0LlGxCyaeNKYZC0sqk3xXGiXkI2tog.ttf",
  // IBM Plex Sans Arabic (Bold 700) - better Satori compatibility
  ar: "https://fonts.gstatic.com/s/ibmplexsansarabic/v14/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YOG-dCT.ttf",
};

// Localized content for Twitter images
const twitterContent: Record<Locale, { alt: string; tagline: string; description: string }> = {
  ru: {
    alt: "Georgian Support — Медицинское страхование в Грузии",
    tagline: "Страхование в Грузии",
    description: "Медицинская страховка для туристов и экспатов • от 4 GEL/день",
  },
  en: {
    alt: "Georgian Support — Medical Insurance in Georgia",
    tagline: "Insurance in Georgia",
    description: "Medical insurance for tourists and expats • from 4 GEL/day",
  },
  ka: {
    alt: "Georgian Support — სამედიცინო დაზღვევა საქართველოში",
    tagline: "დაზღვევა საქართველოში",
    description: "სამედიცინო დაზღვევა ტურისტებისა და ექსპატებისთვის • 4 GEL/დღე-დან",
  },
  uk: {
    alt: "Georgian Support — Медичне страхування в Грузії",
    tagline: "Страхування в Грузії",
    description: "Медичне страхування для туристів та експатів • від 4 GEL/день",
  },
  tr: {
    alt: "Georgian Support — Gürcistan'da Sağlık Sigortası",
    tagline: "Gürcistan'da Sigorta",
    description: "Turistler ve gurbetçiler için sağlık sigortası • günlük 4 GEL'den",
  },
  he: {
    alt: "Georgian Support — ביטוח רפואי בגאורגיה",
    tagline: "ביטוח בגאורגיה",
    description: "ביטוח רפואי לתיירים ולמתיישבים • החל מ-4 GEL/יום",
  },
  ar: {
    alt: "Georgian Support — التأمين الطبي في جورجيا",
    tagline: "التأمين في جورجيا",
    description: "تأمين طبي للسياح والمغتربين • من 4 GEL/يوم",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = twitterContent[locale as Locale] || twitterContent.ru;
  return { alt: content.alt };
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = twitterContent[locale as Locale] || twitterContent.ru;
  const isRtl = locale === "he" || locale === "ar";

  // Load the appropriate font for this locale
  const fontUrl = fontUrls[locale] || fontUrls.default;
  const fontData = await fetch(fontUrl).then((res) => res.arrayBuffer());
  
  // Also load default font for the company name (always Latin)
  const defaultFontData = locale !== "ru" && locale !== "en" && locale !== "uk" && locale !== "tr"
    ? await fetch(fontUrls.default).then((res) => res.arrayBuffer())
    : fontData;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFFFFF",
          backgroundImage: "linear-gradient(135deg, #FFFFFF 0%, #FEF2F2 50%, #FEE2E2 100%)",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {/* Red accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundImage: "linear-gradient(90deg, #EF4444 0%, #DC2626 100%)",
          }}
        />
        
        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
          }}
        >
          {/* Georgian Cross Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              backgroundImage: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
              marginBottom: "32px",
              boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)",
            }}
          >
            <svg width="70" height="70" viewBox="0 0 32 32" fill="white">
              <path d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5" opacity="0.9"/>
              <rect x="14" y="10" width="4" height="12" rx="1"/>
              <rect x="10" y="14" width="12" height="4" rx="1"/>
            </svg>
          </div>

          {/* Company name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#18181B",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
              display: "flex",
              fontFamily: "DefaultFont",
            }}
          >
            <span>Georgian</span>
            <span style={{ color: "#EF4444" }}>Support</span>
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "#DC2626",
              marginBottom: "32px",
              fontFamily: "LocaleFont",
            }}
          >
            {content.tagline}
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: "#71717A",
              maxWidth: "800px",
              lineHeight: 1.4,
              fontFamily: "LocaleFont",
            }}
          >
            {content.description}
          </div>
        </div>
        
        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "40px",
            color: "#A1A1AA",
            fontSize: 20,
            fontFamily: "DefaultFont",
          }}
        >
          <span>georgian.support</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "LocaleFont",
          data: fontData,
          style: "normal",
          weight: 400,
        },
        {
          name: "DefaultFont",
          data: defaultFontData,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
