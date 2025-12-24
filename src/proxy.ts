import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config';

// Paths that should not be localized
const PUBLIC_FILE = /\.(.*)$/;
const PUBLIC_PATHS = ['/api', '/images', '/icons', '/_next', '/favicon'];

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale;
  }
  return null;
}

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  
  // Parse Accept-Language header and find best match
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, q = 'q=1'] = lang.trim().split(';');
    const quality = parseFloat(q.replace('q=', ''));
    return { code: code.split('-')[0].toLowerCase(), quality };
  });
  
  languages.sort((a, b) => b.quality - a.quality);
  
  for (const { code } of languages) {
    // Map language codes to our locales
    const localeMap: Record<string, Locale> = {
      'ru': 'ru',
      'en': 'en',
      'ka': 'ka',
      'uk': 'uk',
      'tr': 'tr',
      'he': 'he',
      'iw': 'he', // Hebrew alternative code
      'ar': 'ar',
    };
    
    if (localeMap[code] && locales.includes(localeMap[code])) {
      return localeMap[code];
    }
  }
  
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip public files and paths
  if (
    PUBLIC_FILE.test(pathname) ||
    PUBLIC_PATHS.some(path => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname already has a locale
  const pathnameLocale = getLocaleFromPath(pathname);
  
  if (pathnameLocale) {
    // Locale is in URL, proceed normally
    const response = NextResponse.next();
    response.headers.set('x-locale', pathnameLocale);
    return response;
  }
  
  // No locale in URL - detect and redirect
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined;
  const detectedLocale = cookieLocale && locales.includes(cookieLocale)
    ? cookieLocale
    : getLocaleFromAcceptLanguage(request.headers.get('accept-language'));
  
  // Redirect to localized URL
  const newUrl = request.nextUrl.clone();
  newUrl.pathname = `/${detectedLocale}${pathname}`;
  
  const response = NextResponse.redirect(newUrl);
  response.cookies.set('NEXT_LOCALE', detectedLocale, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
  });
  
  return response;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|favicon|images|icons|manifest.json|robots.txt|sitemap.xml).*)',
  ],
};
