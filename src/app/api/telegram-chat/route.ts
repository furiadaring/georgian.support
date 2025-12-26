import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createSession,
  getSession,
  addMessageToSession,
  getTelegramTopicId,
  setTelegramTopicId,
  setTopicToSession,
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

// Get user location from IP address
async function getLocationFromIP(ip: string): Promise<string> {
  if (!ip || ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    return "Не определено";
  }
  
  try {
    // Use ip-api.com (free, no API key needed, 45 req/min limit)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,regionName&lang=ru`, {
      signal: AbortSignal.timeout(3000),
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        const parts = [data.city, data.regionName, data.country].filter(Boolean);
        return parts.join(", ") || "Не определено";
      }
    }
  } catch (error) {
    console.error("IP geolocation error:", error);
  }
  
  return "Не определено";
}

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
    const { message, fullName, phone, email, locale, sessionId, isSystemMessage, pageUrl, localTime } = body;

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

    // Build contact display
    const contact = fullName || "Unknown";

    // Get or create session
    let session = getSession(sessionId);
    if (!session) {
      session = createSession(sessionId, contact);
    }

    // Don't add system messages to session history
    if (!isSystemMessage) {
      addMessageToSession(sessionId, message, true);
    }

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
    
    // Check if we already have a topic for this session
    let topicId = getTelegramTopicId(sessionId);
    
    // Create a new topic for first message
    if (!topicId) {
      const topicName = `💬 ${fullName || "User"} | ${localeNames[locale] || locale}`;
      
      // Get user's IP and location
      const userIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
        ?? request.headers.get("x-real-ip") 
        ?? "unknown";
      const userLocation = await getLocationFromIP(userIP);
      
      try {
        const createTopicResponse = await fetch(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/createForumTopic`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              name: topicName.slice(0, 128),
            }),
          }
        );

        if (createTopicResponse.ok) {
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
📍 *Локация:* ${userLocation}
🔗 *IP:* \`${userIP}\`
📄 *Страница:* ${pageUrl || "Не указана"}
🕐 *Время пользователя:* ${localTime || "Не указано"}
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
              }
            );
          }
        } else {
          console.error("Failed to create topic:", await createTopicResponse.text());
        }
      } catch (topicError) {
        console.error("Topic creation error:", topicError);
      }
    }

    // Format message for Telegram - system messages are sent as-is
    const formattedMessage = isSystemMessage 
      ? message 
      : `💬 *Сообщение от пользователя:*\n\n${message}`;

    // Build payload - include topic if available
    const telegramPayload: Record<string, unknown> = {
      chat_id: TELEGRAM_CHAT_ID,
      text: formattedMessage,
      parse_mode: "Markdown",
    };
    
    if (topicId) {
      telegramPayload.message_thread_id = topicId;
    }

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
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
