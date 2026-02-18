"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type Locale, locales, localeNames } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
  locale: Locale;
  variant?: "desktop" | "mobile" | "mobile-header";
}

// SVG Flag components for reliable cross-platform rendering
const FlagIcon = ({ locale, size = 24, circular = false }: { locale: Locale; size?: number; circular?: boolean }) => {
  const width = size;
  const height = Math.round(size * 0.75); // 4:3 aspect ratio for flags
  
  const flags: Record<Locale, ReactNode> = {
    ru: (
      <svg width={width} height={height} viewBox="0 0 36 27" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#EEE" width="36" height="9"/>
        <rect fill="#0039A6" y="9" width="36" height="9"/>
        <rect fill="#D52B1E" y="18" width="36" height="9"/>
      </svg>
    ),
    en: (
      <svg width={width} height={height} viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#012169" width="60" height="30"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" strokeDasharray="30,30" strokeDashoffset="0"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
      </svg>
    ),
    ka: (
      <svg width={width} height={height} viewBox="0 0 36 27" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#fff" width="36" height="27"/>
        <rect fill="#FF0000" x="15" width="6" height="27"/>
        <rect fill="#FF0000" y="10.5" width="36" height="6"/>
        <g fill="#FF0000">
          <rect x="4" y="2" width="2" height="6"/>
          <rect x="2" y="4" width="6" height="2"/>
          <rect x="28" y="2" width="2" height="6"/>
          <rect x="26" y="4" width="6" height="2"/>
          <rect x="4" y="19" width="2" height="6"/>
          <rect x="2" y="21" width="6" height="2"/>
          <rect x="28" y="19" width="2" height="6"/>
          <rect x="26" y="21" width="6" height="2"/>
        </g>
      </svg>
    ),
    uk: (
      <svg width={width} height={height} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#0057B7" width="36" height="12"/>
        <rect fill="#FFD700" y="12" width="36" height="12"/>
      </svg>
    ),
    tr: (
      <svg width={width} height={height} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#E30A17" width="36" height="24"/>
        <circle fill="#fff" cx="13" cy="12" r="6"/>
        <circle fill="#E30A17" cx="14.5" cy="12" r="4.8"/>
        <polygon fill="#fff" points="20,12 22.2,13.2 21.4,10.8 23.5,9.3 21,9.3 20,7 19,9.3 16.5,9.3 18.6,10.8 17.8,13.2"/>
      </svg>
    ),
    he: (
      <svg width={width} height={height} viewBox="0 0 36 26" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#fff" width="36" height="26"/>
        <rect fill="#0038B8" y="3" width="36" height="4"/>
        <rect fill="#0038B8" y="19" width="36" height="4"/>
        <g fill="none" stroke="#0038B8" strokeWidth="1.5">
          <path d="M18,7 L23,16 L13,16 Z"/>
          <path d="M18,19 L13,10 L23,10 Z"/>
        </g>
      </svg>
    ),
    ar: (
      <svg width={width} height={height} viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
        <rect fill="#006C35" width="36" height="8"/>
        <rect fill="#fff" y="8" width="36" height="8"/>
        <rect fill="#000" y="16" width="36" height="8"/>
      </svg>
    ),
  };
  
  return (
    <span 
      className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${circular ? '' : 'rounded-sm border border-gray-200'}`}
      style={{ width: width, height: height }}
    >
      {flags[locale]}
    </span>
  );
};

export default function LanguageSwitcher({ locale, variant = "desktop" }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    const newPath = segments.join('/') || '/';
    
    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    
    router.push(newPath);
    setIsOpen(false);
  };

  if (variant === "mobile-header") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="size-[30px] rounded-full overflow-hidden shrink-0 relative"
          style={{ border: '1.273px solid #e5e7eb' }}
          aria-label="Change language"
          aria-expanded={isOpen}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <FlagIcon locale={locale} size={40} circular />
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-[60] min-w-35">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors ${locale === loc ? "bg-blue-50 text-primary-blue" : "hover:bg-gray-50 text-gray-700"}`}
              >
                <FlagIcon locale={loc} size={20} />
                <span className="text-sm font-medium">{localeNames[loc]}</span>
                {locale === loc && (
                  <svg className="w-4 h-4 ml-auto text-primary-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex flex-wrap gap-2 justify-center" style={{ padding: "0.5rem" }}>
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors ${locale === loc ? "bg-primary-blue/10 ring-2 ring-primary-blue" : "bg-gray-100 hover:bg-gray-200"}`}
            title={localeNames[loc]}
          >
            <FlagIcon locale={loc} size={28} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <FlagIcon locale={locale} size={22} />
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-35">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleLocaleChange(loc)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors ${locale === loc ? "bg-blue-50 text-primary-blue" : "hover:bg-gray-50 text-gray-700"}`}
            >
              <FlagIcon locale={loc} size={20} />
              <span className="text-sm font-medium">{localeNames[loc]}</span>
              {locale === loc && (
                <svg className="w-4 h-4 ml-auto text-primary-blue" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
