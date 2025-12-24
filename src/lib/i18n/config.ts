export const locales = ['ru', 'en', 'ka', 'uk', 'tr', 'he', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  ka: 'ქართული',
  uk: 'Українська',
  tr: 'Türkçe',
  he: 'עברית',
  ar: 'العربية',
};

export const localeFlags: Record<Locale, string> = {
  ru: '🇷🇺',
  en: '🇬🇧',
  ka: '🇬🇪',
  uk: '🇺🇦',
  tr: '🇹🇷',
  he: '🇮🇱',
  ar: '🇸🇦',
};

// RTL languages
export const rtlLocales: Locale[] = ['he', 'ar'];

export function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}
