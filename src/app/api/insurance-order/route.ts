import { NextRequest, NextResponse } from "next/server";
import { CONTACT } from "@/lib/constants";
import { saveOrder, generateOrderId, Order, saveSMSRecord } from "@/lib/orderStorage";
import { sendOrderConfirmationEmail } from "@/lib/email";

// Use dedicated order bot (same as visitgeorgia) or fallback to default
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
const SMS_API_KEY = process.env.SMS_API_KEY || "8b6b2e817c3e4d61baf1857da70be294";

// Map display plan names to database plan names (matching visitgeorgia database)
// DB uses: VISITOR, STANDARD, OPTIMUM, PREMIUM, UNO ACTIVE, UNO ACTIVE+
const PLAN_NAME_TO_DB: Record<string, string> = {
  // English display names - map to exact DB names
  "VISITOR": "VISITOR",
  "STANDARD": "STANDARD",
  "OPTIMUM": "OPTIMUM",
  "PREMIUM": "PREMIUM",
  "UNO ACTIVE": "UNO ACTIVE",
  "UNO ACTIVE +": "UNO ACTIVE+",
  "UNO ACTIVE+": "UNO ACTIVE+",
  // Russian display names
  "ВИЗИТОР": "VISITOR",
  "СТАНДАРТ": "STANDARD",
  "ОПТИМУМ": "OPTIMUM",
  "ПРЕМИУМ": "PREMIUM",
};

// Convert display plan name to database plan name
function getPlanNameForDB(displayName: string): string {
  const upperName = displayName.toUpperCase().trim();
  return PLAN_NAME_TO_DB[upperName] || displayName;
}

// SMS messages in different languages
const SMS_MESSAGES: Record<string, (orderId: string, planName: string, price: string) => string> = {
  en: (orderId, planName, price) =>
    `GeorgianSupport: Order #${orderId} received! Plan: ${planName}, ${price} GEL. We will contact you soon. Thank you!`,
  ka: (orderId, planName, price) =>
    `GeorgianSupport: შეკვეთა #${orderId} მიღებულია! გეგმა: ${planName}, ${price} ლარი. მალე დაგიკავშირდებით. გმადლობთ!`,
  ru: (orderId, planName, price) =>
    `GeorgianSupport: Заказ #${orderId} получен! План: ${planName}, ${price} GEL. Мы скоро свяжемся с вами. Спасибо!`,
  uk: (orderId, planName, price) =>
    `GeorgianSupport: Замовлення #${orderId} отримано! План: ${planName}, ${price} GEL. Ми зв'яжемося з вами. Дякуємо!`,
  he: (orderId, planName, price) =>
    `GeorgianSupport: הזמנה #${orderId} התקבלה! תוכנית: ${planName}, ${price} GEL. ניצור קשר בקרוב. תודה!`,
  ar: (orderId, planName, price) =>
    `GeorgianSupport: تم استلام الطلب #${orderId}! الخطة: ${planName}، ${price} GEL. سنتواصل معك قريبًا. شكرًا!`,
  tr: (orderId, planName, price) =>
    `GeorgianSupport: Sipariş #${orderId} alındı! Plan: ${planName}, ${price} GEL. Sizinle yakında iletişime geçeceğiz. Teşekkürler!`,
};

// Get SMS message in user's language
function getSMSMessage(locale: string, orderId: string, planName: string, price: string): string {
  const messageFunc = SMS_MESSAGES[locale] || SMS_MESSAGES.en;
  return messageFunc(orderId, planName, price);
}

// Check if phone number is Georgian (starts with 995 or +995 or local format)
function isGeorgianNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return cleaned.startsWith("995") ||
         cleaned.startsWith("+995") ||
         cleaned.startsWith("5") || // Local Georgian mobile format
         cleaned.startsWith("05"); // Local Georgian mobile format with 0
}

// Format phone number to international format for SMS API (without + or 00)
function formatPhoneForSMS(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\+]/g, "");

  // If starts with 00, remove it
  if (cleaned.startsWith("00")) {
    cleaned = cleaned.substring(2);
  }

  // If starts with just 5 (Georgian mobile), add 995
  if (cleaned.startsWith("5") && cleaned.length === 9) {
    cleaned = "995" + cleaned;
  }

  // If starts with 05, replace with 9955
  if (cleaned.startsWith("05") && cleaned.length === 10) {
    cleaned = "995" + cleaned.substring(1);
  }

  return cleaned;
}

// SMS API response type
interface SMSAPIResponse {
  Success: boolean;
  Message: string;
  ErrorCode?: number;
  Output?: unknown;
}

// Send SMS to Georgian number and save to database
async function sendSMSWithTracking(
  orderId: string,
  phone: string,
  message: string,
  locale: string
): Promise<boolean> {
  let apiResponse: SMSAPIResponse | null = null;
  let success = false;
  let errorCode: number | undefined;
  let errorMessage: string | undefined;

  try {
    const destination = formatPhoneForSMS(phone);
    console.log("[SMS] Sending to:", destination);

    const params = new URLSearchParams({
      key: SMS_API_KEY,
      destination: destination,
      sender: "BATUMILINK",
      content: message,
    });

    const response = await fetch(`https://smsoffice.ge/api/v2/send/?${params.toString()}`, {
      method: "GET",
    });

    apiResponse = await response.json() as SMSAPIResponse;
    console.log("[SMS] Response:", apiResponse);

    if (apiResponse.Success) {
      console.log("[SMS] Sent successfully!");
      success = true;
    } else {
      console.error("[SMS] Error:", apiResponse.Message, "Code:", apiResponse.ErrorCode);
      errorCode = apiResponse.ErrorCode;
      errorMessage = apiResponse.Message;
    }
  } catch (error) {
    console.error("[SMS] Exception:", error);
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  // Save SMS record to database
  try {
    await saveSMSRecord({
      orderId,
      phone,
      message,
      locale,
      apiResponse: JSON.stringify(apiResponse),
      success,
      errorCode,
      errorMessage,
    });
    console.log("[SMS] Record saved to database");
  } catch (dbError) {
    console.error("[SMS] Failed to save record:", dbError);
  }

  return success;
}

export async function POST(request: NextRequest) {
  // Store order data for logging even if processing fails
  let orderData: Record<string, unknown> = {};
  let savedOrderId: string | null = null;

  try {
    // Handle FormData for file uploads
    const formData = await request.formData();

    const planName = formData.get("planName") as string;
    const planPrice = formData.get("planPrice") as string;
    const planPricePerDay = formData.get("planPricePerDay") as string;
    const numberOfDays = formData.get("numberOfDays") as string;
    const planPeriod = formData.get("planPeriod") as string;
    const periodStart = formData.get("periodStart") as string;
    const periodEnd = formData.get("periodEnd") as string;
    const citizenship = formData.get("citizenship") as string;
    const firstNameEng = formData.get("firstNameEng") as string;
    const lastNameEng = formData.get("lastNameEng") as string;
    const birthDate = formData.get("birthDate") as string;
    const passportNumber = formData.get("passportNumber") as string;
    const city = formData.get("city") as string;
    const mobileNumber = formData.get("mobileNumber") as string;
    const email = formData.get("email") as string;
    const locale = formData.get("locale") as string;
    const paymentOption = formData.get("paymentOption") as string;
    const paymentMonths = formData.get("paymentMonths") as string;
    const passportPhoto = formData.get("passportPhoto") as File | null;

    // Store for logging
    orderData = {
      timestamp: new Date().toISOString(),
      customer: `${firstNameEng} ${lastNameEng}`,
      email,
      phone: mobileNumber,
      plan: planName,
      price: planPrice,
      city,
      citizenship,
      passportNumber,
      periodStart,
      periodEnd,
    };

    // Log the order immediately for backup
    console.log("Insurance Order Received:", orderData);

    // Generate order ID and save to database
    const orderId = generateOrderId();
    savedOrderId = orderId;

    // Convert passport photo to base64 if present
    let passportPhotoBase64: string | undefined;
    let passportPhotoName: string | undefined;
    let passportPhotoType: string | undefined;

    if (passportPhoto && passportPhoto.size > 0) {
      const arrayBuffer = await passportPhoto.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      passportPhotoBase64 = `data:${passportPhoto.type};base64,${base64}`;
      passportPhotoName = passportPhoto.name;
      passportPhotoType = passportPhoto.type;
    }

    // Convert display plan name to database plan name
    const dbPlanName = getPlanNameForDB(planName || "");

    // Create order object
    const order: Order = {
      orderId,
      createdAt: new Date().toISOString(),
      planName: dbPlanName,
      planPrice: parseFloat(planPrice) || 0,
      planPricePerDay: planPricePerDay || "",
      numberOfDays: numberOfDays || "",
      planPeriod: planPeriod || "",
      periodStart: periodStart || "",
      periodEnd: periodEnd || "",
      citizenship: citizenship || "",
      firstNameEng: firstNameEng || "",
      lastNameEng: lastNameEng || "",
      birthDate: birthDate || "",
      passportNumber: passportNumber || "",
      city: city || "",
      mobileNumber: mobileNumber || "",
      email: email || "",
      locale: locale || "en",
      paymentOption: paymentOption || undefined,
      paymentMonths: paymentMonths || undefined,
      passportPhotoBase64,
      passportPhotoName,
      passportPhotoType,
      status: "pending", // Website orders start as pending
      source: "website",
    };

    // Save to database
    try {
      await saveOrder(order);
      console.log(`[Insurance Order] Saved to database: ${orderId}`);
    } catch (dbError) {
      console.error("[Insurance Order] Database save error:", dbError);
      // Continue with Telegram notification even if DB save fails
    }

    // Format price display
    const priceDisplay = numberOfDays
      ? `${planPrice} GEL (${numberOfDays} × ${planPricePerDay} GEL/day)`
      : `${planPrice} GEL`;

    // Format full message for Telegram
    const telegramMessage = `🛡️ NEW INSURANCE ORDER (Georgian Support)
━━━━━━━━━━━━━━━━━━━━
🆔 Order ID: ${orderId}

📋 Policy Details:
• Plan: ${planName || "N/A"}
• Period Type: ${planPeriod}
• Coverage: ${periodStart} — ${periodEnd}
• Price: ${priceDisplay}

👤 Customer Details:
• Name: ${firstNameEng} ${lastNameEng}
• Citizenship: ${citizenship}
• Birth Date: ${birthDate}
• Passport: ${passportNumber || "N/A"}
• City: ${city}
• Phone: ${mobileNumber}
• Email: ${email}

🌐 Locale: ${locale}
⏰ Time: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━`;

    // Send to Telegram
    console.log("Telegram config check:", {
      hasToken: !!TELEGRAM_BOT_TOKEN,
      hasChatId: !!TELEGRAM_CHAT_ID,
      tokenLength: TELEGRAM_BOT_TOKEN?.length || 0,
      chatIdLength: TELEGRAM_CHAT_ID?.length || 0
    });

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      console.log("Sending to Telegram...");
      try {
        // If there's a passport photo, send it with full caption
        if (passportPhoto && passportPhoto.size > 0) {
          console.log("Sending photo with full caption to Telegram, size:", passportPhoto.size);
          // Convert File to Buffer for proper Telegram API handling
          const arrayBuffer = await passportPhoto.arrayBuffer();
          const photoBlob = new Blob([arrayBuffer], { type: passportPhoto.type || 'image/jpeg' });

          const photoFormData = new FormData();
          photoFormData.append("chat_id", TELEGRAM_CHAT_ID);
          photoFormData.append("photo", photoBlob, passportPhoto.name || "passport.jpg");
          // Use full message as caption (Telegram limit 1024 chars, but our message is ~600)
          photoFormData.append("caption", telegramMessage);

          const photoResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            {
              method: "POST",
              body: photoFormData,
            }
          );

          if (!photoResponse.ok) {
            const errorData = await photoResponse.json();
            console.error("Telegram photo error:", errorData);
            // Fallback: send text message if photo fails
            await fetch(
              `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chat_id: TELEGRAM_CHAT_ID,
                  text: telegramMessage + "\n\n⚠️ Photo upload failed",
                }),
              }
            );
          } else {
            console.log("Telegram photo sent successfully!");
          }
        } else {
          // No photo, just send text message
          console.log("Sending text message to Telegram...");
          const msgResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
              }),
            }
          );

          console.log("Telegram message response status:", msgResponse.status);
          if (msgResponse.ok) {
            console.log("Telegram message sent successfully!");
          } else {
            const errorData = await msgResponse.json();
            console.error("Telegram message error:", errorData);
          }
        }
      } catch (telegramError) {
        console.error("Telegram error:", telegramError);
      }
    } else {
      console.log("Telegram not configured - TELEGRAM_BOT_TOKEN:", !!TELEGRAM_BOT_TOKEN, "TELEGRAM_CHAT_ID:", !!TELEGRAM_CHAT_ID);
    }

    // Send SMS to Georgian numbers (in user's language)
    if (mobileNumber && isGeorgianNumber(mobileNumber)) {
      console.log("[SMS] Georgian number detected, sending SMS in locale:", locale);

      // Get SMS message in user's language
      const smsMessage = getSMSMessage(locale || "en", orderId, planName || "Insurance", planPrice || "0");

      try {
        const smsSent = await sendSMSWithTracking(orderId, mobileNumber, smsMessage, locale || "en");
        if (smsSent) {
          console.log("[SMS] Customer notification sent successfully");
        }
      } catch (smsError) {
        console.error("[SMS] Error sending customer SMS:", smsError);
        // Don't fail the order if SMS fails
      }
    } else {
      console.log("[SMS] Non-Georgian number, skipping SMS:", mobileNumber);
    }

    // Format email content
    const emailSubject = `New Insurance Order - ${firstNameEng} ${lastNameEng}`;
    const emailBody = `
NEW INSURANCE ORDER (Georgian Support)
======================================

ORDER ID: ${orderId}

POLICY DETAILS:
- Plan: ${planName || "N/A"}
- Period Type: ${planPeriod}
- Coverage: ${periodStart} to ${periodEnd}
- Price: ${priceDisplay}

CUSTOMER DETAILS:
- Name: ${firstNameEng} ${lastNameEng}
- Citizenship: ${citizenship}
- Birth Date: ${birthDate}
- Passport Number: ${passportNumber || "N/A"}
- City in Georgia: ${city}
- Mobile: ${mobileNumber}
- Email: ${email}

Locale: ${locale}
Submitted: ${new Date().toISOString()}
`;

    // Send email via webhook if configured (legacy)
    const EMAIL_WEBHOOK = process.env.EMAIL_WEBHOOK_URL;
    if (EMAIL_WEBHOOK) {
      try {
        await fetch(EMAIL_WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: CONTACT.email,
            subject: emailSubject,
            text: emailBody,
            from: email,
          }),
        });
      } catch (emailError) {
        console.error("Email webhook error:", emailError);
      }
    }

    // Send customer confirmation email via SMTP
    if (email) {
      try {
        await sendOrderConfirmationEmail({
          to: email,
          orderId,
          customerName: `${firstNameEng} ${lastNameEng}`,
          planName: planName || "Insurance",
          amount: parseFloat(planPrice) || 0,
          startDate: periodStart || "",
          endDate: periodEnd || "",
          locale: locale || "en",
        });
        console.log("[Email] Customer confirmation email sent to:", email);
      } catch (emailError) {
        console.error("[Email] Failed to send confirmation:", emailError);
        // Don't fail the order if email fails
      }
    }

    // Always return success with orderId - order is logged even if notifications fail
    return NextResponse.json({ success: true, orderId: savedOrderId });
  } catch (error) {
    console.error("Insurance order error:", error);
    console.error("Order data:", orderData);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to process order", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
