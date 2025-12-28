import type { Metadata } from "next";

const baseUrl = "https://georgian.support";

export const siteMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Georgian Support | Страховка для туристов и экспатов в Грузии",
    template: "%s | Georgian Support",
  },
  description:
    "Медицинская страховка в Грузии от 65 GEL/мес. Покрытие до 30,000 GEL, оформление онлайн за 15 минут. Реферальная программа: до 100 GEL скидка за каждого друга. Поддержка 24/7.",
  keywords: [
    // Insurance keywords
    "страховка в Грузии",
    "медицинская страховка Грузия",
    "туристическая страховка Грузия",
    "страховка для экспатов",
    "health insurance Georgia",
    "travel insurance Tbilisi",
    "expat insurance Georgia",
    "страховка Тбилиси",
    "страховка Батуми",
    "georgian support",
    // Insurance packages keywords
    "годовая страховка Грузия",
    "ежемесячная страховка Грузия",
    "страховка $50000 покрытие",
    "cheap health insurance Georgia",
    "annual insurance Georgia",
    "monthly insurance plan Tbilisi",
    // Referral program keywords
    "реферальная программа страховка",
    "скидка на страховку Грузия",
    "приведи друга страховка",
    "referral bonus insurance",
    "insurance discount Georgia",
    "refer a friend insurance",
    "бонус за рекомендацию страховка",
  ],
  authors: [{ name: "Georgian Support" }],
  creator: "Georgian Support",
  publisher: "Georgian Support",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: baseUrl,
    siteName: "Georgian Support",
    title: "Страховка в Грузии от 65 GEL/мес | Реферальная программа",
    description:
      "Медицинская страховка для туристов и экспатов в Грузии. Покрытие до 30,000 GEL, поддержка 24/7. Приглашай друзей — получай до 100 GEL скидки!",
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Georgian Support - Страхование в Грузии с реферальной программой",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Страховка в Грузии от 65 GEL/мес | Скидки за рефералов",
    description: "Медицинская страховка для туристов и экспатов. Покрытие до 30,000 GEL. Реферальная программа: до 100 GEL за друга!",
    images: [`${baseUrl}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "ADD_YOUR_CODE_HERE",
  //   yandex: "ADD_YOUR_CODE_HERE",
  // },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  category: "insurance",
};

// Organization Schema
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${baseUrl}/#organization`,
  name: "Georgian Support",
  alternateName: ["Georgian Support Insurance", "Страховка Georgian Support"],
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    url: `${baseUrl}/opengraph-image`,
    width: 1200,
    height: 630,
  },
  image: `${baseUrl}/opengraph-image`,
  description: "Медицинская страховка для туристов и экспатов в Грузии",
  foundingDate: "2023",
  areaServed: {
    "@type": "Country",
    name: "Georgia",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+995-591-196-300",
      contactType: "customer service",
      availableLanguage: ["Russian", "English", "Georgian", "Ukrainian", "Turkish", "Hebrew", "Arabic"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    {
      "@type": "ContactPoint",
      email: "info@georgian.support",
      contactType: "customer support",
      availableLanguage: ["Russian", "English", "Georgian"],
    },
  ],
  sameAs: [
    "https://t.me/georgialegalresidency",
    "https://wa.me/995591196300",
  ],
};

// InsuranceAgency Schema
export const insuranceAgencySchema = {
  "@context": "https://schema.org",
  "@type": "InsuranceAgency",
  "@id": `${baseUrl}/#business`,
  name: "Georgian Support",
  url: baseUrl,
  telephone: "+995-591-196-300",
  email: "info@georgian.support",
  description: "Медицинская страховка для туристов и экспатов в Грузии",
  priceRange: "65 - 300 GEL",
  openingHours: "Mo-Su 00:00-23:59",
  areaServed: {
    "@type": "Country",
    name: "Georgia",
  },
};

// Product Schema for Insurance Plans
export const productSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/#annual-insurance`,
    name: "Годовая страховка в Грузии — PREMIUM",
    alternateName: ["Annual Health Insurance Georgia", "Premium Insurance Plan"],
    description: "Годовая медицинская страховка для туристов и экспатов в Грузии. Покрытие до 30,000 GEL, экстренная помощь 24/7, госпитализация, амбулаторное лечение, стоматология.",
    brand: {
      "@type": "Brand",
      name: "Georgian Support",
    },
    category: "Health Insurance",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/#plans`,
      price: "300",
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "156",
      bestRating: "5",
      worstRating: "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/#6month-insurance`,
    name: "Страховка на 6 месяцев — OPTIMUM",
    alternateName: ["6-Month Health Insurance Georgia", "Optimum Insurance Plan"],
    description: "Медицинская страховка на 6 месяцев для иностранцев, проживающих в Грузии. Идеально для digital nomads, удалённых работников и долгосрочных резидентов. Покрытие до 30,000 GEL.",
    brand: {
      "@type": "Brand",
      name: "Georgian Support",
    },
    category: "Health Insurance",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/#plans`,
      price: "250",
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "89",
      bestRating: "5",
      worstRating: "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/#monthly-insurance`,
    name: "Ежемесячная страховка UNO Active",
    alternateName: ["Monthly Health Insurance Georgia", "UNO Active Insurance Plan"],
    description: "Гибкий ежемесячный план медицинской страховки UNO Active для краткосрочного пребывания в Грузии. Оплата помесячно, можно отменить в любое время. Включает стоматологию.",
    brand: {
      "@type": "Brand",
      name: "Georgian Support",
    },
    category: "Health Insurance",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/#plans`,
      price: "55",
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      reviewCount: "234",
      bestRating: "5",
      worstRating: "1",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/#monthly-plus-insurance`,
    name: "Ежемесячная страховка UNO Active+",
    alternateName: ["Monthly Premium Insurance Georgia", "UNO Active Plus Plan"],
    description: "Расширенный ежемесячный план UNO Active+ с максимальным покрытием. Плановые операции, расширенная стоматология, ведение беременности.",
    brand: {
      "@type": "Brand",
      name: "Georgian Support",
    },
    category: "Health Insurance",
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/#plans`,
      price: "90",
      priceCurrency: "GEL",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      seller: {
        "@id": `${baseUrl}/#organization`,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "112",
      bestRating: "5",
      worstRating: "1",
    },
  },
];

// FAQ Schema
export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Какие документы нужны для оформления страховки?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Для оформления страховки вам понадобится только загранпаспорт. Весь процесс занимает 10-15 минут.",
      },
    },
    {
      "@type": "Question",
      name: "Что покрывает страховка?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Страховка покрывает экстренную медицинскую помощь, госпитализацию, амбулаторное лечение, лекарства по рецепту, экстренную стоматологию и репатриацию. Максимальное покрытие составляет $50,000.",
      },
    },
    {
      "@type": "Question",
      name: "С какого момента начинает действовать страховка?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Страховка начинает действовать с даты, указанной в полисе. Вы можете выбрать дату начала действия при оформлении.",
      },
    },
    {
      "@type": "Question",
      name: "Как работает реферальная программа?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Приглашайте друзей и получайте скидки! За каждого приглашённого друга вы получаете $15 скидку на продление страховки. Друг также получает $15 скидку на первую покупку. Скидки накапливаются без ограничений.",
      },
    },
    {
      "@type": "Question",
      name: "What is the referral bonus program?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Refer friends and earn discounts! For each friend you refer, you get a $15 discount on your renewal. Your friend also gets $15 off their first purchase. Discounts stack with no limits.",
      },
    },
    {
      "@type": "Question",
      name: "Сколько стоит страховка в Грузии?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Годовая страховка стоит $300 (с покрытием $50,000). Также доступен гибкий ежемесячный план за $85/месяц. С реферальной программой можно получить дополнительные скидки.",
      },
    },
    {
      "@type": "Question",
      name: "How much does health insurance cost in Georgia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Annual insurance costs $300 (with $50,000 coverage). A flexible monthly plan is also available at $85/month. With our referral program, you can earn additional discounts.",
      },
    },
  ],
};

// Website Schema
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  url: baseUrl,
  name: "Georgian Support",
  description: "Медицинская страховка для туристов и экспатов в Грузии",
  publisher: {
    "@id": `${baseUrl}/#organization`,
  },
  inLanguage: ["ru", "en", "ka", "uk", "tr", "he", "ar"],
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${baseUrl}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

// Service Schema for Insurance
export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${baseUrl}/#service`,
  name: "Health Insurance for Tourists and Expats",
  alternateName: "Медицинская страховка для туристов и экспатов",
  provider: {
    "@id": `${baseUrl}/#organization`,
  },
  serviceType: "Health Insurance",
  areaServed: {
    "@type": "Country",
    name: "Georgia",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Insurance Plans",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PREMIUM — Annual Insurance",
          description: "Annual medical insurance for tourists and expats in Georgia. Coverage up to 30,000 GEL.",
        },
        price: "300",
        priceCurrency: "GEL",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "OPTIMUM — 6-Month Insurance",
          description: "6-month medical insurance for foreigners living in Georgia.",
        },
        price: "250",
        priceCurrency: "GEL",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UNO Active — Monthly Insurance",
          description: "Flexible monthly medical insurance plan with dental coverage.",
        },
        price: "55",
        priceCurrency: "GEL",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "UNO Active+ — Premium Monthly",
          description: "Extended monthly plan with surgeries, maternity, and full dental.",
        },
        price: "90",
        priceCurrency: "GEL",
      },
    ],
  },
};

// Combined structured data for homepage
export const structuredData = [
  organizationSchema,
  insuranceAgencySchema,
  websiteSchema,
  serviceSchema,
  faqSchema,
  ...productSchemas,
];

// Breadcrumb Schema helper
export function createBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
