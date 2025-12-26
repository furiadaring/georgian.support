import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getMessagesAfter } from "@/lib/chatStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const after = searchParams.get("after");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const afterTimestamp = after ? parseInt(after, 10) : 0;
    const messages = getMessagesAfter(sessionId, afterTimestamp);

    // Only return non-user messages (admin replies)
    const adminMessages = messages.filter((msg) => !msg.isUser);

    return NextResponse.json({
      messages: adminMessages.map((msg) => ({
        id: msg.id,
        text: msg.text,
        timestamp: msg.timestamp.getTime(),
      })),
    });
  } catch (error) {
    console.error("Poll API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
