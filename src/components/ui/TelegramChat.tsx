"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface TelegramChatProps {
  locale: string;
}

const translations = {
  ru: {
    title: "Чат поддержки",
    placeholder: "Введите сообщение...",
    send: "Отправить",
    greeting: "Здравствуйте! 👋 Чем могу помочь?",
    sent: "Сообщение отправлено!",
    error: "Ошибка отправки. Попробуйте ещё раз.",
    emailPlaceholder: "Ваш email или Telegram",
    emailRequired: "Укажите контакт для ответа",
    online: "Онлайн",
    typing: "Печатает...",
  },
  en: {
    title: "Support Chat",
    placeholder: "Type a message...",
    send: "Send",
    greeting: "Hello! 👋 How can I help you?",
    sent: "Message sent!",
    error: "Failed to send. Please try again.",
    emailPlaceholder: "Your email or Telegram",
    emailRequired: "Please provide contact for reply",
    online: "Online",
    typing: "Typing...",
  },
  ka: {
    title: "მხარდაჭერის ჩატი",
    placeholder: "შეიყვანეთ შეტყობინება...",
    send: "გაგზავნა",
    greeting: "გამარჯობა! 👋 რით შემიძლია დაგეხმაროთ?",
    sent: "შეტყობინება გაგზავნილია!",
    error: "გაგზავნა ვერ მოხერხდა.",
    emailPlaceholder: "თქვენი ელფოსტა ან Telegram",
    emailRequired: "მიუთითეთ კონტაქტი პასუხისთვის",
    online: "ონლაინ",
    typing: "წერს...",
  },
  uk: {
    title: "Чат підтримки",
    placeholder: "Введіть повідомлення...",
    send: "Надіслати",
    greeting: "Вітаємо! 👋 Чим можу допомогти?",
    sent: "Повідомлення надіслано!",
    error: "Помилка надсилання.",
    emailPlaceholder: "Ваш email або Telegram",
    emailRequired: "Вкажіть контакт для відповіді",
    online: "Онлайн",
    typing: "Друкує...",
  },
  tr: {
    title: "Destek Sohbeti",
    placeholder: "Mesaj yazın...",
    send: "Gönder",
    greeting: "Merhaba! 👋 Size nasıl yardımcı olabilirim?",
    sent: "Mesaj gönderildi!",
    error: "Gönderme hatası.",
    emailPlaceholder: "E-posta veya Telegram",
    emailRequired: "Yanıt için iletişim bilgisi girin",
    online: "Çevrimiçi",
    typing: "Yazıyor...",
  },
  he: {
    title: "צ'אט תמיכה",
    placeholder: "הקלד הודעה...",
    send: "שלח",
    greeting: "שלום! 👋 איך אוכל לעזור?",
    sent: "ההודעה נשלחה!",
    error: "שגיאה בשליחה.",
    emailPlaceholder: "אימייל או טלגרם",
    emailRequired: "נא לספק פרטי קשר",
    online: "מקוון",
    typing: "מקליד...",
  },
  ar: {
    title: "دردشة الدعم",
    placeholder: "اكتب رسالة...",
    send: "إرسال",
    greeting: "مرحباً! 👋 كيف يمكنني مساعدتك؟",
    sent: "تم إرسال الرسالة!",
    error: "فشل الإرسال.",
    emailPlaceholder: "البريد الإلكتروني أو تلغرام",
    emailRequired: "يرجى تقديم جهة اتصال للرد",
    online: "متصل",
    typing: "يكتب...",
  },
};

function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function TelegramChat({ locale }: TelegramChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContactInput, setShowContactInput] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const [lastPollTime, setLastPollTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const t = translations[locale as keyof typeof translations] || translations.en;
  const isRtl = locale === "he" || locale === "ar";

  // Initialize session ID
  useEffect(() => {
    const stored = localStorage.getItem("chat_session_id");
    if (stored) {
      setSessionId(stored);
      // Resume polling from saved time or start fresh
      const savedPollTime = localStorage.getItem("chat_last_poll");
      if (savedPollTime) {
        setLastPollTime(parseInt(savedPollTime, 10));
      }
      setShowContactInput(false); // Already has session, no need for contact
    } else {
      const newId = generateSessionId();
      setSessionId(newId);
      localStorage.setItem("chat_session_id", newId);
    }
  }, []);

  // Show greeting when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          text: t.greeting,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length, t.greeting]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  const pollMessages = useCallback(async () => {
    if (!sessionId || !isOpen) return;

    try {
      const response = await fetch(
        `/api/telegram-chat/poll?sessionId=${sessionId}&after=${lastPollTime}`
      );
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
          const newMessages: Message[] = data.messages.map((msg: { id: string; text: string; timestamp: number }) => ({
            id: msg.id,
            text: msg.text,
            isUser: false,
            timestamp: new Date(msg.timestamp),
          }));
          
          setMessages((prev) => {
            const existingIds = new Set(prev.map(m => m.id));
            const uniqueNew = newMessages.filter(m => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
          
          // Update last poll time to latest message and save it
          const maxTime = Math.max(...data.messages.map((m: { timestamp: number }) => m.timestamp));
          setLastPollTime(maxTime);
          localStorage.setItem("chat_last_poll", maxTime.toString());
        }
      }
    } catch (error) {
      console.error("Poll error:", error);
    }
  }, [sessionId, isOpen, lastPollTime]);

  // Start polling when chat is open - poll immediately on open
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    // Poll immediately when opening
    pollMessages();
    
    const interval = setInterval(pollMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [isOpen, sessionId, pollMessages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    if (showContactInput && !contact.trim()) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/telegram-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          contact: contact,
          locale: locale,
          sessionId: sessionId,
        }),
      });

      if (response.ok) {
        setShowContactInput(false);
        // Start polling from now
        setLastPollTime(Date.now());
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          text: t.error,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center ${
          isRtl ? "left-6" : "right-6"
        }`}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300 ${
            isRtl ? "left-6" : "right-6"
          }`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-xs text-white/80">Georgian Support</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[300px] overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    msg.isUser
                      ? "bg-red-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isUser ? "text-white/70" : "text-gray-400"}`}>
                    {msg.timestamp.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-sm rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Input (shown first time) */}
          {showContactInput && (
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              {!contact && inputText && (
                <p className="text-xs text-red-500 mt-1">{t.emailRequired}</p>
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
