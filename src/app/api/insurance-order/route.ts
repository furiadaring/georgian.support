import { NextRequest, NextResponse } from "next/server";
import { CONTACT } from "@/lib/constants";

// Use dedicated order bot (same as visitgeorgia) or fallback to default
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_ORDER_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_ORDER_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
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
    const passportPhoto = formData.get("passportPhoto") as File | null;

    // Format price display
    const priceDisplay = numberOfDays 
      ? `${planPrice} GEL (${numberOfDays} × ${planPricePerDay} GEL/day)`
      : `${planPrice} GEL`;

    // Format message for Telegram
    const telegramMessage = `
🛡️ *NEW INSURANCE ORDER*
━━━━━━━━━━━━━━━━━━━━

📋 *Policy Details:*
• Plan: ${planName || "N/A"}
• Period Type: ${planPeriod}
• Coverage: ${periodStart} — ${periodEnd}
• Price: ${priceDisplay}

👤 *Customer Details:*
• Name: ${firstNameEng} ${lastNameEng}
• Citizenship: ${citizenship}
• Birth Date: ${birthDate}
• Passport: ${passportNumber || "N/A"}
• City: ${city}
• Phone: ${mobileNumber}
• Email: ${email}

🌐 Locale: ${locale}
⏰ Time: ${new Date().toISOString()}
━━━━━━━━━━━━━━━━━━━━
`;

    // Send to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        // If there's a passport photo, send it with caption
        if (passportPhoto && passportPhoto.size > 0) {
          const photoFormData = new FormData();
          photoFormData.append("chat_id", TELEGRAM_CHAT_ID);
          photoFormData.append("photo", passportPhoto, passportPhoto.name);
          photoFormData.append("caption", telegramMessage);
          photoFormData.append("parse_mode", "Markdown");
          
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
            {
              method: "POST",
              body: photoFormData,
            }
          );
        } else {
          // No photo, just send text message
          await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: "Markdown",
              }),
            }
          );
        }
      } catch (telegramError) {
        console.error("Telegram error:", telegramError);
      }
    }

    // Format email content
    const emailSubject = `New Insurance Order - ${firstNameEng} ${lastNameEng}`;
    const emailBody = `
NEW INSURANCE ORDER
====================

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

    // Send email via webhook if configured
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

    // Log the order for backup
    console.log("Insurance Order Received:", {
      timestamp: new Date().toISOString(),
      customer: `${firstNameEng} ${lastNameEng}`,
      email,
      phone: mobileNumber,
      plan: planName,
      price: planPrice,
      city,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Insurance order error:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
