import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createSession,
  getSession,
  addMessageToSession,
  setAdminReplyContext,
} from "@/lib/chatStore";

// Rate limiting
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW = 60 * 1000;

function getRateLimitKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
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

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Telegram credentials not configured");
      return NextResponse.json(
        { error: "Chat service not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, contact, locale, sessionId } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get or create session
    let session = getSession(sessionId);
    if (!session) {
      session = createSession(sessionId, contact || "Unknown");
    }

    // Add user message to session
    addMessageToSession(sessionId, message, true);

    // Format message for Telegram
    const localeNames: Record<string, string> = {
      ru: "🇷🇺 RU",
      en: "🇺🇸 EN",
      ka: "🇬🇪 KA",
      uk: "🇺🇦 UK",
      tr: "🇹🇷 TR",
      he: "🇮🇱 HE",
      ar: "🇸🇦 AR",
    };

    const isFirstMessage = session.messages.length === 1;
    
    let formattedMessage: string;
    if (isFirstMessage) {
      formattedMessage = `
💬 *Новый чат с сайта*

👤 *Контакт:* ${contact || "Не указан"}
🌐 *Язык:* ${localeNames[locale] || locale}
🆔 *Сессия:* \`${sessionId.slice(0, 8)}\`

📝 *Сообщение:*
${message}

_Ответьте на это сообщение чтобы ответить пользователю_
`.trim();
    } else {
      formattedMessage = `
💬 [${sessionId.slice(0, 8)}] ${contact || "User"}:

${message}
`.trim();
    }

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formattedMessage,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text();
      console.error("Telegram API error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    const telegramResult = await telegramResponse.json();
    
    // Store the message ID for reply tracking
    if (telegramResult.result?.message_id) {
      setAdminReplyContext(telegramResult.result.message_id, sessionId);
    }

    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
