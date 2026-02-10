"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";

const translations = {
  redirecting: {
    en: "Redirecting to payment...",
    ru: "Перенаправление на оплату...",
    ka: "გადამისამართება გადახდაზე...",
    tr: "Odeme sayfasina yonlendiriliyor...",
    he: "מעביר לדף התשלום...",
    ar: "جاري التوجيه إلى الدفع...",
    uk: "Перенаправлення на оплату...",
  },
  orderNotFound: {
    en: "Order not found",
    ru: "Заказ не найден",
    ka: "შეკვეთა ვერ მოიძებნა",
    tr: "Siparis bulunamadi",
    he: "ההזמנה לא נמצאה",
    ar: "الطلب غير موجود",
    uk: "Замовлення не знайдено",
  },
  orderNotFoundDesc: {
    en: "The order you're looking for doesn't exist or has expired.",
    ru: "Заказ, который вы ищете, не существует или истек срок его действия.",
    ka: "შეკვეთა, რომელსაც ეძებთ, არ არსებობს ან ვადა გასულია.",
    tr: "Aradiginiz siparis mevcut degil veya suresi dolmus.",
    he: "ההזמנה שאתה מחפש לא קיימת או שפג תוקפה.",
    ar: "الطلب الذي تبحث عنه غير موجود أو انتهت صلاحيته.",
    uk: "Замовлення, яке ви шукаєте, не існує або термін його дії закінчився.",
  },
  backToHome: {
    en: "Back to Home",
    ru: "На главную",
    ka: "მთავარზე დაბრუნება",
    tr: "Ana Sayfaya Don",
    he: "חזרה לדף הבית",
    ar: "العودة للرئيسية",
    uk: "На головну",
  },
};

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const orderId = searchParams.get("order");
  const returnUrl = searchParams.get("return");

  const t = useCallback(
    (key: keyof typeof translations) => {
      return translations[key][locale as keyof (typeof translations)[typeof key]] || translations[key].en;
    },
    [locale]
  );

  useEffect(() => {
    if (!orderId) return;

    const successReturnUrl = returnUrl || window.location.origin + "/" + locale + "/payment/success";
    
    const bogPaymentUrl = "https://visitgeorgia.online/" + locale + "/payment?order=" + orderId + "&return=" + encodeURIComponent(successReturnUrl);
    
    window.location.href = bogPaymentUrl;
  }, [orderId, locale, returnUrl]);

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("orderNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("orderNotFoundDesc")}</p>
          <Link
            href={"/" + locale}
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mb-4"></div>
      <p className="text-gray-600">{t("redirecting")}</p>
    </div>
  );
}