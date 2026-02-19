"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CONTACT, trackKeitaro } from "@/lib/constants";
import { type Locale, type Dictionary } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
  darkText?: boolean;
}

export default function Header({ locale, dict, darkText = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isDark = isScrolled || darkText;
  const [isInsuranceDropdownOpen, setIsInsuranceDropdownOpen] = useState(false);

  const insuranceDropdownItems = [
    { href: `/${locale}/insurance?category=main`, label: dict.header.insuranceDropdown?.borderEntry || 'Travel Insurance', icon: 'shield' },
    { href: `/${locale}/insurance?category=longterm`, label: dict.header.insuranceDropdown?.fullMedical || 'Medical Insurance', icon: 'heart' },
    { href: `/${locale}/auto-insurance`, label: dict.header.insuranceDropdown?.autoEntry || 'Auto Insurance', icon: 'car' },
  ];

  const navItems = [
    { href: `/${locale}#advantages`, label: dict.header.about },
    { href: `/${locale}/insurance`, label: dict.header.insurance, hasDropdown: true },
    { href: `/${locale}#faq`, label: dict.header.faq },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled 
          ? "bg-[rgba(250,250,250,0.98)] shadow-[0px_4px_11px_0px_rgba(45,29,56,0.08)]" 
          : "bg-[rgba(250,250,250,0.01)] shadow-[0px_4px_11px_0px_rgba(45,29,56,0.08)]"
      }`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-5 lg:px-[100px] xl:px-[200px] 2xl:px-[310px] py-[15px]">
        <div className="relative flex items-center justify-between">
          
          {/* Logo - Left */}
          <Link href={`/${locale}`} className="group flex items-center gap-[6px] lg:gap-2.5 shrink-0 z-10">
            {/* Logo Icon */}
            <div 
              className="w-[30px] h-[30px] lg:w-[45px] lg:h-[45px] rounded-[10px] lg:rounded-[16px] flex items-center justify-center shadow-[0px_10px_15px_-3px_rgba(251,44,54,0.25),0px_4px_6px_-4px_rgba(251,44,54,0.25)]"
              style={{ background: "linear-gradient(135deg, #FB2C36 0%, #E7000B 100%)" }}
            >
              <svg className="w-4 h-4 lg:w-7 lg:h-7 text-white" viewBox="0 0 32 32" fill="none">
                <path 
                  d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5"
                  fill="currentColor"
                  opacity="0.9"
                />
                <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
              </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col gap-0.5 lg:gap-[3px]">
              <div className="flex items-baseline font-bold text-[13px] lg:text-[20px] leading-[1.3]">
                <span className={`${isDark ? 'text-[#2D1D38]' : 'text-[#FAFAFA]'} transition-colors duration-300`}>Georgian</span>
                <span className="bg-gradient-to-r from-[#FB2C36] via-[#FB2C36] to-[#E7000B] bg-clip-text text-transparent">Support</span>
              </div>
              <span className={`text-[8px] lg:text-[12px] font-semibold leading-[1.3] ${isDark ? 'text-[#2D1D38] lg:text-[#776667]' : 'text-[#FAFAFA]/60'} transition-colors duration-300`}>
                by Legal Residency Group
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-[45px]">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <div 
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setIsInsuranceDropdownOpen(true)}
                  onMouseLeave={() => setIsInsuranceDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`text-[18px] font-medium leading-[1.3] transition-all duration-200 flex items-center ${
                      isDark ? 'text-[#2D1D38] hover:text-[#DE643B]' : 'text-[#FAFAFA] hover:text-white'
                    } ${isInsuranceDropdownOpen ? 'pb-[10px] border-b border-current' : ''}`}
                  >
                    {item.label}
                    <svg 
                      className={`w-6 h-6 ml-1 transition-transform duration-200 ${isInsuranceDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-5 w-[318px] bg-white rounded-[20px] shadow-xl overflow-hidden transition-all duration-300 ${
                      isInsuranceDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="py-5">
                      {insuranceDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="group flex items-center justify-between px-[25px] py-[15px] text-[#2D1D38] hover:bg-gray-50 transition-all duration-200"
                        >
                          <span className="text-[18px] font-medium">{dropdownItem.label}</span>
                          <svg className="w-5 h-5 text-[#ABA2A5] group-hover:text-[#DE643B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[18px] font-medium leading-[1.3] transition-all duration-200 ${
                    isDark ? 'text-[#2D1D38] hover:text-[#DE643B]' : 'text-[#FAFAFA] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop Right - Language, Social & CTA */}
          <div className="hidden lg:flex items-center gap-5 z-10">
            {/* Language Switcher */}
            <LanguageSwitcher locale={locale} variant="desktop" />
            
            {/* Social Icons */}
            <div className="flex items-center gap-2.5">
              <Link
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackKeitaro('whatsapp')}
                className="flex items-center justify-center w-[30px] h-[30px] transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#25D366"/>
                  <path d="M21.5 8.5C20.2 7.2 18.5 6.5 16.5 6.5C12.5 6.5 9.2 9.8 9.2 13.8C9.2 15.1 9.5 16.4 10.2 17.5L9.1 21.4L13.1 20.3C14.2 20.9 15.3 21.2 16.5 21.2C20.5 21.2 23.8 17.9 23.8 13.9C23.8 11.9 23 10 21.5 8.5ZM16.5 19.8C15.4 19.8 14.3 19.5 13.4 18.9L13.2 18.8L10.8 19.4L11.4 17.1L11.2 16.9C10.5 15.9 10.2 14.9 10.2 13.8C10.2 10.4 13 7.6 16.4 7.6C18 7.6 19.5 8.2 20.6 9.3C21.7 10.4 22.3 11.9 22.3 13.5C22.4 17 19.9 19.8 16.5 19.8ZM19.8 15.3C19.6 15.2 18.5 14.7 18.3 14.6C18.1 14.5 18 14.5 17.9 14.7C17.8 14.9 17.4 15.4 17.3 15.5C17.2 15.6 17.1 15.6 16.9 15.5C16.7 15.4 15.9 15.2 15 14.4C14.3 13.8 13.8 13 13.7 12.8C13.6 12.6 13.7 12.5 13.8 12.4C13.9 12.3 14 12.2 14.1 12.1C14.2 12 14.2 11.9 14.3 11.8C14.4 11.7 14.3 11.6 14.3 11.5C14.3 11.4 13.8 10.3 13.6 9.9C13.5 9.5 13.3 9.5 13.2 9.5C13.1 9.5 13 9.5 12.9 9.5C12.8 9.5 12.6 9.5 12.4 9.7C12.2 9.9 11.7 10.4 11.7 11.5C11.7 12.6 12.5 13.6 12.6 13.7C12.7 13.8 13.8 15.5 15.5 16.3C16.1 16.6 16.5 16.7 16.9 16.8C17.5 16.9 18 16.9 18.5 16.8C19 16.7 19.9 16.3 20.1 15.9C20.3 15.5 20.3 15.1 20.2 15C20.1 15.4 20 15.4 19.8 15.3Z" fill="white"/>
                </svg>
              </Link>
              <Link
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackKeitaro('telegram')}
                className="flex items-center justify-center w-[30px] h-[30px] transition-all duration-300"
                aria-label="Telegram"
              >
                <svg className="w-[30px] h-[30px]" viewBox="0 0 30 30" fill="none">
                  <circle cx="15" cy="15" r="15" fill="#229ED9"/>
                  <path d="M21.5 9.5L19.3 20.5C19.3 20.5 19 21.2 18.2 20.9L13.7 17.5L12 16.7L8.8 15.7C8.8 15.7 8.3 15.5 8.3 15.1C8.3 14.7 8.9 14.5 8.9 14.5L20.5 9.9C20.5 9.9 21.5 9.5 21.5 9.5ZM17.2 12.2L13.2 16L12.9 18.7L12.3 16.3L17.2 12.2Z" fill="white"/>
                </svg>
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href={`/${locale}#contacts`}
              className="group flex items-center gap-5 pl-[30px] pr-[5px] py-[5px] bg-[#DE643B] hover:bg-[#E85D3B] rounded-full transition-all duration-300"
            >
              <span className="text-[18px] font-medium text-[#FAFAFA] leading-[1.3]">{dict.header.contacts}</span>
              <div className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Mobile Right - Flag + Menu */}
          <div className="lg:hidden flex items-center gap-[15px]">
            <LanguageSwitcher locale={locale} variant="mobile-header" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${isDark ? 'bg-[#2D1D38]' : 'bg-white'} ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${isDark ? 'bg-[#2D1D38]' : 'bg-white'} ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center ${isDark ? 'bg-[#2D1D38]' : 'bg-white'} ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute inset-0 bg-[#FAFAFA] transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 shadow-[0px_4px_11px_0px_rgba(45,29,56,0.08)]">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-1.5" onClick={() => setIsMenuOpen(false)}>
              <div 
                className="w-[30px] h-[30px] rounded-[10px] flex items-center justify-center shadow-[0px_6.667px_10px_-2px_rgba(251,44,54,0.25),0px_2.667px_4px_-2.667px_rgba(251,44,54,0.25)]"
                style={{ background: "linear-gradient(135deg, #FB2C36 0%, #E7000B 100%)" }}
              >
                <svg className="w-[18px] h-[18px] text-white" viewBox="0 0 32 32" fill="none">
                  <path 
                    d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                  <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline font-bold text-[13px] leading-[1.3]">
                  <span className="text-[#2D1D38]">Georgian</span>
                  <span className="bg-gradient-to-r from-[#FB2C36] to-[#E7000B] bg-clip-text text-transparent">Support</span>
                </div>
                <span className="text-[8px] font-semibold text-[#776667] leading-[1.3]">by Legal Residency Group</span>
              </div>
            </Link>
            
            {/* Close Button */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-[#2D1D38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col h-[calc(100%-72px)] px-5 pt-10">
            {/* Nav Links */}
            <nav className="flex-1 flex flex-col gap-4">
              {navItems.map((item) => (
                item.hasDropdown ? (
                  <div key={item.href} className="flex flex-col gap-1">
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-[20px] font-bold text-[#2D1D38] leading-[1.3]"
                    >
                      {item.label}
                    </Link>
                    {/* Dropdown items */}
                    <div className="flex flex-col gap-4 pl-[25px] py-1">
                      {insuranceDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-[18px] font-medium text-[#2D1D38] leading-[1.3]"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[20px] font-bold text-[#2D1D38] leading-[1.3]"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            {/* Language Switcher */}
            <div className="py-4">
              <LanguageSwitcher locale={locale} variant="mobile" />
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-8 pb-10">
              <Link
                href={`/${locale}#contacts`}
                onClick={() => setIsMenuOpen(false)}
                className="group flex items-center gap-5 pl-[30px] pr-[5px] py-[5px] bg-[#DE643B] hover:bg-[#E85D3B] rounded-full transition-all duration-300"
              >
                <span className="text-[18px] font-medium text-[#FAFAFA]">{dict.header.contacts}</span>
                <div className="w-[50px] h-[50px] rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
              
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <Link
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackKeitaro('whatsapp'); setIsMenuOpen(false); }}
                  className="flex items-center justify-center w-[46px] h-[46px]"
                  aria-label="WhatsApp"
                >
                  <svg className="w-[46px] h-[46px]" viewBox="0 0 46 46" fill="none">
                    <circle cx="23" cy="23" r="23" fill="#25D366"/>
                    <path d="M32.5 13.5C30.6 11.6 28.1 10.5 25.3 10.5C19.7 10.5 15.1 15.1 15.1 20.7C15.1 22.7 15.6 24.6 16.6 26.3L15 32L20.9 30.4C22.5 31.3 24.3 31.8 26.1 31.8C31.7 31.8 36.3 27.2 36.3 21.6C36.3 18.8 35.2 16.3 32.5 13.5ZM25.3 29.8C23.6 29.8 22 29.4 20.6 28.5L20.3 28.3L17 29.1L17.8 25.9L17.6 25.6C16.6 24.1 16.1 22.5 16.1 20.7C16.1 15.6 20.2 11.5 25.3 11.5C27.8 11.5 30.1 12.5 31.8 14.2C33.5 15.9 34.5 18.2 34.5 20.7C34.5 26 30.4 29.8 25.3 29.8ZM30.3 23.3C30 23.2 28.4 22.4 28.1 22.3C27.8 22.2 27.6 22.1 27.4 22.4C27.2 22.7 26.6 23.5 26.4 23.7C26.2 23.9 26 24 25.7 23.8C25.4 23.6 24.3 23.3 23 22.2C22 21.3 21.3 20.2 21.1 19.9C20.9 19.6 21.1 19.4 21.2 19.2C21.4 19.1 21.5 18.9 21.7 18.7C21.9 18.5 21.9 18.4 22 18.2C22.1 18 22.1 17.8 22 17.7C21.9 17.6 21.2 16 20.9 15.4C20.7 14.8 20.4 14.9 20.2 14.9C20 14.9 19.8 14.9 19.6 14.9C19.4 14.9 19.1 15 18.8 15.3C18.5 15.6 17.7 16.4 17.7 18C17.7 19.6 18.9 21.1 19 21.3C19.1 21.5 21.2 24.6 24.4 25.8C25.3 26.2 26 26.4 26.5 26.5C27.4 26.7 28.2 26.7 28.8 26.6C29.5 26.5 30.8 25.8 31.1 25.1C31.4 24.4 31.4 23.8 31.3 23.6C31.2 23.5 30.6 23.4 30.3 23.3Z" fill="white"/>
                  </svg>
                </Link>
                <Link
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackKeitaro('telegram'); setIsMenuOpen(false); }}
                  className="flex items-center justify-center w-[46px] h-[46px]"
                  aria-label="Telegram"
                >
                  <svg className="w-[46px] h-[46px]" viewBox="0 0 46 46" fill="none">
                    <circle cx="23" cy="23" r="23" fill="#229ED9"/>
                    <path d="M32.5 14.5L29.3 30.5C29.3 30.5 28.9 31.5 27.8 31L21.3 26L18.7 24.8L14 23.3C14 23.3 13.3 23 13.3 22.4C13.3 21.8 14 21.5 14 21.5L30.8 15.1C30.8 15.1 32.5 14.5 32.5 14.5ZM26.3 18.3L20.3 24L19.9 28L19 24.5L26.3 18.3Z" fill="white"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
