"use client";

import { useState, FormEvent } from "react";
import { CONTACT, INSURANCE_PLANS } from "@/lib/constants";
import { reportKeitaroConversion } from "@/lib/attribution";
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

    // Send lead to /api/leads
    try {
      const attribution = sessionStorage.getItem('gs_attribution');
      const parsedAttribution = attribution ? JSON.parse(attribution) : {};
      
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type: 'contact_form',
          source_domain: window.location.hostname,
          name: formData.name,
          phone: formData.phone,
          message: formData.message || '',
          plan_interest: formData.insuranceType,
          subid: parsedAttribution.subid || '',
          click_id: parsedAttribution.click_id || '',
          campaign: parsedAttribution.campaign || '',
          ad_source: parsedAttribution.ad_source || '',
          keyword: parsedAttribution.keyword || '',
          landing_page: parsedAttribution.landing_page || window.location.href,
          referrer: parsedAttribution.referrer || document.referrer,
          utm_source: parsedAttribution.utm_source || '',
          utm_medium: parsedAttribution.utm_medium || '',
          utm_campaign: parsedAttribution.utm_campaign || '',
          utm_term: parsedAttribution.utm_term || '',
          utm_content: parsedAttribution.utm_content || '',
        }),
      });
    } catch (e) {
      console.error('Failed to save lead:', e);
    }

    // Track Keitaro conversion
    reportKeitaroConversion(0, 'lead');

    setIsSubmitting(false);
  };

  // Success state
  if (submitted) {
    return (
      <section
        id="contacts"
        className="w-full relative overflow-hidden"
        style={{ padding: '60px 0' }}
      >
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 overflow-hidden">
            <img alt="" className="absolute max-w-none" style={{ height: '221.52%', left: '-14.16%', top: '-44.1%', width: '132.85%' }} src="/images/contact-bg.png" />
          </div>
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />
        </div>

        <div className="relative z-10 mx-auto" style={{ maxWidth: 560, padding: '0 20px' }}>
          <div className="bg-[#FAFAFA] rounded-[20px] text-center shadow-[0px_25px_80px_0px_rgba(0,0,0,0.2)]" style={{ padding: 40 }}>
            <div className="bg-[#22c55e] rounded-full flex items-center justify-center mx-auto" style={{ width: 100, height: 100, marginBottom: 32 }}>
              <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-[24px] lg:text-[28px] font-bold text-[#2D1D38]" style={{ marginBottom: 16 }}>
              {t.success.title}
            </h3>
            <p className="text-[16px] text-[#776667] leading-[1.6]" style={{ marginBottom: 32 }}>
              {t.success.message}
            </p>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa inline-flex items-center bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-[16px] rounded-full transition-all duration-300"
              style={{ gap: 12, padding: '16px 32px' }}
            >
              <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
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
      style={{ padding: '80px 0' }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden">
          <img alt="" className="absolute max-w-none" style={{ height: '221.52%', left: '-14.16%', top: '-44.1%', width: '132.85%' }} src="/images/contact-bg.png" />
        </div>
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" />
      </div>

      <div className="relative z-10 mx-auto px-5" style={{ maxWidth: 1120 }}>

        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: 40 }}>
          <span className="block text-[18px] font-medium text-[#FAFAFA] leading-[1.3]" style={{ marginBottom: 20 }}>
            {t.label}
          </span>
          <h2 className="text-[34px] lg:text-[55px] font-bold text-[#FAFAFA] leading-[0.9]" style={{ marginBottom: 20 }}>
            {t.title}
            <span className="text-[#DE643B]">{t.titleHighlight}</span>
          </h2>
          <p className="text-[16px] font-medium text-[#FAFAFA] mx-auto leading-[1.3]">
            {t.description}
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="flex flex-col lg:flex-row lg:items-start" style={{ gap: 20 }}>

          {/* LEFT — Quick Contact Card */}
          <div className="w-full lg:basis-[39.6%] lg:shrink-0 bg-[#2D1D38] flex flex-col items-start" style={{ padding: '28px 35px', gap: 40, height: 'auto', minHeight: 486 }}>

            {/* Inner wrapper: title + contacts + buttons */}
            <div className="flex flex-col items-start shrink-0" style={{ gap: 28 }}>

              {/* Title block */}
              <div className="flex flex-col items-start" style={{ gap: 5 }}>
                <h3 className="text-[26px] font-semibold text-[#FAFAFA] leading-[1.3] w-full">
                  {t.quickContact}
                </h3>
                <p className="text-[16px] font-medium text-[#ABA2A5] leading-[1.3] w-full">
                  {t.quickContactDesc}
                </p>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col items-start shrink-0" style={{ gap: 10 }}>
                {/* Schedule */}
                <div className="flex items-center shrink-0" style={{ gap: 8 }}>
                  <svg className="shrink-0 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-[16px] font-medium text-[#FAFAFA] leading-[1.3] whitespace-nowrap">
                    {t.workHoursValue}
                  </span>
                </div>
                {/* Phone */}
                <div className="flex items-center shrink-0" style={{ gap: 8 }}>
                  <svg className="shrink-0 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={CONTACT.phoneLink} className="text-[16px] font-medium text-[#FAFAFA] leading-[1.3] whitespace-nowrap hover:text-[#DE643B] transition-colors">
                    {CONTACT.phone}
                  </a>
                </div>
                {/* Email */}
                <div className="flex items-center shrink-0" style={{ gap: 8 }}>
                  <svg className="shrink-0 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={CONTACT.emailLink} className="text-[16px] font-medium text-[#FAFAFA] leading-[1.3] whitespace-nowrap hover:text-[#DE643B] transition-colors">
                    {CONTACT.email}
                  </a>
                </div>
              </div>

              {/* Messenger Buttons */}
              <div className="flex flex-col items-center justify-center w-full" style={{ gap: 10 }}>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full flex items-center justify-center bg-whatsapp text-[#FAFAFA] font-semibold text-[14px] rounded-full hover:opacity-90 transition-opacity duration-300"
                  style={{ gap: 15, padding: '12px 15px' }}
                >
                  <svg className="size-6 shrink-0" viewBox="0 0 30 30" fill="none">
                    <path d="M22.2 7.8C20.8 6.4 18.9 5.6 16.9 5.6C12.7 5.6 9.2 9.1 9.2 13.3C9.2 14.7 9.6 16.1 10.3 17.3L9.1 21.5L13.4 20.3C14.6 20.9 15.7 21.3 16.9 21.3C21.1 21.3 24.6 17.8 24.6 13.6C24.6 11.5 23.6 9.5 22.2 7.8Z" fill="white"/>
                  </svg>
                  {t.whatsappBtn}
                </a>
                <a
                  href={CONTACT.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tg w-full flex items-center justify-center bg-telegram text-[#FAFAFA] font-semibold text-[14px] rounded-full hover:opacity-90 transition-opacity duration-300"
                  style={{ gap: 15, padding: '12px 15px' }}
                >
                  <svg className="size-6 shrink-0" viewBox="0 0 30 30" fill="none">
                    <path d="M21.8 9.2L19.4 20.8C19.4 20.8 19.1 21.6 18.2 21.2L13.3 17.5L11.5 16.6L8.1 15.5C8.1 15.5 7.5 15.3 7.5 14.8C7.5 14.3 8.1 14.1 8.1 14.1L20.8 9.2C20.8 9.2 21.8 8.8 21.8 9.2Z" fill="white"/>
                  </svg>
                  {t.telegramBtn}
                </a>
              </div>

            </div>

            {/* Trust Badge — separated by gap-40 from inner wrapper */}
            <div className="flex items-center shrink-0 w-full" style={{ gap: 15 }}>
              <svg className="shrink-0" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="15" fill="#60D669"/>
                <path d="M9 15L13 19L21 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col" style={{ gap: 5 }}>
                <p className="text-[16px] font-medium text-[#ABA2A5] leading-[1.3]">
                  {t.trustBadge}
                </p>
                <p className="text-[12px] font-normal text-[#ABA2A5] leading-[1.3]">
                  {t.trustBadgeDesc}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Form Card */}
          <div className="w-full lg:basis-[60.4%] lg:shrink-0 bg-[#FAFAFA] flex flex-col items-start" style={{ padding: '28px 35px', height: 'auto', minHeight: 486, boxShadow: '10px 10px 0px 0px #2D1D38' }}>

            {/* Inner flex-wrap container matching Figma: content-center flex flex-wrap gap-[20px] items-center w-[570px] */}
            <form onSubmit={handleSubmit} className="flex flex-wrap items-center content-center shrink-0 w-full" style={{ gap: 20 }}>

              {/* Title block — w-[446px] in Figma, but we use responsive max */}
              <div className="flex flex-col items-start shrink-0 w-full lg:w-auto" style={{ gap: 5, maxWidth: 446 }}>
                <h3 className="text-[26px] font-semibold text-[#2D1D38] leading-[1.3] w-full">
                  {t.formTitle}
                </h3>
                <p className="text-[16px] font-medium text-[#776667] leading-[1.3] w-full">
                  {t.formDesc}
                </p>
              </div>

              {/* Name input — w-[275px] in Figma */}
              <div className="flex flex-col items-start shrink-0 w-full lg:w-auto" style={{ gap: 5, maxWidth: 275 }}>
                <label className="block text-[16px] font-medium text-[#2D1D38] leading-[1.3] w-full">
                  {t.form.name}<span className="text-[#DE643B]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-[#ABA2A5] bg-white text-[16px] text-[#2D1D38] outline-none transition-all duration-200 focus:border-[#DE643B] placeholder:text-[#ABA2A5] leading-[1.3]"
                  style={{ padding: 10, borderRadius: 6 }}
                  placeholder={t.form.namePlaceholder}
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Phone input — w-[275px] in Figma */}
              <div className="flex flex-col items-start shrink-0 w-full lg:w-auto" style={{ gap: 5, maxWidth: 275 }}>
                <label className="block text-[16px] font-medium text-[#2D1D38] leading-[1.3] w-full">
                  {t.form.phone}<span className="text-[#DE643B]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-[#ABA2A5] bg-white text-[16px] text-[#2D1D38] outline-none transition-all duration-200 focus:border-[#DE643B] placeholder:text-[#ABA2A5] leading-[1.3]"
                  style={{ padding: 10, borderRadius: 6 }}
                  placeholder={t.form.phonePlaceholder}
                  dir="ltr"
                />
              </div>

              {/* Plan Select — w-[570px] full width in Figma */}
              <div className="flex flex-col items-start shrink-0 w-full" style={{ gap: 5 }}>
                <label className="block text-[16px] font-medium text-[#2D1D38] leading-[1.3] w-full">
                  {t.form.plan}<span className="text-[#DE643B]">*</span>
                </label>
                <select
                  value={formData.insuranceType}
                  onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                  className="w-full border border-[#ABA2A5] bg-white text-[16px] text-[#2D1D38] outline-none cursor-pointer transition-all duration-200 focus:border-[#DE643B] leading-[1.3]"
                  style={{ padding: 10, borderRadius: 6 }}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {planOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Textarea — w-[570px] h-[70px] in Figma */}
              <div className="flex flex-col items-start shrink-0 w-full" style={{ gap: 5 }}>
                <label className="block text-[16px] font-medium text-[#2D1D38] leading-[1.3] w-full">
                  {t.form.message} <span className="font-normal text-[#ABA2A5]">({t.form.optional})</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border border-[#ABA2A5] bg-white text-[16px] text-[#2D1D38] outline-none resize-none transition-all duration-200 focus:border-[#DE643B] placeholder:text-[#ABA2A5] leading-[1.3]"
                  style={{ padding: 10, borderRadius: 6, height: 70 }}
                  placeholder={t.form.messagePlaceholder}
                  dir={isRtl ? 'rtl' : 'ltr'}
                />
              </div>

              {/* Submit button — in Figma flex-wrap flow, sits next to privacy text */}
              <div className="flex items-center justify-center shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center bg-[#DE643B] hover:bg-[#c9573a] text-white font-medium text-[18px] rounded-full transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                  style={{ gap: 20, paddingLeft: 30, paddingRight: 5, paddingTop: 5, paddingBottom: 5 }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="size-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t.form.submitting}
                    </>
                  ) : (
                    <>
                      {t.form.submit}
                      <div className="rounded-full bg-[#DE643B] border border-white/20 flex items-center justify-center" style={{ width: 50, height: 50 }}>
                        <svg className={`size-4 ${isRtl ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Privacy note — w-[229px] 12px semibold in Figma */}
              <p className="text-[12px] font-semibold text-[#ABA2A5] leading-[1.3] shrink-0" style={{ width: 229 }}>
                {t.form.privacyNote}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
