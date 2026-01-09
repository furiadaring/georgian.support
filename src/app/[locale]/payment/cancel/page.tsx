"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const translations = {
  title: {
    en: "Payment Cancelled",
    ru: "Оплата отменена",
    ka: "გადახდა გაუქმებულია",
    tr: "Ödeme İptal Edildi",
    he: "התשלום בוטל",
    ar: "تم إلغاء الدفع",
    uk: "Оплату скасовано",
  },
  subtitle: {
    en: "Your payment was cancelled. No charges were made.",
    ru: "Ваша оплата была отменена. Средства не были списаны.",
    ka: "თქვენი გადახდა გაუქმდა. თანხა არ ჩამოიჭრა.",
    tr: "Ödemeniz iptal edildi. Herhangi bir ücret alınmadı.",
    he: "התשלום שלך בוטל. לא בוצעה חיובית.",
    ar: "تم إلغاء دفعتك. لم يتم خصم أي مبلغ.",
    uk: "Вашу оплату скасовано. Кошти не були списані.",
  },
  tryAgain: {
    en: "Try Again",
    ru: "Попробовать снова",
    ka: "სცადეთ ხელახლა",
    tr: "Tekrar Dene",
    he: "נסה שוב",
    ar: "حاول مرة أخرى",
    uk: "Спробувати знову",
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
  reasons: {
    en: "Common reasons for cancellation:",
    ru: "Частые причины отмены:",
    ka: "გაუქმების ხშირი მიზეზები:",
    tr: "İptalin yaygın nedenleri:",
    he: "סיבות נפוצות לביטול:",
    ar: "أسباب شائعة للإلغاء:",
    uk: "Поширені причини скасування:",
  },
  reason1: {
    en: "Payment was cancelled by the user",
    ru: "Оплата была отменена пользователем",
    ka: "გადახდა გააუქმა მომხმარებელმა",
    tr: "Ödeme kullanıcı tarafından iptal edildi",
    he: "התשלום בוטל על ידי המשתמש",
    ar: "تم إلغاء الدفع من قبل المستخدم",
    uk: "Оплату скасовано користувачем",
  },
  reason2: {
    en: "Card was declined by the bank",
    ru: "Карта была отклонена банком",
    ka: "ბარათი უარყოფილია ბანკის მიერ",
    tr: "Kart banka tarafından reddedildi",
    he: "הכרטיס נדחה על ידי הבנק",
    ar: "تم رفض البطاقة من قبل البنك",
    uk: "Картку відхилено банком",
  },
  reason3: {
    en: "Session expired",
    ru: "Сессия истекла",
    ka: "სესიის ვადა გასულია",
    tr: "Oturum süresi doldu",
    he: "פג תוקף הפגישה",
    ar: "انتهت صلاحية الجلسة",
    uk: "Сесія закінчилась",
  },
};

export default function CancelPage() {
  const params = useParams();
  const locale = (params.locale as string) || "en";

  const t = (key: keyof typeof translations) => {
    return translations[key][locale as keyof (typeof translations)[typeof key]] || translations[key].en;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Cancel Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* X Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("title")}</h1>
          <p className="text-gray-600 mb-6">{t("subtitle")}</p>

          {/* Reasons */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">{t("reasons")}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                {t("reason1")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                {t("reason2")}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                {t("reason3")}
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href={`/${locale}/insurance`}
              className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {t("tryAgain")}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {t("backToHome")}
            </Link>
          </div>

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
    </div>
  );
}
