"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookieConsentProps {
  title?: string;
  message?: string;
  learnMore?: string;
  accept?: string;
  decline?: string;
}

export default function CookieConsent({
  title = "🍪 Мы используем cookies",
  message = "Этот сайт использует файлы cookie для улучшения пользовательского опыта.",
  learnMore = "Подробнее",
  accept = "Принять",
  decline = "Отклонить",
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user already accepted cookies
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/50"
      style={{ padding: '1rem' }}
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className="flex-1">
          <h3 id="cookie-title" className="text-white font-semibold" style={{ marginBottom: '4px' }}>
            {title}
          </h3>
          <p id="cookie-description" className="text-slate-400 text-sm">
            {message}{" "}
            <Link href="/privacy" className="text-primary-blue hover:underline">
              {learnMore}
            </Link>
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-initial px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          >
            {decline}
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-initial px-6 py-2 text-sm font-medium bg-primary-blue text-white rounded-lg hover:bg-primary-blue-dark transition-colors"
          >
            {accept}
          </button>
        </div>
      </div>
    </div>
  );
}
