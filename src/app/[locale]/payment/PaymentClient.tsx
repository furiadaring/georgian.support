"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { loadStripe, Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import StripePaymentForm from "@/components/ui/StripePaymentForm";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planName: string;
  planPrice: number;
  status: string;
  paymentMethod: string;
}

const translations = {
  title: {
    en: "Complete Your Payment",
    ru: "Завершите оплату",
    ka: "დაასრულეთ გადახდა",
    tr: "Ödemenizi Tamamlayın",
    he: "השלם את התשלום",
    ar: "أكمل الدفع",
    uk: "Завершіть оплату",
  },
  orderNumber: {
    en: "Order",
    ru: "Заказ",
    ka: "შეკვეთა",
    tr: "Sipariş",
    he: "הזמנה",
    ar: "طلب",
    uk: "Замовлення",
  },
  plan: {
    en: "Plan",
    ru: "Тариф",
    ka: "გეგმა",
    tr: "Plan",
    he: "תוכנית",
    ar: "الخطة",
    uk: "Тариф",
  },
  customer: {
    en: "Customer",
    ru: "Клиент",
    ka: "კლიენტი",
    tr: "Müşteri",
    he: "לקוח",
    ar: "العميل",
    uk: "Клієнт",
  },
  amount: {
    en: "Amount",
    ru: "Сумма",
    ka: "თანხა",
    tr: "Tutar",
    he: "סכום",
    ar: "المبلغ",
    uk: "Сума",
  },
  loading: {
    en: "Loading order details...",
    ru: "Загрузка данных заказа...",
    ka: "შეკვეთის მონაცემების ჩატვირთვა...",
    tr: "Sipariş bilgileri yükleniyor...",
    he: "טוען פרטי הזמנה...",
    ar: "جاري تحميل تفاصيل الطلب...",
    uk: "Завантаження даних замовлення...",
  },
  orderNotFound: {
    en: "Order not found",
    ru: "Заказ не найден",
    ka: "შეკვეთა ვერ მოიძებნა",
    tr: "Sipariş bulunamadı",
    he: "ההזמנה לא נמצאה",
    ar: "الطلب غير موجود",
    uk: "Замовлення не знайдено",
  },
  orderNotFoundDesc: {
    en: "The order you're looking for doesn't exist or has expired.",
    ru: "Заказ, который вы ищете, не существует или истёк срок его действия.",
    ka: "შეკვეთა, რომელსაც ეძებთ, არ არსებობს ან ვადა გასულია.",
    tr: "Aradığınız sipariş mevcut değil veya süresi dolmuş.",
    he: "ההזמנה שאתה מחפש לא קיימת או שפג תוקפה.",
    ar: "الطلب الذي تبحث عنه غير موجود أو انتهت صلاحيته.",
    uk: "Замовлення, яке ви шукаєте, не існує або термін його дії закінчився.",
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
  alreadyPaid: {
    en: "This order has already been paid",
    ru: "Этот заказ уже оплачен",
    ka: "ეს შეკვეთა უკვე გადახდილია",
    tr: "Bu sipariş zaten ödendi",
    he: "הזמנה זו כבר שולמה",
    ar: "تم دفع هذا الطلب بالفعل",
    uk: "Це замовлення вже оплачено",
  },
  redirecting: {
    en: "Redirecting to success page...",
    ru: "Перенаправление на страницу успеха...",
    ka: "გადამისამართება წარმატების გვერდზე...",
    tr: "Başarı sayfasına yönlendiriliyor...",
    he: "מעביר לדף ההצלחה...",
    ar: "جاري التوجيه إلى صفحة النجاح...",
    uk: "Перенаправлення на сторінку успіху...",
  },
  paymentFailed: {
    en: "Payment failed. Please try again.",
    ru: "Ошибка оплаты. Попробуйте снова.",
    ka: "გადახდა ვერ მოხერხდა. სცადეთ ხელახლა.",
    tr: "Ödeme başarısız. Lütfen tekrar deneyin.",
    he: "התשלום נכשל. אנא נסה שוב.",
    ar: "فشل الدفع. يرجى المحاولة مرة أخرى.",
    uk: "Помилка оплати. Спробуйте знову.",
  },
  securePayment: {
    en: "🔒 Secure payment via Stripe",
    ru: "🔒 Безопасная оплата через Stripe",
    ka: "🔒 უსაფრთხო გადახდა Stripe-ით",
    tr: "🔒 Stripe ile güvenli ödeme",
    he: "🔒 תשלום מאובטח באמצעות Stripe",
    ar: "🔒 دفع آمن عبر Stripe",
    uk: "🔒 Безпечна оплата через Stripe",
  },
};

export default function PaymentClient() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as string) || "en";

  const orderId = searchParams.get("order");
  const returnUrl = searchParams.get("return"); // External site return URL

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [processingFee, setProcessingFee] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const t = useCallback(
    (key: keyof typeof translations) => {
      return translations[key][locale as keyof (typeof translations)[typeof key]] || translations[key].en;
    },
    [locale]
  );

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError(t("orderNotFound"));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("Order not found");
        }
        const data = await response.json();
        setOrder(data);

        // Check if already paid
        if (data.status === "paid" || data.status === "confirmed") {
          const successUrl = returnUrl
            ? `/${locale}/payment/success?order_id=${orderId}&return=${encodeURIComponent(returnUrl)}`
            : `/${locale}/payment/success?order_id=${orderId}`;
          router.replace(successUrl);
          return;
        }

        // Only create payment intent if card payment
        if (data.paymentMethod === "card") {
          const paymentResponse = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.id,
              amount: data.planPrice,
              customerEmail: data.customerEmail,
              customerName: data.customerName,
            }),
          });

          if (!paymentResponse.ok) {
            throw new Error("Failed to create payment");
          }

          const paymentData = await paymentResponse.json();
          setClientSecret(paymentData.clientSecret);
          setTotalAmount(paymentData.totalAmount);
          setProcessingFee(paymentData.processingFee);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(t("orderNotFound"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, locale, router, t]);

  const handlePaymentSuccess = () => {
    const successUrl = returnUrl
      ? `/${locale}/payment/success?order_id=${orderId}&return=${encodeURIComponent(returnUrl)}`
      : `/${locale}/payment/success?order_id=${orderId}`;
    router.push(successUrl);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  // Stripe appearance
  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#16a34a",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#dc2626",
      fontFamily: "system-ui, sans-serif",
      spacingUnit: "4px",
      borderRadius: "8px",
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("orderNotFound")}</h1>
          <p className="text-gray-600 mb-6">{t("orderNotFoundDesc")}</p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  // If payment method is not card, show a message
  if (order.paymentMethod !== "card") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">💳</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("orderNumber")} #{order.id}</h1>
          <p className="text-gray-600 mb-6">
            {locale === "ru" ? "Этот заказ будет оплачен наличными или переводом" : "This order will be paid in cash or by transfer"}
          </p>
          <Link
            href={`/${locale}`}
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Georgian Support</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <span className="text-gray-600">{t("orderNumber")}</span>
            <span className="font-mono font-medium text-gray-800">{order.id}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">{t("plan")}</span>
              <span className="font-medium text-gray-800">{order.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("customer")}</span>
              <span className="font-medium text-gray-800">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("amount")}</span>
              <span className="font-bold text-lg text-green-600">{order.planPrice} GEL</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance,
              locale: locale as "en" | "ru" | "tr" | "he" | "ar",
            }}
          >
            <StripePaymentForm
              clientSecret={clientSecret}
              orderId={order.id}
              totalAmount={totalAmount}
              processingFee={processingFee}
              originalAmount={order.planPrice}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              locale={locale}
              customerName={order.customerName}
              customerEmail={order.customerEmail}
              customerPhone={order.customerPhone}
            />
          </Elements>

          {paymentError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{paymentError}</p>
            </div>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">{t("securePayment")}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Georgian Support</p>
          <p className="mt-1">
            <Link href={`/${locale}/terms`} className="hover:text-green-600">
              {locale === "ru" ? "Условия использования" : "Terms of Service"}
            </Link>
            {" · "}
            <Link href={`/${locale}/privacy`} className="hover:text-green-600">
              {locale === "ru" ? "Политика конфиденциальности" : "Privacy Policy"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
