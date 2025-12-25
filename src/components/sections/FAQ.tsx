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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = dict.faq;
  const isRtl = isRtlLocale(locale);

  return (
    <section 
      id="faq" 
      aria-labelledby="faq-heading" 
      className="w-full relative overflow-hidden"
      style={{ 
        backgroundColor: '#fff',
        paddingTop: '80px',
        paddingBottom: '100px'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10" style={{ maxWidth: '1152px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' }}>
        
        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: '60px' }}>
          <span 
            className="inline-block text-xs font-bold tracking-[0.2em] uppercase"
            style={{ 
              color: '#ef4444',
              marginBottom: '24px'
            }}
          >
            {t.label}
          </span>
          <h2 
            id="faq-heading" 
            className="font-bold"
            style={{ 
              fontSize: 'clamp(32px, 5vw, 48px)',
              color: '#18181b',
              marginBottom: '20px',
              lineHeight: '1.1'
            }}
          >
            {t.title}{' '}
            <span style={{ color: '#ef4444' }}>{t.titleHighlight}</span>
          </h2>
          <p 
            style={{ 
              fontSize: '18px',
              color: '#71717a',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            {t.description}
          </p>
        </div>

        {/* FAQ Grid - 2 columns */}
        <div 
          style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '20px',
            marginBottom: '60px'
          }}
          className="md:!grid-cols-2"
        >
          {t.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#fafafa',
                  borderRadius: '20px',
                  padding: '28px',
                  border: isOpen ? '2px solid #ef4444' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                {/* Number badge */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: isRtl ? 'auto' : '20px',
                    left: isRtl ? '20px' : 'auto',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: isOpen ? '#ef4444' : '#e4e4e7',
                    color: isOpen ? '#fff' : '#71717a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Question */}
                <div style={{ paddingRight: isRtl ? '0' : '50px', paddingLeft: isRtl ? '50px' : '0' }}>
                  <h3 
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: isOpen ? '#ef4444' : '#18181b',
                      marginBottom: isOpen ? '16px' : '0',
                      lineHeight: '1.4',
                      textAlign: isRtl ? 'right' : 'left',
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {item.question}
                  </h3>

                  {/* Answer - animated */}
                  <div
                    style={{
                      maxHeight: isOpen ? '300px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.4s ease'
                    }}
                  >
                    <p 
                      style={{
                        fontSize: '15px',
                        color: '#52525b',
                        lineHeight: '1.7',
                        textAlign: isRtl ? 'right' : 'left'
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>

                {/* Click indicator */}
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: isRtl ? 'auto' : '20px',
                    left: isRtl ? '20px' : 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    color: '#a1a1aa',
                    opacity: isOpen ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-width CTA Bar */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
            borderRadius: '24px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(239, 68, 68, 0.25)'
          }}
          className="md:!flex-row md:!justify-between md:!text-left"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div 
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <svg 
                style={{ width: '28px', height: '28px', color: '#fff' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '4px'
                }}
              >
                {t.sidebar.title}
              </h3>
              <p 
                style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.8)',
                  margin: 0
                }}
              >
                {t.sidebar.description}
              </p>
            </div>
          </div>

          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexShrink: 0,
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <Link
              href={CONTACT.whatsapp}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fff',
                color: '#25D366',
                fontWeight: '600',
                fontSize: '15px',
                padding: '14px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="hover:scale-105 hover:shadow-lg"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.sidebar.whatsapp}
            </Link>

            <Link
              href={CONTACT.telegram}
              target="_blank"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#fff',
                color: '#0088cc',
                fontWeight: '600',
                fontSize: '15px',
                padding: '14px 24px',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              className="hover:scale-105 hover:shadow-lg"
            >
              <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {t.sidebar.telegram}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}