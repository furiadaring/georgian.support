"use client";

import { useState } from "react";
import type { ContactFormData } from "@/types";

interface ContactFormProps {
  variant?: "light" | "dark";
  showTimeField?: boolean;
  buttonText?: string;
  className?: string;
}

export default function ContactFormFields({
  variant = "light",
  showTimeField = false,
  buttonText = "Отправить",
  className = "",
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    time: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validatePhone = (phone: string) => {
    // Basic Georgian phone validation
    const phoneRegex = /^\+?995\s?\d{3}\s?\d{2}\s?\d{2}\s?\d{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, "")) || phone.length >= 9;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Пожалуйста, введите ваше имя");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Пожалуйста, введите номер телефона");
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError("Пожалуйста, введите корректный номер телефона");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Here you would send data to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setIsSuccess(true);
      setFormData({ name: "", phone: "", time: "" });
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch {
      setError("Произошла ошибка. Попробуйте ещё раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = variant === "dark" 
    ? "input-field bg-primary-grey-dark border-primary-grey-dark text-primary-white placeholder:text-primary-grey"
    : "input-field";

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ваше имя"
          className={`${inputClass} w-full lg:flex-1`}
          disabled={isSubmitting}
          aria-label="Ваше имя"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+995 ___ __ __ __"
          className={`${inputClass} w-full lg:flex-1`}
          disabled={isSubmitting}
          aria-label="Номер телефона"
        />
        {showTimeField && (
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Время для связи"
            className={`${inputClass} w-full lg:flex-1`}
            disabled={isSubmitting}
            aria-label="Удобное время для связи"
          />
        )}
      </div>
      
      {error && (
        <p className="text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}
      
      {isSuccess && (
        <p className="text-green-500 text-sm" role="status">
          Спасибо! Мы свяжемся с вами в ближайшее время.
        </p>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`btn-primary w-full lg:w-auto ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Отправка...
          </span>
        ) : (
          buttonText
        )}
      </button>
      
      <p className={`text-xs ${variant === "dark" ? "text-primary-grey" : "text-primary-grey-dark"}`}>
        Нажимая кнопку, вы соглашаетесь с{" "}
        <a href="/privacy" className="underline hover:text-primary-yellow transition-colors">
          политикой конфиденциальности
        </a>
      </p>
    </form>
  );
}
