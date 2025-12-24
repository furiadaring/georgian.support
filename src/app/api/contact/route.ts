import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting map (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; lastReset: number }>();

const RATE_LIMIT_MAX = 5; // Max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

function getRateLimitKey(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for") ?? 
             request.headers.get("x-real-ip") ?? 
             "unknown";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(key);

  if (!record) {
    rateLimit.set(key, { count: 1, lastReset: now });
    return false;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimit.set(key, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: "Слишком много запросов. Попробуйте позже." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, phone, time } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Пожалуйста, введите корректное имя" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 9) {
      return NextResponse.json(
        { error: "Пожалуйста, введите корректный номер телефона" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 20),
      time: time?.trim().slice(0, 50) || "",
      timestamp: new Date().toISOString(),
      ip: rateLimitKey,
    };

    // Here you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send to CRM
    // 4. Send Telegram notification
    
    // Example: Send to Telegram (uncomment and configure)
    // await sendTelegramNotification(sanitizedData);
    
    // Example: Send email (uncomment and configure)
    // await sendEmailNotification(sanitizedData);

    console.log("New contact form submission:", sanitizedData);

    return NextResponse.json(
      { success: true, message: "Спасибо! Мы свяжемся с вами в ближайшее время." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте ещё раз." },
      { status: 500 }
    );
  }
}

// Telegram notification helper (example)
// async function sendTelegramNotification(data: any) {
//   const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
//   const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
//   
//   const message = `
// 🔔 Новая заявка с сайта!
// 
// 👤 Имя: ${data.name}
// 📞 Телефон: ${data.phone}
// 🕐 Время: ${data.time || "Не указано"}
// 📅 Дата: ${data.timestamp}
//   `;
//   
//   await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       chat_id: TELEGRAM_CHAT_ID,
//       text: message,
//       parse_mode: "HTML",
//     }),
//   });
// }
