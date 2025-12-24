import { Locale, locales, defaultLocale, isRtlLocale } from './config';

// Import all locale files
import ru from './locales/ru.json';
import en from './locales/en.json';
import ka from './locales/ka.json';
import uk from './locales/uk.json';
import tr from './locales/tr.json';
import he from './locales/he.json';
import ar from './locales/ar.json';

const dictionaries: Record<Locale, typeof ru> = {
  ru,
  en,
  ka,
  uk,
  tr,
  he,
  ar,
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export type Dictionary = typeof ru;

// Type-safe translation getter with dot notation support
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<Dictionary>;

export function getTranslation(dictionary: Dictionary, key: string): string {
  const keys = key.split('.');
  let result: unknown = dictionary;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof result === 'string' ? result : key;
}

// Get translation with array access for items like FAQ, advantages etc.
export function getTranslationArray<T>(dictionary: Dictionary, key: string): T[] {
  const keys = key.split('.');
  let result: unknown = dictionary;
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return []; // Return empty array if not found
    }
  }
  
  return Array.isArray(result) ? result as T[] : [];
}

export { locales, defaultLocale, isRtlLocale };
export type { Locale };
