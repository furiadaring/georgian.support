import type { MetadataRoute } from "next";

const locales = ['ru', 'en', 'ka', 'uk', 'tr', 'he', 'ar'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://georgian.support";
  const currentDate = new Date();

  const entries: MetadataRoute.Sitemap = [];

  // Homepage for each locale
  locales.forEach((locale) => {
    entries.push({
      url: `${baseUrl}/${locale}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}`])
        ),
      },
    });
  });

  // Privacy page for each locale
  locales.forEach((locale) => {
    entries.push({
      url: `${baseUrl}/${locale}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/privacy`])
        ),
      },
    });
  });

  // Terms page for each locale
  locales.forEach((locale) => {
    entries.push({
      url: `${baseUrl}/${locale}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/terms`])
        ),
      },
    });
  });

  // Insurance page for each locale
  locales.forEach((locale) => {
    entries.push({
      url: `${baseUrl}/${locale}/insurance`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/insurance`])
        ),
      },
    });
  });

  // Auto Insurance (MTPL) page for each locale
  locales.forEach((locale) => {
    entries.push({
      url: `${baseUrl}/${locale}/auto-insurance`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/auto-insurance`])
        ),
      },
    });
  });

  // Root URL redirects to default locale
  entries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.9,
  });

  return entries;
}
