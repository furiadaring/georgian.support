/**
 * Email utility using Mailcow SMTP
 * For Georgian Support website
 */

import nodemailer from "nodemailer";

// SMTP configuration for Mailcow
const SMTP_HOST = process.env.SMTP_HOST || "mail.georgian-legal.group";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "info@georgian-legal.group";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "Georgian Support <info@georgian-legal.group>";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      // Accept self-signed certificates
      rejectUnauthorized: false,
    },
  });
};

// Email templates for insurance PDF
const EMAIL_TEMPLATES: Record<string, { subject: string; html: (name: string, orderId: string) => string }> = {
  en: {
    subject: "Your Insurance Policy is Ready - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Insurance</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Hello ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Great news! Your insurance policy for order <strong>#${orderId}</strong> is ready.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Please find your insurance policy PDF attached to this email. Keep it safe for your records.
          </p>
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              💡 <strong>Tip:</strong> Save this PDF to your phone for easy access during your travels in Georgia.
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            If you have any questions, feel free to contact us.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Georgian Support Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. All rights reserved.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ru: {
    subject: "Ваш страховой полис готов - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Страхование</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Здравствуйте, ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Отличные новости! Ваш страховой полис по заказу <strong>#${orderId}</strong> готов.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Пожалуйста, найдите PDF-файл вашего страхового полиса во вложении к этому письму. Сохраните его для ваших записей.
          </p>
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              💡 <strong>Совет:</strong> Сохраните этот PDF на телефон для быстрого доступа во время путешествия по Грузии.
            </p>
          </div>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Если у вас есть вопросы, свяжитесь с нами.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            С уважением,<br>
            <strong>Команда Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Все права защищены.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ka: {
    subject: "თქვენი სადაზღვევო პოლისი მზადაა - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support დაზღვევა</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">გამარჯობა, ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            შესანიშნავი სიახლე! თქვენი სადაზღვევო პოლისი შეკვეთა <strong>#${orderId}</strong> მზადაა.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            გთხოვთ, იხილეთ თქვენი სადაზღვევო პოლისის PDF ფაილი ამ წერილის დანართში.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            თუ გაქვთ შეკითხვები, დაგვიკავშირდით.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            პატივისცემით,<br>
            <strong>Georgian Support გუნდი</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. ყველა უფლება დაცულია.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  uk: {
    subject: "Ваш страховий поліс готовий - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Страхування</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Вітаємо, ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Чудові новини! Ваш страховий поліс за замовленням <strong>#${orderId}</strong> готовий.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Будь ласка, знайдіть PDF-файл вашого страхового полісу у вкладенні до цього листа.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Якщо у вас є питання, зв'яжіться з нами.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            З повагою,<br>
            <strong>Команда Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Усі права захищені.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  tr: {
    subject: "Sigorta Poliçeniz Hazır - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Sigorta</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Merhaba ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Harika haberler! <strong>#${orderId}</strong> numaralı sipariş için sigorta poliçeniz hazır.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Sigorta poliçenizin PDF dosyasını bu e-postanın ekinde bulabilirsiniz.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Sorularınız varsa bizimle iletişime geçin.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Saygılarımızla,<br>
            <strong>Georgian Support Ekibi</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Tüm hakları saklıdır.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  he: {
    subject: "פוליסת הביטוח שלך מוכנה - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ ביטוח Georgian Support</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">שלום ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            חדשות נהדרות! פוליסת הביטוח שלך להזמנה <strong>#${orderId}</strong> מוכנה.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            אנא מצא את קובץ ה-PDF של פוליסת הביטוח שלך מצורף למייל זה.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            אם יש לך שאלות, צור איתנו קשר.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            בברכה,<br>
            <strong>צוות Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. כל הזכויות שמורות.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ar: {
    subject: "وثيقة التأمين الخاصة بك جاهزة - Georgian Support",
    html: (name, orderId) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ تأمين Georgian Support</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">مرحباً ${name}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            أخبار رائعة! وثيقة التأمين الخاصة بك للطلب <strong>#${orderId}</strong> جاهزة.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            يرجى العثور على ملف PDF لوثيقة التأمين الخاصة بك مرفقاً بهذا البريد الإلكتروني.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            إذا كان لديك أي أسئلة، تواصل معنا.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            مع أطيب التحيات،<br>
            <strong>فريق Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. جميع الحقوق محفوظة.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
};

interface SendInsuranceEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  locale: string;
  pdfBase64: string;
  pdfName: string;
}

export async function sendInsuranceEmail({
  to,
  customerName,
  orderId,
  locale,
  pdfBase64,
  pdfName,
}: SendInsuranceEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!SMTP_PASS) {
    console.warn("[Email] SMTP_PASS not configured, skipping email");
    return { success: false, error: "SMTP not configured" };
  }

  try {
    const transporter = createTransporter();
    const template = EMAIL_TEMPLATES[locale] || EMAIL_TEMPLATES.en;

    // Convert base64 to buffer for attachment
    // Remove data URL prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject: template.subject,
      html: template.html(customerName, orderId),
      attachments: [
        {
          filename: pdfName || `insurance-${orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Insurance email sent to ${to} for order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send insurance email:", error);
    return { success: false, error: String(error) };
  }
}

// Order Received Email Templates (no attachment, waiting for payment)
interface OrderDetails {
  orderId: string;
  customerName: string;
  planName: string;
  periodStart: string;
  periodEnd: string;
  price: number;
  paymentMethod: string;
}

const ORDER_RECEIVED_TEMPLATES: Record<string, { subject: string; html: (details: OrderDetails) => string }> = {
  en: {
    subject: "Order Received - Georgian Support Insurance",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Insurance</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Hello ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Thank you for your order! We have received your insurance request.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Order Number:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Insurance Plan:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Coverage Period:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Amount:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Payment Method:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>Awaiting Payment:</strong> Your order is waiting for payment confirmation. Once we receive your payment, we will process your policy and send it to your email.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/en/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 Complete Payment
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            If you have any questions, feel free to contact us via WhatsApp, Telegram, or email.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Best regards,<br>
            <strong>Georgian Support Team</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. All rights reserved.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ru: {
    subject: "Заказ получен - Страхование Georgian Support",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Страхование</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Здравствуйте, ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Спасибо за ваш заказ! Мы получили вашу заявку на страхование.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Детали заказа</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Номер заказа:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Страховой план:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Период покрытия:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Сумма:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Способ оплаты:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>Ожидание оплаты:</strong> Ваш заказ ожидает подтверждения оплаты. После получения платежа мы обработаем ваш полис и отправим его на вашу почту.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/ru/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 Завершить оплату
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Если у вас есть вопросы, свяжитесь с нами через WhatsApp, Telegram или email.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            С уважением,<br>
            <strong>Команда Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Все права защищены.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ka: {
    subject: "შეკვეთა მიღებულია - Georgian Support დაზღვევა",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support დაზღვევა</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">გამარჯობა, ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            გმადლობთ შეკვეთისთვის! თქვენი დაზღვევის მოთხოვნა მიღებულია.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">შეკვეთის დეტალები</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">შეკვეთის ნომერი:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">სადაზღვევო გეგმა:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">დაფარვის პერიოდი:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">თანხა:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">გადახდის მეთოდი:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>გადახდის მოლოდინში:</strong> თქვენი შეკვეთა ელოდება გადახდის დადასტურებას. გადახდის მიღების შემდეგ დავამუშავებთ თქვენს პოლისს და გამოგიგზავნით ელფოსტაზე.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/ka/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 გადახდის დასრულება
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            თუ გაქვთ შეკითხვები, დაგვიკავშირდით WhatsApp, Telegram ან ელფოსტით.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            პატივისცემით,<br>
            <strong>Georgian Support გუნდი</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. ყველა უფლება დაცულია.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  uk: {
    subject: "Замовлення отримано - Страхування Georgian Support",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Страхування</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Вітаємо, ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Дякуємо за замовлення! Ми отримали вашу заявку на страхування.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Деталі замовлення</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Номер замовлення:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Страховий план:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Період покриття:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Сума:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Спосіб оплати:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>Очікування оплати:</strong> Ваше замовлення очікує підтвердження оплати. Після отримання платежу ми обробимо ваш поліс і надішлемо на вашу пошту.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/uk/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 Завершити оплату
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Якщо у вас є питання, зв'яжіться з нами через WhatsApp, Telegram або email.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            З повагою,<br>
            <strong>Команда Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Усі права захищені.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  tr: {
    subject: "Sipariş Alındı - Georgian Support Sigorta",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ Georgian Support Sigorta</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">Merhaba ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Siparişiniz için teşekkürler! Sigorta talebinizi aldık.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Sipariş Detayları</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">Sipariş Numarası:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Sigorta Planı:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Teminat Dönemi:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Tutar:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">Ödeme Yöntemi:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>Ödeme Bekleniyor:</strong> Siparişiniz ödeme onayı bekliyor. Ödemenizi aldıktan sonra poliçenizi işleme alıp e-postanıza göndereceğiz.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/tr/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 Ödemeyi Tamamla
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Sorularınız varsa WhatsApp, Telegram veya e-posta ile bize ulaşın.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            Saygılarımızla,<br>
            <strong>Georgian Support Ekibi</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. Tüm hakları saklıdır.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  he: {
    subject: "ההזמנה התקבלה - ביטוח Georgian Support",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ ביטוח Georgian Support</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">שלום ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            תודה על ההזמנה! קיבלנו את בקשת הביטוח שלך.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">פרטי ההזמנה</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">מספר הזמנה:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">תוכנית ביטוח:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">תקופת כיסוי:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">סכום:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">אמצעי תשלום:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>ממתין לתשלום:</strong> ההזמנה שלך ממתינה לאישור תשלום. לאחר קבלת התשלום נעבד את הפוליסה ונשלח אליך במייל.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/he/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 השלם תשלום
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            אם יש לך שאלות, צור איתנו קשר דרך WhatsApp, Telegram או מייל.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            בברכה,<br>
            <strong>צוות Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. כל הזכויות שמורות.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
  ar: {
    subject: "تم استلام الطلب - تأمين Georgian Support",
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; direction: rtl;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🛡️ تأمين Georgian Support</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
          <h2 style="color: #111827; margin-top: 0;">مرحباً ${d.customerName}!</h2>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            شكراً لطلبك! لقد تلقينا طلب التأمين الخاص بك.
          </p>

          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">تفاصيل الطلب</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6b7280;">رقم الطلب:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">#${d.orderId}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">خطة التأمين:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.planName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">فترة التغطية:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.periodStart} - ${d.periodEnd}</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">المبلغ:</td><td style="padding: 8px 0; font-weight: 600; color: #2563eb; font-size: 18px;">${d.price} GEL</td></tr>
              <tr><td style="padding: 8px 0; color: #6b7280;">طريقة الدفع:</td><td style="padding: 8px 0; font-weight: 600; color: #1f2937;">${d.paymentMethod}</td></tr>
            </table>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              ⏳ <strong>في انتظار الدفع:</strong> طلبك في انتظار تأكيد الدفع. بمجرد استلام الدفع، سنقوم بمعالجة وثيقتك وإرسالها إلى بريدك الإلكتروني.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://georgian.support/ar/payment?order=${d.orderId}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              💳 إكمال الدفع
            </a>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            إذا كان لديك أي أسئلة، تواصل معنا عبر واتساب أو تيليجرام أو البريد الإلكتروني.
          </p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            مع أطيب التحيات،<br>
            <strong>فريق Georgian Support</strong>
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Georgian Support. جميع الحقوق محفوظة.</p>
          <p>🌍 georgian.support</p>
        </div>
      </div>
    `,
  },
};

interface SendOrderReceivedEmailParams {
  to: string;
  customerName: string;
  orderId: string;
  locale: string;
  planName: string;
  periodStart: string;
  periodEnd: string;
  price: number;
  paymentMethod: string;
}

export async function sendOrderReceivedEmail({
  to,
  customerName,
  orderId,
  locale,
  planName,
  periodStart,
  periodEnd,
  price,
  paymentMethod,
}: SendOrderReceivedEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!SMTP_PASS) {
    console.warn("[Email] SMTP_PASS not configured, skipping email");
    return { success: false, error: "SMTP not configured" };
  }

  try {
    const transporter = createTransporter();
    const template = ORDER_RECEIVED_TEMPLATES[locale] || ORDER_RECEIVED_TEMPLATES.en;

    const mailOptions = {
      from: EMAIL_FROM,
      to,
      subject: template.subject,
      html: template.html({
        orderId,
        customerName,
        planName,
        periodStart,
        periodEnd,
        price,
        paymentMethod,
      }),
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Email] Order received email sent to ${to} for order ${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send order received email:", error);
    return { success: false, error: String(error) };
  }
}
