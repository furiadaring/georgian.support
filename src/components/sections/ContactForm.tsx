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

  // Get period text based on plan
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

    // Track Google Ads conversion
    if (typeof window !== 'undefined' && 'gtag_report_conversion' in window) {
      (window as unknown as { gtag_report_conversion: (url?: string) => boolean }).gtag_report_conversion();
    }

    const selectedPlan = planOptions.find(p => p.value === formData.insuranceType);
    const message = encodeURIComponent(
      `${t.form.name}: ${formData.name}\n\n${t.form.plan}: ${selectedPlan?.label || formData.insuranceType}\n\n${formData.message ? `${t.form.message}: ${formData.message}` : ""}\n${t.form.phone}: ${formData.phone}`
    );
    
    window.open(`${CONTACT.whatsapp}?text=${message}`, "_blank");
    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <section id="contacts" aria-labelledby="contact-heading" className="relative bg-linear-to-b from-slate-50 via-purple-50/50 to-white py-16 lg:py-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute -top-12 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-fuchsia-400/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(107,33,168,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(107,33,168,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
        </div>
        
        <div className="relative z-10" style={{ maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl" style={{ padding: '48px' }}>
            <div className="text-center">
              <div className="w-20 h-20 bg-linear-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto" style={{ marginBottom: '24px' }}>
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-primary-black" style={{ marginBottom: '12px' }}>
                {t.success.title}
              </h3>
              <p className="text-primary-grey" style={{ marginBottom: '24px' }}>
                {t.success.message}
              </p>
              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
                style={{ padding: '14px 28px' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {t.success.openWhatsapp}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contacts" aria-labelledby="contact-heading" className="relative bg-linear-to-b from-slate-50 via-purple-50/50 to-white py-16 lg:py-24 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-12 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-fuchsia-400/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(107,33,168,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(107,33,168,0.02)_1px,transparent_1px)] bg-size-[40px_40px]" />
      </div>

      <div className="relative z-10" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <p className="text-primary-blue text-xs font-medium tracking-[0.2em] uppercase" style={{ margin: '0 0 20px 0' }}>{t.label}</p>
          <h2 id="contact-heading" className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-black" style={{ margin: '0 0 20px 0' }}>
            {t.title} <span className="text-primary-blue">{t.titleHighlight}</span> {t.titleEnd}
          </h2>
          <p className="text-base text-primary-grey" style={{ margin: '0 auto', maxWidth: '500px' }}>
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 order-2 lg:order-1 flex">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg w-full flex flex-col" style={{ padding: '32px' }}>
              <h3 className="text-xl font-bold text-primary-black" style={{ marginBottom: '24px' }}>{t.contactUs}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-green-50 transition-all duration-200 border border-transparent hover:border-green-200">
                  <div className="w-12 h-12 bg-linear-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-primary-grey">{t.whatsapp}</p>
                    <p className="font-semibold text-primary-black group-hover:text-green-600 transition-colors">{CONTACT.phone}</p>
                  </div>
                </a>

                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-sky-50 transition-all duration-200 border border-transparent hover:border-sky-200">
                  <div className="w-12 h-12 bg-linear-to-br from-[#0088cc] to-[#0077b5] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-primary-grey">{t.telegram}</p>
                    <p className="font-semibold text-primary-black group-hover:text-[#0088cc] transition-colors">@georgialegalresidency</p>
                  </div>
                </a>

                <a href={CONTACT.emailLink} className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 transition-all duration-200 border border-transparent hover:border-purple-200">
                  <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-primary-grey">{t.email}</p>
                    <p className="font-semibold text-primary-black group-hover:text-purple-600 transition-colors">{CONTACT.email}</p>
                  </div>
                </a>
              </div>

              {/* Trust badges */}
              <div className="border-t border-gray-100 mt-auto" style={{ paddingTop: '24px' }}>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white">5K</div>
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">+</div>
                  </div>
                  <p className="text-sm text-primary-grey">{t.clientsBadge || "Более"} <span className="font-semibold text-primary-black">5000</span> {t.clientsBadgeEnd || "довольных клиентов"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3 order-1 lg:order-2 flex">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-xl w-full" style={{ padding: '32px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-primary-black" style={{ marginBottom: '8px' }}>
                      {t.form.name}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      style={{ padding: '14px 16px' }}
                      placeholder={t.form.namePlaceholder}
                      dir={isRtl ? 'rtl' : 'ltr'}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-primary-black" style={{ marginBottom: '8px' }}>
                      {t.form.phone}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      style={{ padding: '14px 16px' }}
                      placeholder={t.form.phonePlaceholder}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="insuranceType" className="block text-sm font-semibold text-primary-black" style={{ marginBottom: '8px' }}>
                    {t.form.plan}
                  </label>
                  <select
                    id="insuranceType"
                    value={formData.insuranceType}
                    onChange={(e) => setFormData({ ...formData, insuranceType: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all duration-200 bg-gray-50 focus:bg-white cursor-pointer"
                    style={{ padding: '14px 16px' }}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    {planOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-primary-black" style={{ marginBottom: '8px' }}>
                    {t.form.message} <span className="text-primary-grey font-normal">({t.form.optional || "необязательно"})</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20 outline-none transition-all duration-200 resize-none bg-gray-50 focus:bg-white"
                    style={{ padding: '14px 16px' }}
                    placeholder={t.form.messagePlaceholder}
                    dir={isRtl ? 'rtl' : 'ltr'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/30"
                  style={{ padding: '16px 24px' }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {t.form.submitting}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t.form.submit}
                    </>
                  )}
                </button>

                <p className="text-xs text-primary-grey text-center">
                  {t.form.privacyNote || "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
