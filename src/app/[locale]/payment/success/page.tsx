"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

const translations = {
  title: {
    en: "Payment Successful!",
    ru: "Оплата прошла успешно!",
    ka: "გადახდა წარმატებით დასრულდა!",
    tr: "Ödeme Başarılı!",
    he: "התשלום בוצע בהצלחה!",
    ar: "تم الدفع بنجاح!",
    uk: "Оплата пройшла успішно!",
  },
  subtitle: {
    en: "Thank you for your order",
    ru: "Спасибо за ваш заказ",
    ka: "მადლობა თქვენი შეკვეთისთვის",
    tr: "Siparişiniz için teşekkürler",
    he: "תודה על ההזמנה שלך",
    ar: "شكراً على طلبك",
    uk: "Дякуємо за ваше замовлення",
  },
  orderNumber: {
    en: "Order Number",
    ru: "Номер заказа",
    ka: "შეკვეთის ნომერი",
    tr: "Sipariş Numarası",
    he: "מספר הזמנה",
    ar: "رقم الطلب",
    uk: "Номер замовлення",
  },
  emailConfirmation: {
    en: "A confirmation email has been sent to your email address.",
    ru: "На вашу почту отправлено письмо с подтверждением.",
    ka: "დადასტურების წერილი გაიგზავნა თქვენს ელ. ფოსტაზე.",
    tr: "Onay e-postası e-posta adresinize gönderildi.",
    he: "אימייל אישור נשלח לכתובת האימייל שלך.",
    ar: "تم إرسال بريد إلكتروني للتأكيد إلى عنوان بريدك الإلكتروني.",
    uk: "На вашу пошту надіслано лист з підтвердженням.",
  },
  whatNext: {
    en: "What's Next?",
    ru: "Что дальше?",
    ka: "რა იქნება შემდეგ?",
    tr: "Sonraki Adımlar?",
    he: "מה הלאה?",
    ar: "ماذا بعد؟",
    uk: "Що далі?",
  },
  step1: {
    en: "You will receive your insurance policy within 24 hours",
    ru: "Вы получите страховой полис в течение 24 часов",
    ka: "თქვენ მიიღებთ სადაზღვევო პოლისს 24 საათის განმავლობაში",
    tr: "Sigorta poliçenizi 24 saat içinde alacaksınız",
    he: "תקבל את פוליסת הביטוח שלך תוך 24 שעות",
    ar: "ستتلقى بوليصة التأمين الخاصة بك خلال 24 ساعة",
    uk: "Ви отримаєте страховий поліс протягом 24 годин",
  },
  step2: {
    en: "Our manager will contact you to confirm the details",
    ru: "Наш менеджер свяжется с вами для подтверждения деталей",
    ka: "ჩვენი მენეჯერი დაგიკავშირდებათ დეტალების დასადასტურებლად",
    tr: "Yöneticimiz ayrıntıları onaylamak için sizinle iletişime geçecek",
    he: "המנהל שלנו יצור איתך קשר לאישור הפרטים",
    ar: "سيتصل بك مديرنا لتأكيد التفاصيل",
    uk: "Наш менеджер зв'яжеться з вами для підтвердження деталей",
  },
  step3: {
    en: "Save your order number for reference",
    ru: "Сохраните номер заказа для справки",
    ka: "შეინახეთ თქვენი შეკვეთის ნომერი",
    tr: "Referans için sipariş numaranızı saklayın",
    he: "שמור את מספר ההזמנה שלך לעיון",
    ar: "احفظ رقم طلبك للرجوع إليه",
    uk: "Збережіть номер замовлення для довідки",
  },
  backToHome: {
    en: "Back to Home",
    ru: "На главную",
    ka: "მთავარზე დაბრუნება",
    tr: "Ana Sayfaya Dön",
    he: "חזרה לדף הבית",
    ar: "العودة للرئيسية",
    uk: "На головну",
  },
  needHelp: {
    en: "Need help? Contact us",
    ru: "Нужна помощь? Свяжитесь с нами",
    ka: "გჭირდებათ დახმარება? დაგვიკავშირდით",
    tr: "Yardıma mı ihtiyacınız var? Bize ulaşın",
    he: "צריך עזרה? צור קשר",
    ar: "هل تحتاج مساعدة؟ اتصل بنا",
    uk: "Потрібна допомога? Зв'яжіться з нами",
  },
  redirectingBack: {
    en: "Redirecting back...",
    ru: "Возвращаемся на сайт...",
    ka: "გადამისამართება...",
    tr: "Geri yönlendiriliyor...",
    he: "מעביר בחזרה...",
    ar: "جاري إعادة التوجيه...",
    uk: "Повертаємось на сайт...",
  },
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || "en";
  const orderId = searchParams.get("order_id");
  const returnUrl = searchParams.get("return"); // External site return URL
  const [mounted, setMounted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // If return URL is provided, redirect to external site after a short delay
    if (returnUrl && orderId) {
      setRedirecting(true);
      const redirectTimer = setTimeout(() => {
        try {
          const url = new URL(returnUrl);
          url.searchParams.set("order_id", orderId);
          url.searchParams.set("status", "success");
          window.location.href = url.toString();
        } catch {
          // Invalid URL, stay on this page
          setRedirecting(false);
        }
      }, 2000); // 2 second delay to show success message
      
      return () => clearTimeout(redirectTimer);
    }
  }, [returnUrl, orderId]);

  const t = (key: keyof typeof translations) => {
    return translations[key][locale as keyof (typeof translations)[typeof key]] || translations[key].en;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  // Show redirecting message if we're about to redirect to external site
  if (redirecting && returnUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t("title")}</h1>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-green-500 border-t-transparent"></div>
              <span>{t("redirectingBack")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Animated Checkmark */}
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-once">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h1>
          <p className="text-gray-600 mb-6">{t("subtitle")}</p>

          {/* Order Number */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">{t("orderNumber")}</p>
              <p className="text-xl font-mono font-bold text-green-600">{orderId}</p>
            </div>
          )}

          {/* Email Confirmation */}
          <p className="text-sm text-gray-500 mb-6">{t("emailConfirmation")}</p>

          {/* What's Next */}
          <div className="text-left bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">{t("whatNext")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span className="text-sm text-gray-600">{t("step1")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span className="text-sm text-gray-600">{t("step2")}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span className="text-sm text-gray-600">{t("step3")}</span>
              </li>
            </ul>
          </div>

          {/* Back to Home Button */}
          <Link
            href={`/${locale}`}
            className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {t("backToHome")}
          </Link>

          {/* Help Link */}
          <p className="mt-4 text-sm">
            <Link href={`/${locale}#contact`} className="text-green-600 hover:text-green-700">
              {t("needHelp")}
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Georgian Support</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-once {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
