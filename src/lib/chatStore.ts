// In-memory chat storage (for production use Redis)
// This stores chat sessions and messages

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  sessionId: string;
  recipientContact: string;
  recipientTelegramChatId?: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}

// In-memory storage (will reset on server restart)
// For production, use Redis or database
const sessions = new Map<string, ChatSession>();

// Clean up old sessions (older than 24 hours)
function cleanupOldSessions() {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  
  for (const [sessionId, session] of sessions) {
    if (now - session.lastActivity.getTime() > maxAge) {
      sessions.delete(sessionId);
    }
  }
}

// Run cleanup every hour
setInterval(cleanupOldSessions, 60 * 60 * 1000);

export function createSession(sessionId: string, contact: string): ChatSession {
  const session: ChatSession = {
    sessionId,
    recipientContact: contact,
    messages: [],
    createdAt: new Date(),
    lastActivity: new Date(),
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): ChatSession | undefined {
  return sessions.get(sessionId);
}

export function addMessageToSession(
  sessionId: string,
  text: string,
  isUser: boolean
): ChatMessage | null {
  const session = sessions.get(sessionId);
  if (!session) return null;

  const message: ChatMessage = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    text,
    isUser,
    timestamp: new Date(),
  };

  session.messages.push(message);
  session.lastActivity = new Date();
  return message;
}

export function getMessagesAfter(
  sessionId: string,
  afterTimestamp: number
): ChatMessage[] {
  const session = sessions.get(sessionId);
  if (!session) return [];

  return session.messages.filter(
    (msg) => msg.timestamp.getTime() > afterTimestamp
  );
}

export function setTelegramChatId(sessionId: string, telegramChatId: string) {
  const session = sessions.get(sessionId);
  if (session) {
    session.recipientTelegramChatId = telegramChatId;
  }
}

// Find session by admin's reply context
// When admin replies, we need to find which session to send the response to
const adminReplyContext = new Map<number, string>(); // telegramMessageId -> sessionId

export function setAdminReplyContext(telegramMessageId: number, sessionId: string) {
  adminReplyContext.set(telegramMessageId, sessionId);
}

export function getSessionByAdminReply(replyToMessageId: number): string | undefined {
  return adminReplyContext.get(replyToMessageId);
}

export function getAllSessions(): ChatSession[] {
  return Array.from(sessions.values());
}
