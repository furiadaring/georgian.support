"use client";

import { useState } from "react";
import Image from "next/image";
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
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="w-full relative bg-[#FAFAFA] py-15 lg:py-20 lg:pb-25"
    >
      {/* Padded container for Header */}
      <div className="max-w-[1920px] mx-auto px-5 lg:px-25 xl:px-50 2xl:px-77.5">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 lg:gap-5">
            <span className="text-[16px] lg:text-[18px] font-medium text-[#ABA2A5] leading-[1.3]">
              {t.label}
            </span>
            <h2
              id="faq-heading"
              className="text-[34px] lg:text-[55px] font-bold text-[#2D1D38] leading-[1.3] lg:leading-[0.9]"
            >
              {t.title}{" "}
              <span className="text-[#DE643B]">{t.titleHighlight}</span>
            </h2>
          </div>
          <p className="mt-4 lg:mt-0 text-[16px] font-medium text-[#776667] leading-[1.3] lg:max-w-105">
            {t.description}
          </p>
        </div>
      </div>

      {/* Main Content — left padding only on desktop so image extends to right edge */}
      <div className="max-w-[1920px] mx-auto px-5 lg:pl-25 lg:pr-0 xl:pl-50 xl:pr-0 2xl:pl-77.5 2xl:pr-0 pt-7.5 lg:pt-10">
        <div className="flex flex-col lg:flex-row lg:gap-[8%] gap-7.5">

          {/* Mobile Image */}
          <div className="block lg:hidden w-full">
            <div className="relative w-full aspect-730/487 overflow-hidden">
              <Image
                src="/images/faq-consultation.png"
                alt="FAQ illustration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw"
              />
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="lg:w-[46.6%] lg:shrink-0 lg:pt-4">
            <div className="flex flex-col">
              {t.items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={idx} className="border-t border-[#E5E5E5] pt-5 first:pt-0">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className={`w-full flex items-center justify-between py-2.5 text-left ${isRtl ? "flex-row-reverse" : ""}`}
                    >
                      <span className={`text-[16px] lg:text-[18px] font-medium text-[#2D1D38] leading-[1.3] ${isRtl ? "pl-4" : "pr-4"}`}>
                        {item.question}
                      </span>
                      <div className="shrink-0 size-7 lg:size-9 rounded-full bg-[#DE643B] flex items-center justify-center">
                        <svg
                          className={`size-3 lg:size-3.5 text-white transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-3" : "max-h-0"}`}
                    >
                      <p className={`text-[#776667] text-[14px] lg:text-[16px] font-semibold lg:font-medium leading-[1.3] ${isRtl ? "text-right" : "text-left"}`}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-[#E5E5E5]" />
            </div>
          </div>

          {/* Desktop Image */}
          <div className="hidden lg:block flex-1">
            <div className="relative w-full h-full min-h-121.75 shadow-[-10px_10px_0px_0px_#E6CFE3]">
              <div className="relative w-full h-full min-h-121.75 overflow-hidden">
                <Image
                  src="/images/faq-consultation.png"
                  alt="FAQ illustration"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 730px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Padded container for CTA Bar */}
      <div className="max-w-[1920px] mx-auto px-5 lg:px-25 xl:px-50 2xl:px-77.5 pt-7.5 lg:pt-10">
        <div className="bg-[#2D1D38] rounded-2xl p-6.25 lg:px-13.75 lg:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6.25 lg:gap-0">

          {/* Text */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-[22px] font-bold text-[#FAFAFA] leading-[1.3]">
              {t.sidebar.title}
            </h3>
            <p className="text-[16px] font-medium text-[#FAFAFA] leading-[1.3]">
              {t.sidebar.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
            <Link
              href={CONTACT.whatsapp}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.25 bg-whatsapp text-[#FAFAFA] rounded-full px-4 py-3 min-w-46.25 hover:opacity-90 transition-opacity duration-300"
            >
              <svg className="size-7.5 shrink-0" viewBox="0 0 30 30" fill="none">
                <path d="M22.2 7.8C20.8 6.4 18.9 5.6 16.9 5.6C12.7 5.6 9.2 9.1 9.2 13.3C9.2 14.7 9.6 16.1 10.3 17.3L9.1 21.5L13.4 20.3C14.6 20.9 15.7 21.3 16.9 21.3C21.1 21.3 24.6 17.8 24.6 13.6C24.6 11.5 23.6 9.5 22.2 7.8Z" fill="white"/>
              </svg>
              <span className="text-[16px] font-medium leading-[1.3]">
                {t.sidebar.whatsapp}
              </span>
            </Link>
            <Link
              href={CONTACT.telegram}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.25 bg-telegram text-[#FAFAFA] rounded-full px-4 py-3 min-w-46.25 hover:opacity-90 transition-opacity duration-300"
            >
              <svg className="size-7.5 shrink-0" viewBox="0 0 30 30" fill="none">
                <path d="M21.8 9.2L19.4 20.8C19.4 20.8 19.1 21.6 18.2 21.2L13.3 17.5L11.5 16.6L8.1 15.5C8.1 15.5 7.5 15.3 7.5 14.8C7.5 14.3 8.1 14.1 8.1 14.1L20.8 9.2C20.8 9.2 21.8 8.8 21.8 9.2Z" fill="white"/>
              </svg>
              <span className="text-[16px] font-medium leading-[1.3]">
                {t.sidebar.telegram}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}