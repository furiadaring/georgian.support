import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Agent } from "undici";
import {
  createSession,
  getSession,
  addMessageToSession,
  setTelegramTopicId,
  getTelegramTopicId,
  setTopicToSession,
} from "@/lib/chatStore";

// Force IPv4 to avoid IPv6 timeout issues
const ipv4Agent = new Agent({ connect: { family: 4 } });

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
    const { message, fullName, phone, email, locale, sessionId } = body;

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

    // Build contact info string
    const contactInfo = fullName || "Unknown";

    // Get or create session
    let session = getSession(sessionId);
    if (!session) {
      session = createSession(sessionId, contactInfo);
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

    // Check if we have a topic for this session
    let topicId = getTelegramTopicId(sessionId);
    
    // Create topic for new chat session
    if (!topicId) {
      const topicName = `💬 ${fullName || "User"} | ${localeNames[locale] || locale}`;
      
      const createTopicResponse = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createForumTopic`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            name: topicName.slice(0, 128), // Telegram limit is 128 chars
          }),
          // @ts-expect-error - undici dispatcher for IPv4
          dispatcher: ipv4Agent,
        }
      );

      if (!createTopicResponse.ok) {
        const error = await createTopicResponse.text();
        console.error("Failed to create topic:", error);
        return NextResponse.json(
          { error: "Failed to create chat topic" },
          { status: 500 }
        );
      }

      const topicResult = await createTopicResponse.json();
      topicId = topicResult.result?.message_thread_id;
      
      if (topicId) {
        setTelegramTopicId(sessionId, topicId);
        setTopicToSession(topicId, sessionId);
        
        // Send user info as first message in topic
        const userInfoMessage = `
👤 *Информация о пользователе:*

📛 *Имя:* ${fullName || "Не указано"}
📞 *Телефон:* ${phone || "Не указан"}
📧 *Email:* ${email || "Не указан"}
🌐 *Язык:* ${localeNames[locale] || locale}
🆔 *Сессия:* \`${sessionId.slice(0, 8)}\`

_Просто отвечайте в этом топике - сообщения автоматически отправятся пользователю_
`.trim();

        await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              message_thread_id: topicId,
              text: userInfoMessage,
              parse_mode: "Markdown",
            }),
            // @ts-expect-error - undici dispatcher for IPv4
            dispatcher: ipv4Agent,
          }
        );
      }
    }

    // Format message for Telegram
    const formattedMessage = `💬 *Сообщение от пользователя:*\n\n${message}`;

    // Send to Telegram topic
    const telegramPayload: {
      chat_id: string;
      message_thread_id?: number;
      text: string;
      parse_mode: string;
    } = {
      chat_id: TELEGRAM_CHAT_ID,
      text: formattedMessage,
      parse_mode: "Markdown",
    };

    // Add topic ID if we have one
    if (topicId) {
      telegramPayload.message_thread_id = topicId;
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
        // @ts-expect-error - undici dispatcher for IPv4
        dispatcher: ipv4Agent,
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
    
    // Log success
    if (telegramResult.result?.message_id) {
      console.log(`Message sent to topic ${topicId}, message_id: ${telegramResult.result.message_id}`);
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
