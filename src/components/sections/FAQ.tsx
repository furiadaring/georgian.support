"use client";

import { useState } from "react";
import Link from "next/link";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";
import { CONTACT } from "@/lib/constants";

interface FAQProps {
  locale: Locale;
  dict: Dictionary;
}

export default function FAQ({ locale, dict }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = dict.faq;
  const isRtl = isRtlLocale(locale);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-white py-16 lg:py-24 w-full">
      <div style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p className="text-purple-600 text-xs font-medium tracking-[0.2em] uppercase" style={{ margin: '0 0 20px 0' }}>{t.label}</p>
          <h2 id="faq-heading" className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-black" style={{ margin: '0 0 20px 0' }}>
            {t.title} <span className="text-purple-600">{t.titleHighlight}</span>
          </h2>
          <p className="text-base text-primary-grey" style={{ margin: '0 auto', maxWidth: '600px' }}>
            {t.description}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Items - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            {t.items.map((item, idx) => (
              <div
                key={idx}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === idx 
                    ? "border-primary-blue shadow-lg shadow-primary-blue/10 bg-blue-50/30" 
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  aria-expanded={openIndex === idx}
                  aria-controls={`faq-content-${idx}`}
                >
                  <span className={`font-semibold ${openIndex === idx ? "text-purple-600" : "text-primary-black"} ${isRtl ? 'text-right' : 'text-left'} flex-1`}>
                    {item.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isRtl ? 'mr-4' : 'ml-4'} transition-colors ${
                    openIndex === idx ? "bg-primary-blue text-white" : "bg-gray-100 text-gray-500"
                  }`}>
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                <div 
                  id={`faq-content-${idx}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === idx ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className={`px-5 pb-5 text-primary-grey leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-linear-to-br from-primary-blue via-primary-blue-dark to-slate-900 rounded-3xl p-10 text-center text-white shadow-xl shadow-primary-blue/20">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t.sidebar.title}</h3>
              <p className="text-blue-100/80 text-base mb-8 leading-relaxed">{t.sidebar.description}</p>
              <Link
                href={CONTACT.whatsapp}
                target="_blank"
                className="inline-flex items-center gap-2 bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t.sidebar.button}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
