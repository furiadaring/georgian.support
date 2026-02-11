"use client";

import { useState, FormEvent } from "react";
import { CONTACT, INSURANCE_PLANS } from "@/lib/constants";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface ContactFormProps {
  locale: Locale;
  dict: Dictionary;
}

export default function ContactForm({ locale, dict }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    insuranceType: "premium",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const t = dict.contact;
  const isRtl = isRtlLocale(locale);

  const getPeriodText = (planId: string) => {
    switch (planId) {
      case "visitor": return dict.insurance.day;
      case "standard": return dict.insurance.months3;
      case "optimum": return dict.insurance.months6;
      case "premium": return dict.insurance.year;
      case "uno-active": 
      case "uno-active-plus": return dict.insurance.month;
      default: return "";
    }
  };

  const planOptions = INSURANCE_PLANS.map(plan => ({
    value: plan.id,
    label: `${dict.insurance.plans[plan.id as keyof typeof dict.insurance.plans].name} — ${plan.price} GEL/${getPeriodText(plan.id)}${plan.popular ? ' ⭐' : ''}`
  }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (typeof window !== 'undefined' && 'gtag_report_conversion' in window) {
      (window as unknown as { gtag_report_conversion: (url?: string) => boolean }).gtag_report_conversion();
    }

    const selectedPlan = planOptions.find(p => p.value === formData.insuranceType);
    const message = encodeURIComponent(
      `${t.form.name}: ${formData.name}\n\n${t.form.plan}: ${selectedPlan?.label || formData.insuranceType}\n\n${formData.message ? `${t.form.message}: ${formData.message}` : ""}\n${t.form.phone}: ${formData.phone}`
    );
    
    window.open(`${CONTACT.whatsapp}?text=${message}`, "_blank");
    setSubmitted(true);

        // Send lead to central CRM
        if (typeof window !== 'undefined' && (window as any).VGLeads) {
          (window as any).VGLeads.send({
            name: formData.name,
            phone: formData.phone,
            message: formData.message || '',
            plan_interest: formData.insuranceType,
            lead_type: 'form',
          });
        }
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <section 
        id="contacts" 
        className="w-full"
        style={{ 
          background: 'linear-gradient(135deg, #fef2f2 0%, #fff 50%, #fef2f2 100%)',
          paddingTop: '100px',
          paddingBottom: '100px'
        }}
      >
        <div style={{ maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '24px', paddingRight: '24px' }}>
          <div 
            style={{
              backgroundColor: '#fff',
              borderRadius: '32px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 25px 80px rgba(0,0,0,0.08)'
            }}
          >
            <div 
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 32px auto',
                boxShadow: '0 20px 50px rgba(34, 197, 94, 0.4)'
              }}
            >
              <svg style={{ width: '48px', height: '48px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#18181b', marginBottom: '16px' }}>
              {t.success.title}
            </h3>
            <p style={{ color: '#71717a', marginBottom: '36px', fontSize: '18px', lineHeight: '1.6' }}>
              {t.success.message}
            </p>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '18px',
                padding: '18px 36px',
                borderRadius: '16px',
                textDecoration: 'none',
                boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)',
                transition: 'transform 0.2s ease'
              }}
              className="hover:scale-105"
            >
              <svg style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {t.success.openWhatsapp}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="contacts" 
      className="w-full relative overflow-hidden"
      style={{ 
        background: '#fafafa',
        paddingTop: '60px',
        paddingBottom: '80px'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-150px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(239, 68, 68, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px', position: 'relative', zIndex: 1 }}>
        
        {/* Section Header - Big & Bold */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              padding: '8px 16px',
              borderRadius: '50px',
              marginBottom: '24px'
            }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t.label}
          </div>
          <h2 
            style={{ 
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: '#18181b',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}
          >
            {t.title}
            <span style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>{t.titleHighlight}</span>
          </h2>
          <p 
            style={{ 
              fontSize: '16px',
              color: '#71717a',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6',
              padding: '0 16px'
            }}
          >
            {t.description}
          </p>
        </div>

        {/* Main Content - Two Big Cards */}
        <div 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
          className="lg:!flex-row"
        >
          
          {/* LEFT CARD - Quick Contact */}
          <div 
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
              flex: '1'
            }}
          >
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#18181b', 
              marginBottom: '8px' 
            }}>
              {t.quickContact}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: '#71717a', 
              marginBottom: '28px',
              lineHeight: '1.5'
            }}>
              {t.quickContactDesc}
            </p>

            {/* Messenger Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              <a 
                href={CONTACT.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#fff',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="hover:scale-[1.02] hover:shadow-xl"
              >
                <svg style={{ width: '24px', height: '24px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span style={{ flex: 1 }}>{t.whatsappBtn}</span>
                <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              <a 
                href={CONTACT.telegram} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'linear-gradient(135deg, #0088cc 0%, #0077b5 100%)',
                  color: '#fff',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  boxShadow: '0 8px 25px rgba(0, 136, 204, 0.3)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                className="hover:scale-[1.02] hover:shadow-xl"
              >
                <svg style={{ width: '24px', height: '24px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span style={{ flex: 1 }}>{t.telegramBtn}</span>
                <svg style={{ width: '18px', height: '18px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>

            {/* Contact Info Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '12px',
              padding: '16px',
              background: '#fafafa',
              borderRadius: '16px',
              marginBottom: '16px'
            }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{t.phone}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#18181b' }}>{CONTACT.phone}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{t.email}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#18181b', wordBreak: 'break-all' }}>{CONTACT.email}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{t.workHours}</p>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#18181b' }}>{t.workHoursValue}</p>
              </div>
            </div>

            {/* Trust Badge */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '16px',
              background: 'linear-gradient(135deg, #fef2f2 0%, #fff 100%)',
              borderRadius: '14px',
              border: '1px solid #fecaca'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg style={{ width: '24px', height: '24px', color: '#fff' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#18181b' }}>{t.trustBadge}</p>
                <p style={{ fontSize: '13px', color: '#71717a' }}>{t.trustBadgeDesc}</p>
              </div>
            </div>
          </div>

          {/* RIGHT CARD - Application Form */}
          <div 
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(239, 68, 68, 0.2)',
              flex: '1'
            }}
          >
            <h3 style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              color: '#fff', 
              marginBottom: '8px' 
            }}>
              {t.formTitle}
            </h3>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255,255,255,0.85)', 
              marginBottom: '28px',
              lineHeight: '1.5'
            }}>
              {t.formDesc}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
                  {t.form.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box'
                  }}
                  placeholder={t.form.namePlaceholder}
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
                  {t.form.phone}
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box'
                  }}
                  placeholder={t.form.phonePlaceholder}
                  dir="ltr"
                />
              </div>

              {/* Plan */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
                  {t.form.plan}
                </label>
                <select
                  value={formData.insuranceType}
                  onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    fontSize: '15px',
                    outline: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box'
                  }}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {planOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginBottom: '6px' }}>
                  {t.form.message} <span style={{ opacity: 0.7, fontWeight: '400' }}>({t.form.optional})</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'none',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    boxSizing: 'border-box'
                  }}
                  placeholder={t.form.messagePlaceholder}
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: '#fff',
                  color: '#dc2626',
                  fontWeight: '700',
                  fontSize: '15px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: isSubmitting ? 0.8 : 1,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  transition: 'transform 0.2s ease',
                  boxSizing: 'border-box'
                }}
                className="hover:scale-[1.02]"
              >
                {isSubmitting ? (
                  <>
                    <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.form.submitting}
                  </>
                ) : (
                  <>
                    <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {t.form.submit}
                  </>
                )}
              </button>

              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                {t.form.privacyNote}
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
