const fs = require('fs');
const path = require('path');

const localeDir = path.join(__dirname, '..', 'src', 'lib', 'i18n', 'locales');
const newKeys = {
  en: {
    privacyConsent: "By clicking the button, you agree to our privacy policy",
    changePaymentMethod: "Change payment method",
    otherBankNote: "If you are paying from a bank other than Bank of Georgia, please send us the payment confirmation via WhatsApp, Telegram, or email so we can process your order faster.",
    cryptoPayment: "Crypto (USDT TRC-20)",
    cryptoPaymentDesc: "Pay with USDT on Tron network",
    cryptoPaymentTitle: "Crypto Payment (USDT TRC-20)",
    cryptoPaymentInstructions: "Please transfer USDT to the following TRC-20 wallet address",
    cryptoPaymentNote: "Send only USDT on the TRC-20 network. Sending other tokens or using wrong network will result in loss of funds. After payment, please send a screenshot of the transaction to our WhatsApp or Telegram.",
    walletAddress: "TRC-20 Wallet Address"
  },
  ru: {
    privacyConsent: "Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности",
    changePaymentMethod: "Изменить способ оплаты",
    otherBankNote: "Если вы оплачиваете из другого банка (не Bank of Georgia), пожалуйста, отправьте подтверждение оплаты через WhatsApp, Telegram или email для ускорения обработки заказа.",
    cryptoPayment: "Крипто (USDT TRC-20)",
    cryptoPaymentDesc: "Оплата USDT в сети Tron",
    cryptoPaymentTitle: "Крипто-оплата (USDT TRC-20)",
    cryptoPaymentInstructions: "Переведите USDT на следующий адрес кошелька TRC-20",
    cryptoPaymentNote: "Отправляйте только USDT в сети TRC-20. Отправка других токенов или использование другой сети приведёт к потере средств. После оплаты отправьте скриншот транзакции в WhatsApp или Telegram.",
    walletAddress: "Адрес кошелька TRC-20"
  },
  ka: {
    privacyConsent: "ღილაკზე დაჭერით თქვენ ეთანხმებით კონფიდენციალურობის პოლიტიკას",
    changePaymentMethod: "გადახდის მეთოდის შეცვლა",
    otherBankNote: "თუ გადახდა ხდება სხვა ბანკიდან (არა Bank of Georgia), გთხოვთ გამოგვიგზავნოთ გადახდის დადასტურება WhatsApp, Telegram ან ელფოსტით.",
    cryptoPayment: "კრიპტო (USDT TRC-20)",
    cryptoPaymentDesc: "გადახდა USDT-ით Tron ქსელში",
    cryptoPaymentTitle: "კრიპტო გადახდა (USDT TRC-20)",
    cryptoPaymentInstructions: "გთხოვთ გადარიცხოთ USDT შემდეგ TRC-20 საფულის მისამართზე",
    cryptoPaymentNote: "გაგზავნეთ მხოლოდ USDT TRC-20 ქსელში. სხვა ტოკენების გაგზავნა ან არასწორი ქსელის გამოყენება გამოიწვევს თანხის დაკარგვას.",
    walletAddress: "TRC-20 საფულის მისამართი"
  },
  uk: {
    privacyConsent: "Натискаючи кнопку, ви погоджуєтесь з політикою конфіденційності",
    changePaymentMethod: "Змінити спосіб оплати",
    otherBankNote: "Якщо ви оплачуєте з іншого банку (не Bank of Georgia), будь ласка, надішліть підтвердження оплати через WhatsApp, Telegram або email.",
    cryptoPayment: "Крипто (USDT TRC-20)",
    cryptoPaymentDesc: "Оплата USDT в мережі Tron",
    cryptoPaymentTitle: "Крипто-оплата (USDT TRC-20)",
    cryptoPaymentInstructions: "Переведіть USDT на наступну адресу гаманця TRC-20",
    cryptoPaymentNote: "Надсилайте лише USDT в мережі TRC-20. Надсилання інших токенів або використання іншої мережі призведе до втрати коштів.",
    walletAddress: "Адреса гаманця TRC-20"
  },
  tr: {
    privacyConsent: "Butona tıklayarak gizlilik politikasını kabul etmiş olursunuz",
    changePaymentMethod: "Ödeme yöntemini değiştir",
    otherBankNote: "Bank of Georgia dışında bir bankadan ödeme yapıyorsanız, lütfen ödeme onayını WhatsApp, Telegram veya e-posta ile gönderin.",
    cryptoPayment: "Kripto (USDT TRC-20)",
    cryptoPaymentDesc: "Tron ağında USDT ile ödeme",
    cryptoPaymentTitle: "Kripto Ödeme (USDT TRC-20)",
    cryptoPaymentInstructions: "Lütfen USDT'yi aşağıdaki TRC-20 cüzdan adresine aktarın",
    cryptoPaymentNote: "Yalnızca TRC-20 ağında USDT gönderin. Başka token göndermek veya yanlış ağ kullanmak fonların kaybına yol açar.",
    walletAddress: "TRC-20 Cüzdan Adresi"
  },
  he: {
    privacyConsent: "בלחיצה על הכפתור אתה מסכים למדיניות הפרטיות שלנו",
    changePaymentMethod: "שנה אמצעי תשלום",
    otherBankNote: "אם אתה משלם מבנק אחר (לא Bank of Georgia), אנא שלח אישור תשלום דרך WhatsApp, Telegram או אימייל.",
    cryptoPayment: "קריפטו (USDT TRC-20)",
    cryptoPaymentDesc: "תשלום ב-USDT ברשת Tron",
    cryptoPaymentTitle: "תשלום קריפטו (USDT TRC-20)",
    cryptoPaymentInstructions: "אנא העבר USDT לכתובת הארנק TRC-20 הבאה",
    cryptoPaymentNote: "שלח רק USDT ברשת TRC-20. שליחת טוקנים אחרים או שימוש ברשת שגויה תגרום לאובדן כספים.",
    walletAddress: "כתובת ארנק TRC-20"
  },
  ar: {
    privacyConsent: "بالنقر على الزر، فإنك توافق على سياسة الخصوصية الخاصة بنا",
    changePaymentMethod: "تغيير طريقة الدفع",
    otherBankNote: "إذا كنت تدفع من بنك آخر (غير Bank of Georgia)، يرجى إرسال تأكيد الدفع عبر WhatsApp أو Telegram أو البريد الإلكتروني.",
    cryptoPayment: "عملة رقمية (USDT TRC-20)",
    cryptoPaymentDesc: "الدفع بـ USDT على شبكة Tron",
    cryptoPaymentTitle: "الدفع بالعملة الرقمية (USDT TRC-20)",
    cryptoPaymentInstructions: "يرجى تحويل USDT إلى عنوان محفظة TRC-20 التالي",
    cryptoPaymentNote: "أرسل فقط USDT على شبكة TRC-20. إرسال رموز أخرى أو استخدام شبكة خاطئة سيؤدي إلى فقدان الأموال.",
    walletAddress: "عنوان محفظة TRC-20"
  }
};

Object.entries(newKeys).forEach(([locale, keys]) => {
  const filePath = path.join(localeDir, locale + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (!data.insuranceOrder) data.insuranceOrder = {};
  Object.entries(keys).forEach(([key, value]) => {
    data.insuranceOrder[key] = value;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log('Updated ' + locale + '.json');
});
console.log('Done!');
