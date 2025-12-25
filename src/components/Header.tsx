"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CONTACT, COMPANY } from "@/lib/constants";
import { type Locale, type Dictionary } from "@/lib/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

export default function Header({ locale, dict }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInsuranceDropdownOpen, setIsInsuranceDropdownOpen] = useState(false);

  const insuranceDropdownItems = [
    { href: `/${locale}/insurance?category=main`, label: dict.header.insuranceDropdown?.borderEntry || 'Border Entry', icon: 'shield' },
    { href: `/${locale}/insurance?category=longterm`, label: dict.header.insuranceDropdown?.fullMedical || 'Full Medical', icon: 'heart' },
    { href: `/${locale}/auto-insurance`, label: dict.header.insuranceDropdown?.autoEntry || 'Auto Entry', icon: 'car' },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-zinc-100" 
          : "bg-white/80 backdrop-blur-md shadow-sm shadow-black/5"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo - Left */}
          <Link href={`/${locale}`} className="group flex items-center gap-3 shrink-0 z-10">
            {/* Logo Icon */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-10 h-10 lg:w-11 lg:h-11 rounded-xl overflow-hidden shadow-lg transform group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-500 to-red-600" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white drop-shadow" viewBox="0 0 32 32" fill="none">
                    <path 
                      d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5"
                      fill="currentColor"
                      opacity="0.9"
                    />
                    <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                    <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Text */}
            <div className="flex flex-col">
              <div className="font-black text-lg lg:text-xl tracking-tight leading-none flex items-baseline gap-1">
                <span className={`bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent`}>
                  Georgian
                </span>
                <span className="text-zinc-800 transition-colors duration-300">Support</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Absolutely Centered */}
          <nav className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 px-2 py-1.5 rounded-full transition-all duration-300 ${
            isScrolled ? 'bg-zinc-100' : 'bg-zinc-100/80'
          }`}>
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
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-white"
                  >
                    {item.label}
                    <svg 
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${isInsuranceDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-zinc-100 overflow-hidden transition-all duration-300 ${
                      isInsuranceDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    <div className="p-2">
                      {insuranceDropdownItems.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center group-hover:from-red-500 group-hover:to-red-600 transition-all duration-200">
                            {dropdownItem.icon === 'shield' && (
                              <svg className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            )}
                            {dropdownItem.icon === 'heart' && (
                              <svg className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            )}
                            {dropdownItem.icon === 'car' && (
                              <svg className="w-4 h-4 text-red-600 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                              </svg>
                            )}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-zinc-800 group-hover:text-zinc-900">{dropdownItem.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 text-zinc-600 hover:text-zinc-900 hover:bg-white"
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2 z-10">
            <LanguageSwitcher locale={locale} variant="desktop" />
            
            {/* Social buttons */}
            <div className="flex items-center gap-1.5 ml-2">
              <Link
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <div className="absolute inset-0 rounded-full bg-[#25D366] blur opacity-0 group-hover:opacity-50 transition-opacity" />
                <svg className="relative w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </Link>
              <Link
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-[#0088cc] hover:scale-110 transition-all duration-300"
                aria-label="Telegram"
              >
                <div className="absolute inset-0 rounded-full bg-[#0088cc] blur opacity-0 group-hover:opacity-50 transition-opacity" />
                <svg className="relative w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href={`/${locale}#contacts`}
              className="group relative ml-2 px-5 py-2.5 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-sm font-semibold text-white">{dict.header.contacts}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 bg-zinc-100 hover:bg-zinc-200"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center bg-zinc-800 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 rounded-full transition-all duration-300 bg-zinc-800 ${isMenuOpen ? 'opacity-0 scale-0' : ''}`} />
              <span className={`block h-0.5 rounded-full transition-all duration-300 origin-center bg-zinc-800 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
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
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm shadow-2xl transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%)' }}
        >
          {/* Decorative gradient orbs - Georgian red */}
          <div className="absolute top-20 -left-20 w-40 h-40 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-40 -right-10 w-32 h-32 bg-red-600/20 rounded-full blur-3xl" />
          
          {/* Close Button */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu Content */}
          <div className="relative flex flex-col h-full pt-20 pb-8 px-6">
            {/* Logo in menu */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 32 32" fill="none">
                  <path 
                    d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13h-8v3h4.5c-1.2 3.8-4.7 6.5-8.5 6.5-5 0-9-4-9-9s4-9 9-9c2.5 0 4.7 1 6.4 2.6l2.1-2.1C22.3 5.8 19.3 4.5 16 4.5"
                    fill="currentColor"
                    opacity="0.9"
                  />
                  <rect x="14" y="10" width="4" height="12" rx="1" fill="currentColor" />
                  <rect x="10" y="14" width="12" height="4" rx="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-lg text-white">Georgian Support</span>
                <p className="text-xs text-white/50">Healthcare you can trust</p>
              </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {navItems.map((item, index) => (
                item.hasDropdown ? (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="text-lg font-medium">{item.label}</span>
                    </Link>
                    {/* Dropdown items */}
                    <div className="ml-8 space-y-1 mt-1">
                      {insuranceDropdownItems.map((dropdownItem, dropIndex) => (
                        <Link
                          key={dropdownItem.href}
                          href={dropdownItem.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="group flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
                          style={{ animationDelay: `${(index + dropIndex + 1) * 50}ms` }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                          <span className="text-base">{dropdownItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group flex items-center gap-4 px-4 py-3.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-lg font-medium">{item.label}</span>
                  </Link>
                )
              ))}
            </nav>

            {/* Language Switcher */}
            <div className="py-4 border-t border-white/10">
              <LanguageSwitcher locale={locale} variant="mobile" />
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Link
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-500/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </Link>
              <Link
                href={CONTACT.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </Link>
            </div>

            {/* Footer info */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-white/40">© 2025 Georgian Support</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
