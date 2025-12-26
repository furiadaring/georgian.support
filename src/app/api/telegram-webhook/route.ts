import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  addMessageToSession,
  getSessionByTopicId,
} from "@/lib/chatStore";

const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    message_thread_id?: number; // Topic ID
    from: {
      id: number;
      first_name: string;
      username?: string;
      is_bot?: boolean;
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
    
    // Ignore messages from bots (including our own)
    if (message.from.is_bot) {
      return NextResponse.json({ ok: true });
    }
    
    // Must have text and be in a topic
    if (!message.text || !message.message_thread_id) {
      return NextResponse.json({ ok: true });
    }

    // Find session by topic ID
    const sessionId = getSessionByTopicId(message.message_thread_id);

    if (!sessionId) {
      console.log(`No session found for topic ${message.message_thread_id}`);
      return NextResponse.json({ ok: true });
    }

    // Add admin reply to session
    addMessageToSession(sessionId, message.text, false);
    
    console.log(`Admin reply added to session ${sessionId} (topic ${message.message_thread_id}): ${message.text}`);

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
