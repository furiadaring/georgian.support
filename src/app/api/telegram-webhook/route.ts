import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  addMessageToSession,
  getSessionByAdminReply,
  getAllSessions,
} from "@/lib/chatStore";

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
    reply_to_message?: {
      message_id: number;
      text?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify webhook secret
    const secret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update: TelegramUpdate = await request.json();
    
    // Only process messages from admin chat
    if (!update.message || update.message.chat.id.toString() !== TELEGRAM_CHAT_ID) {
      return NextResponse.json({ ok: true });
    }

    const { message } = update;
    
    // Must be a reply to a user message
    if (!message.reply_to_message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    // Find session by reply context
    let sessionId = getSessionByAdminReply(message.reply_to_message.message_id);

    // If not found, try to extract session ID from the original message
    if (!sessionId && message.reply_to_message.text) {
      const match = message.reply_to_message.text.match(/Сессия:\s*`([a-f0-9-]+)`/);
      if (match) {
        sessionId = getAllSessions().find(s => s.sessionId.startsWith(match[1]))?.sessionId;
      }
      
      // Also try the short format [sessionId]
      const shortMatch = message.reply_to_message.text.match(/\[([a-f0-9]+)\]/);
      if (!sessionId && shortMatch) {
        sessionId = getAllSessions().find(s => s.sessionId.startsWith(shortMatch[1]))?.sessionId;
      }
    }

    if (!sessionId) {
      console.log("Could not find session for reply");
      return NextResponse.json({ ok: true });
    }

    // Add admin reply to session
    addMessageToSession(sessionId, message.text, false);
    
    console.log(`Admin reply added to session ${sessionId}: ${message.text}`);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}

// Telegram sends GET to verify webhook
export async function GET() {
  return NextResponse.json({ status: "Webhook is active" });
}
