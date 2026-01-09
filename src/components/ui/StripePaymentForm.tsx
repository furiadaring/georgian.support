"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement,
} from "@stripe/react-stripe-js";

interface StripePaymentFormProps {
  clientSecret: string;
  orderId: string;
  totalAmount: string;
  processingFee: string;
  originalAmount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  locale: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export default function StripePaymentForm({
  clientSecret,
  orderId,
  totalAmount,
  processingFee,
  originalAmount,
  onSuccess,
  onError,
  locale,
  customerName,
  customerEmail,
  customerPhone,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [retryCount, setRetryCount] = useState(0);
  const [showExpressCheckout, setShowExpressCheckout] = useState(true);

  // Translate error messages
  const getErrorMessage = (error: string): string => {
    const errorMap: Record<string, Record<string, string>> = {
      card_declined: {
        en: "Your card was declined. Please try another card.",
        ru: "Ваша карта отклонена. Попробуйте другую карту.",
        ka: "თქვენი ბარათი უარყოფილია. სცადეთ სხვა ბარათი.",
        tr: "Kartınız reddedildi. Lütfen başka bir kart deneyin.",
        he: "הכרטיס שלך נדחה. אנא נסה כרטיס אחר.",
        ar: "تم رفض بطاقتك. يرجى المحاولة ببطاقة أخرى.",
        uk: "Вашу картку відхилено. Спробуйте іншу картку."
      },
      insufficient_funds: {
        en: "Insufficient funds. Please use another card.",
        ru: "Недостаточно средств. Используйте другую карту.",
        ka: "არასაკმარისი თანხა. გამოიყენეთ სხვა ბარათი.",
        tr: "Yetersiz bakiye. Lütfen başka bir kart kullanın.",
        he: "יתרה לא מספיקה. אנא השתמש בכרטיס אחר.",
        ar: "رصيد غير كافٍ. يرجى استخدام بطاقة أخرى.",
        uk: "Недостатньо коштів. Використовуйте іншу картку."
      },
      expired_card: {
        en: "Your card has expired. Please use another card.",
        ru: "Срок действия вашей карты истёк. Используйте другую карту.",
        ka: "თქვენი ბარათის ვადა გასულია. გამოიყენეთ სხვა ბარათი.",
        tr: "Kartınızın süresi dolmuş. Lütfen başka bir kart kullanın.",
        he: "תוקף הכרטיס שלך פג. אנא השתמש בכרטיס אחר.",
        ar: "انتهت صلاحية بطاقتك. يرجى استخدام بطاقة أخرى.",
        uk: "Термін дії вашої картки закінчився. Використовуйте іншу картку."
      },
      incorrect_cvc: {
        en: "Incorrect security code. Please check and try again.",
        ru: "Неверный код безопасности. Проверьте и попробуйте снова.",
        ka: "არასწორი უსაფრთხოების კოდი. შეამოწმეთ და სცადეთ ხელახლა.",
        tr: "Yanlış güvenlik kodu. Lütfen kontrol edip tekrar deneyin.",
        he: "קוד אבטחה שגוי. אנא בדוק ונסה שוב.",
        ar: "رمز الأمان غير صحيح. يرجى التحقق والمحاولة مرة أخرى.",
        uk: "Невірний код безпеки. Перевірте та спробуйте знову."
      },
      processing_error: {
        en: "Payment processing error. Please try again.",
        ru: "Ошибка обработки платежа. Попробуйте снова.",
        ka: "გადახდის დამუშავების შეცდომა. სცადეთ ხელახლა.",
        tr: "Ödeme işleme hatası. Lütfen tekrar deneyin.",
        he: "שגיאת עיבוד תשלום. אנא נסה שוב.",
        ar: "خطأ في معالجة الدفع. يرجى المحاولة مرة أخرى.",
        uk: "Помилка обробки платежу. Спробуйте знову."
      }
    };

    // Check for known error patterns
    for (const [key, translations] of Object.entries(errorMap)) {
      if (error.toLowerCase().includes(key.replace(/_/g, ' '))) {
        return translations[locale] || translations.en || error;
      }
    }

    // Default network error message
    if (error.includes('network') || error.includes('connection')) {
      const networkErrors: Record<string, string> = {
        en: "Network error. Please check your connection and try again.",
        ru: "Ошибка сети. Проверьте подключение и попробуйте снова.",
        ka: "ქსელის შეცდომა. შეამოწმეთ კავშირი და სცადეთ ხელახლა.",
        tr: "Ağ hatası. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
        he: "שגיאת רשת. אנא בדוק את הקישור שלך ונסה שוב.",
        ar: "خطأ في الشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
        uk: "Помилка мережі. Перевірте підключення та спробуйте знову."
      };
      return networkErrors[locale] || networkErrors.en;
    }

    return error;
  };

  const handleSubmit = async (e: React.FormEvent, isRetry = false) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${locale}/payment/success?order_id=${orderId}`,
          payment_method_data: {
            billing_details: {
              name: customerName || undefined,
              email: customerEmail || undefined,
              phone: customerPhone || undefined,
              address: {
                country: 'GE'
              }
            }
          }
        },
        redirect: "if_required",
      });

      if (error) {
        const translatedError = getErrorMessage(error.message || "");
        setErrorMessage(translatedError);
        onError(translatedError);

        // Auto-retry on network errors (max 2 retries)
        if (!isRetry && retryCount < 2 && (error.message?.includes('network') || error.message?.includes('connection'))) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => handleSubmit(e, true), 2000);
        }
      } else {
        // Payment successful - wait for confirmation
        console.log("Payment confirmed successfully");
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment processing error";
      const translatedError = getErrorMessage(message);
      setErrorMessage(translatedError);
      onError(translatedError);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Express Checkout (Apple Pay/Google Pay)
  const handleExpressCheckout = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/${locale}/payment/success?order_id=${orderId}`,
          payment_method_data: {
            billing_details: {
              name: customerName || undefined,
              email: customerEmail || undefined,
              phone: customerPhone || undefined,
              address: {
                country: 'GE'
              }
            }
          }
        },
        redirect: "if_required",
      });

      if (error) {
        const translatedError = getErrorMessage(error.message || "");
        setErrorMessage(translatedError);
        onError(translatedError);
      } else {
        console.log("Express payment confirmed successfully");
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment processing error";
      const translatedError = getErrorMessage(message);
      setErrorMessage(translatedError);
      onError(translatedError);
    } finally {
      setIsProcessing(false);
    }
  };

  const translations = {
    orPayWithCard: {
      en: 'or pay with card',
      ru: 'или оплатите картой',
      ka: 'ან გადაიხადეთ ბარათით',
      tr: 'veya kartla ödeyin',
      he: 'או שלם בכרטיס',
      ar: 'أو الدفع بالبطاقة',
      uk: 'або оплатіть карткою'
    },
    orderAmount: {
      en: 'Order Amount:',
      ru: 'Сумма заказа:',
      ka: 'შეკვეთის თანხა:',
      tr: 'Sipariş tutarı:',
      he: 'סכום ההזמנה:',
      ar: 'مبلغ الطلب:',
      uk: 'Сума замовлення:'
    },
    processingFee: {
      en: 'Processing Fee:',
      ru: 'Комиссия обработки:',
      ka: 'დამუშავების საკომისიო:',
      tr: 'İşlem ücreti:',
      he: 'עמלת עיבוד:',
      ar: 'رسوم المعالجة:',
      uk: 'Комісія обробки:'
    },
    totalToPay: {
      en: 'Total to Pay:',
      ru: 'Итого к оплате:',
      ka: 'სულ გადასახდელი:',
      tr: 'Toplam ödenecek:',
      he: 'סהכ לתשלום:',
      ar: 'المجموع المطلوب:',
      uk: 'Всього до сплати:'
    },
    processing: {
      en: 'Processing...',
      ru: 'Обработка...',
      ka: 'მუშავდება...',
      tr: 'İşleniyor...',
      he: 'מעבד...',
      ar: 'جاري المعالجة...',
      uk: 'Обробка...'
    },
    pay: {
      en: 'Pay',
      ru: 'Оплатить',
      ka: 'გადახდა',
      tr: 'Öde',
      he: 'שלם',
      ar: 'ادفع',
      uk: 'Оплатити'
    },
    securePayment: {
      en: 'Secure payment powered by Stripe',
      ru: 'Защищённый платёж через Stripe',
      ka: 'დაცული გადახდა Stripe-ის მეშვეობით',
      tr: 'Stripe ile güvenli ödeme',
      he: 'תשלום מאובטח באמצעות Stripe',
      ar: 'دفع آمن عبر Stripe',
      uk: 'Захищений платіж через Stripe'
    },
    retry: {
      en: 'Retry',
      ru: 'Попытка',
      ka: 'მცდელობა',
      tr: 'Deneme',
      he: 'ניסיון',
      ar: 'محاولة',
      uk: 'Спроба'
    },
    of: {
      en: 'of',
      ru: 'из',
      ka: '-დან',
      tr: '/',
      he: 'מתוך',
      ar: 'من',
      uk: 'з'
    },
    tryAnotherCard: {
      en: '💡 Try another card or contact your bank',
      ru: '💡 Попробуйте другую карту или свяжитесь с банком',
      ka: '💡 სცადეთ სხვა ბარათი ან დაუკავშირდით ბანკს',
      tr: '💡 Başka bir kart deneyin veya bankanızla iletişime geçin',
      he: '💡 נסה כרטיס אחר או צור קשר עם הבנק',
      ar: '💡 جرب بطاقة أخرى أو اتصل بالبنك',
      uk: '💡 Спробуйте іншу картку або зверніться до банку'
    }
  };

  const t = (key: keyof typeof translations) => {
    return translations[key][locale as keyof typeof translations[typeof key]] || translations[key].en;
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Express Checkout (Apple Pay / Google Pay) */}
      {showExpressCheckout && (
        <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '24px' }}>
          <ExpressCheckoutElement
            onConfirm={handleExpressCheckout}
            options={{
              buttonType: {
                applePay: "plain",
                googlePay: "plain"
              },
              buttonTheme: {
                applePay: "black",
                googlePay: "black"
              },
              buttonHeight: 48
            }}
            onReady={(e: { availablePaymentMethods?: Record<string, boolean> }) => {
              // Hide if no wallets available
              if (!e.availablePaymentMethods) {
                setShowExpressCheckout(false);
              }
            }}
          />
        </div>
      )}

      {/* Divider */}
      {showExpressCheckout && (
        <div style={{ position: 'relative', marginTop: '8px', marginBottom: '8px' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%', borderTop: '1px solid #e5e7eb' }}></div>
          </div>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <span style={{ padding: '0 16px', backgroundColor: 'white', color: '#6b7280', fontSize: '14px' }}>
              {t('orPayWithCard')}
            </span>
          </div>
        </div>
      )}

      {/* Payment breakdown */}
      <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>{t('orderAmount')}</span>
          <span style={{ fontWeight: 500 }}>{originalAmount.toFixed(2)} GEL</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#6b7280' }}>{t('processingFee')}</span>
          <span style={{ fontWeight: 500 }}>+{processingFee} GEL</span>
        </div>
        <div style={{ borderTop: '1px solid #d1d5db', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>{t('totalToPay')}</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#16a34a' }}>{totalAmount} GEL</span>
        </div>
      </div>

      {/* Payment Element with mobile optimization */}
      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <PaymentElement options={{
          layout: "tabs",
          wallets: {
            applePay: "auto",
            googlePay: "auto"
          },
          defaultValues: {
            billingDetails: {
              name: customerName || undefined,
              email: customerEmail || undefined,
              phone: customerPhone || undefined,
              address: {
                country: 'GE'
              }
            }
          },
          fields: {
            billingDetails: {
              name: 'auto',
              email: 'auto',
              phone: 'auto',
              address: {
                country: 'never' // Lock country to Georgia
              }
            }
          }
        }} />
      </div>

      {/* Error message with retry suggestion */}
      {errorMessage && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <svg style={{ width: '20px', height: '20px', color: '#dc2626', marginTop: '2px', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#991b1b', fontWeight: 500, margin: 0 }}>{errorMessage}</p>
              {retryCount > 0 && (
                <p style={{ color: '#dc2626', fontSize: '14px', marginTop: '4px', margin: 0 }}>
                  {`${t('retry')} ${retryCount} ${t('of')} 2...`}
                </p>
              )}
            </div>
          </div>
          {errorMessage.toLowerCase().includes('declined') && (
            <p style={{ fontSize: '14px', color: '#b91c1c', margin: 0 }}>
              {t('tryAnotherCard')}
            </p>
          )}
        </div>
      )}

      {/* Submit button with loading animation */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: '100%',
          backgroundColor: (!stripe || isProcessing) ? '#9ca3af' : '#16a34a',
          color: 'white',
          fontWeight: 600,
          padding: '14px 16px',
          borderRadius: '8px',
          border: 'none',
          cursor: (!stripe || isProcessing) ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '16px',
          marginTop: '8px'
        }}
      >
        {isProcessing ? (
          <>
            <svg style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{t('processing')}</span>
          </>
        ) : (
          <span>{`${t('pay')} ${totalAmount} GEL`}</span>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
        <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <span>{t('securePayment')}</span>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
