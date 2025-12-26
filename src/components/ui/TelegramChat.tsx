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
    greeting: "Здравствуйте, {name}! 👋 Чем могу помочь?",
    sent: "Сообщение отправлено!",
    error: "Ошибка отправки. Попробуйте ещё раз.",
    online: "Онлайн",
    typing: "Печатает...",
    popup: "Есть вопросы? Спросите сейчас!",
    // Registration form
    formTitle: "Начать чат",
    formSubtitle: "Пожалуйста, представьтесь",
    fullName: "Полное имя",
    fullNamePlaceholder: "Введите ваше имя",
    phone: "Телефон",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "Email (необязательно)",
    emailPlaceholder: "your@email.com",
    startChat: "Начать чат",
    required: "Обязательное поле",
    endChat: "Завершить",
  },
  en: {
    title: "Support Chat",
    placeholder: "Type a message...",
    send: "Send",
    greeting: "Hello, {name}! 👋 How can I help you?",
    sent: "Message sent!",
    error: "Failed to send. Please try again.",
    online: "Online",
    typing: "Typing...",
    popup: "Any questions? Ask now!",
    // Registration form
    formTitle: "Start Chat",
    formSubtitle: "Please introduce yourself",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your name",
    phone: "Phone",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "Email (optional)",
    emailPlaceholder: "your@email.com",
    startChat: "Start Chat",
    required: "Required field",
    endChat: "End Chat",
  },
  ka: {
    title: "მხარდაჭერის ჩატი",
    placeholder: "შეიყვანეთ შეტყობინება...",
    send: "გაგზავნა",
    greeting: "გამარჯობა, {name}! 👋 რით შემიძლია დაგეხმაროთ?",
    sent: "შეტყობინება გაგზავნილია!",
    error: "გაგზავნა ვერ მოხერხდა.",
    online: "ონლაინ",
    typing: "წერს...",
    popup: "გაქვთ შეკითხვები? იკითხეთ ახლავე!",
    // Registration form
    formTitle: "ჩატის დაწყება",
    formSubtitle: "გთხოვთ, წარმოგვიდგინოთ თავი",
    fullName: "სრული სახელი",
    fullNamePlaceholder: "შეიყვანეთ თქვენი სახელი",
    phone: "ტელეფონი",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "ელფოსტა (არასავალდებულო)",
    emailPlaceholder: "your@email.com",
    startChat: "ჩატის დაწყება",
    required: "სავალდებულო ველი",
    endChat: "დასრულება",
  },
  uk: {
    title: "Чат підтримки",
    placeholder: "Введіть повідомлення...",
    send: "Надіслати",
    greeting: "Вітаємо, {name}! 👋 Чим можу допомогти?",
    sent: "Повідомлення надіслано!",
    error: "Помилка надсилання.",
    online: "Онлайн",
    typing: "Друкує...",
    popup: "Є питання? Запитайте зараз!",
    // Registration form
    formTitle: "Почати чат",
    formSubtitle: "Будь ласка, представтеся",
    fullName: "Повне ім'я",
    fullNamePlaceholder: "Введіть ваше ім'я",
    phone: "Телефон",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "Email (необов'язково)",
    emailPlaceholder: "your@email.com",
    startChat: "Почати чат",
    required: "Обов'язкове поле",
    endChat: "Завершити",
  },
  tr: {
    title: "Destek Sohbeti",
    placeholder: "Mesaj yazın...",
    send: "Gönder",
    greeting: "Merhaba, {name}! 👋 Size nasıl yardımcı olabilirim?",
    sent: "Mesaj gönderildi!",
    error: "Gönderme hatası.",
    online: "Çevrimiçi",
    typing: "Yazıyor...",
    popup: "Sorularınız mı var? Şimdi sorun!",
    // Registration form
    formTitle: "Sohbeti Başlat",
    formSubtitle: "Lütfen kendinizi tanıtın",
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Adınızı girin",
    phone: "Telefon",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "E-posta (isteğe bağlı)",
    emailPlaceholder: "your@email.com",
    startChat: "Sohbeti Başlat",
    required: "Zorunlu alan",
    endChat: "Bitir",
  },
  he: {
    title: "צ'אט תמיכה",
    placeholder: "הקלד הודעה...",
    send: "שלח",
    greeting: "שלום, {name}! 👋 איך אוכל לעזור?",
    sent: "ההודעה נשלחה!",
    error: "שגיאה בשליחה.",
    online: "מקוון",
    typing: "מקליד...",
    popup: "יש שאלות? שאל עכשיו!",
    // Registration form
    formTitle: "התחל צ'אט",
    formSubtitle: "אנא הציג את עצמך",
    fullName: "שם מלא",
    fullNamePlaceholder: "הזן את שמך",
    phone: "טלפון",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "אימייל (אופציונלי)",
    emailPlaceholder: "your@email.com",
    startChat: "התחל צ'אט",
    required: "שדה חובה",
    endChat: "סיים",
  },
  ar: {
    title: "دردشة الدعم",
    placeholder: "اكتب رسالة...",
    send: "إرسال",
    greeting: "مرحباً، {name}! 👋 كيف يمكنني مساعدتك؟",
    sent: "تم إرسال الرسالة!",
    error: "فشل الإرسال.",
    online: "متصل",
    typing: "يكتب...",
    popup: "لديك أسئلة؟ اسأل الآن!",
    // Registration form
    formTitle: "بدء الدردشة",
    formSubtitle: "يرجى تقديم نفسك",
    fullName: "الاسم الكامل",
    fullNamePlaceholder: "أدخل اسمك",
    phone: "الهاتف",
    phonePlaceholder: "+995 XXX XXX XXX",
    email: "البريد الإلكتروني (اختياري)",
    emailPlaceholder: "your@email.com",
    startChat: "بدء الدردشة",
    required: "حقل مطلوب",
    endChat: "إنهاء",
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
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [topicId, setTopicId] = useState<number | null>(null);
  const [lastPollTime, setLastPollTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Registration form state
  const [isRegistered, setIsRegistered] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formErrors, setFormErrors] = useState<{ fullName?: boolean; phone?: boolean }>({});
  
  const t = translations[locale as keyof typeof translations] || translations.en;
  const isRtl = locale === "he" || locale === "ar";

  // Initialize session ID, check registration, and load saved messages
  useEffect(() => {
    const stored = localStorage.getItem("chat_session_id");
    const storedUser = localStorage.getItem("chat_user_info");
    const storedMessages = localStorage.getItem("chat_messages");
    const storedIsOpen = localStorage.getItem("chat_is_open");
    const storedTopicId = localStorage.getItem("chat_topic_id");
    
    if (stored && storedUser) {
      setSessionId(stored);
      const userInfo = JSON.parse(storedUser);
      setFullName(userInfo.fullName || "");
      setPhone(userInfo.phone || "");
      setEmail(userInfo.email || "");
      setIsRegistered(true);
      
      // Load topic ID
      if (storedTopicId) {
        setTopicId(parseInt(storedTopicId, 10));
      }
      
      // Load saved messages
      if (storedMessages) {
        try {
          const parsedMessages = JSON.parse(storedMessages);
          // Convert timestamp strings back to Date objects
          const messagesWithDates = parsedMessages.map((msg: Message & { timestamp: string }) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        } catch (e) {
          console.error("Failed to parse stored messages:", e);
        }
      }
      
      // Restore chat open state
      if (storedIsOpen === "true") {
        setIsOpen(true);
      }
      
      // Resume polling from saved time
      const savedPollTime = localStorage.getItem("chat_last_poll");
      if (savedPollTime) {
        setLastPollTime(parseInt(savedPollTime, 10));
      }
    } else {
      const newId = generateSessionId();
      setSessionId(newId);
      localStorage.setItem("chat_session_id", newId);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Save chat open state
  useEffect(() => {
    localStorage.setItem("chat_is_open", isOpen ? "true" : "false");
  }, [isOpen]);

  // Show greeting when chat opens and user is registered (only if no messages exist)
  useEffect(() => {
    if (isOpen && isRegistered && messages.length === 0) {
      // Get first name from fullName
      const firstName = fullName.split(' ')[0] || fullName;
      const personalizedGreeting = t.greeting.replace('{name}', firstName);
      
      setMessages([
        {
          id: "greeting",
          text: personalizedGreeting,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, isRegistered, messages.length, t.greeting, fullName]);

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

  // Start polling when chat is open and user is registered
  useEffect(() => {
    if (!isOpen || !sessionId || !isRegistered) return;

    // Poll immediately when opening
    pollMessages();
    
    const interval = setInterval(pollMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [isOpen, sessionId, isRegistered, pollMessages]);

  // Handle registration form submission
  const handleRegister = () => {
    const errors: { fullName?: boolean; phone?: boolean } = {};
    
    if (!fullName.trim()) {
      errors.fullName = true;
    }
    if (!phone.trim()) {
      errors.phone = true;
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Save user info
    const userInfo = { fullName: fullName.trim(), phone: phone.trim(), email: email.trim() };
    localStorage.setItem("chat_user_info", JSON.stringify(userInfo));
    setIsRegistered(true);
    setFormErrors({});
  };

  // Handle end chat - clear session and reset
  const handleEndChat = async () => {
    // Send end chat notification to Telegram
    try {
      const userInfo = JSON.parse(localStorage.getItem("chat_user_info") || "{}");
      const storedTopicId = localStorage.getItem("chat_topic_id");
      await fetch("/api/telegram-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "🔴 Пользователь завершил чат",
          fullName: userInfo.fullName,
          phone: userInfo.phone,
          email: userInfo.email,
          locale: locale,
          sessionId: sessionId,
          isSystemMessage: true,
          isEndChat: true,
          clientTopicId: storedTopicId ? parseInt(storedTopicId, 10) : null,
        }),
      });
    } catch (error) {
      console.error("Failed to send end chat notification:", error);
    }
    
    // Clear all localStorage data
    localStorage.removeItem("chat_session_id");
    localStorage.removeItem("chat_messages");
    localStorage.removeItem("chat_user_info");
    localStorage.removeItem("chat_registered");
    localStorage.removeItem("chat_last_poll");
    localStorage.removeItem("chat_open");
    localStorage.removeItem("chat_topic_id");
    
    // Reset state
    setSessionId(generateSessionId());
    setTopicId(null);
    setMessages([]);
    setIsRegistered(false);
    setFullName("");
    setPhone("");
    setEmail("");
    setInputText("");
    setLastPollTime(0);
    setIsOpen(false);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

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
      const userInfo = JSON.parse(localStorage.getItem("chat_user_info") || "{}");
      const response = await fetch("/api/telegram-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          fullName: userInfo.fullName,
          phone: userInfo.phone,
          email: userInfo.email,
          locale: locale,
          sessionId: sessionId,
          pageUrl: window.location.href,
          localTime: new Date().toLocaleString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save topicId if returned
        if (data.topicId) {
          setTopicId(data.topicId);
          localStorage.setItem("chat_topic_id", data.topicId.toString());
        }
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
      {/* Popup tooltip */}
      {!isOpen && (
        <div
          className={`fixed bottom-8 z-40 animate-bounce-slow ${
            isRtl ? "left-24" : "right-24"
          }`}
        >
          <div 
            className={`bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 text-sm font-medium text-gray-700 whitespace-nowrap ${
              isRtl ? "rounded-bl-none" : "rounded-br-none"
            }`}
          >
            {t.popup}
          </div>
          {/* Arrow pointing to button */}
          <div 
            className={`absolute top-1/2 -translate-y-1/2 w-0 h-0 border-8 border-transparent ${
              isRtl 
                ? "-right-4 border-l-white" 
                : "-right-4 border-l-white"
            }`}
            style={isRtl ? { left: '-16px', borderRightColor: 'white', borderLeftColor: 'transparent' } : { right: '-16px', borderLeftColor: 'white' }}
          />
        </div>
      )}

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
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{isRegistered ? t.title : t.formTitle}</h3>
                  <p className="text-xs text-white/80">Georgian Support</p>
                </div>
              </div>
              {isRegistered && (
                <button
                  onClick={handleEndChat}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  {t.endChat}
                </button>
              )}
            </div>
          </div>

          {/* Registration Form */}
          {!isRegistered && (
            <div style={{ padding: '20px', backgroundColor: '#f9fafb' }}>
              <p style={{ fontSize: '14px', color: '#4b5563', textAlign: 'center', marginBottom: '20px' }}>{t.formSubtitle}</p>
              
              {/* Full Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                  {t.fullName} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setFormErrors((prev) => ({ ...prev, fullName: false }));
                  }}
                  placeholder={t.fullNamePlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: formErrors.fullName ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                  }}
                />
                {formErrors.fullName && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>{t.required}</p>
                )}
              </div>
              
              {/* Phone */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                  {t.phone} <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setFormErrors((prev) => ({ ...prev, phone: false }));
                  }}
                  placeholder={t.phonePlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: formErrors.phone ? '1px solid #ef4444' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                  }}
                />
                {formErrors.phone && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>{t.required}</p>
                )}
              </div>
              
              {/* Email (optional) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  {t.email}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    outline: 'none',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              
              {/* Submit Button */}
              <button
                onClick={handleRegister}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              >
                {t.startChat}
              </button>
            </div>
          )}

          {/* Messages (only shown after registration) */}
          {isRegistered && (
            <>
              <div 
                style={{
                  height: '300px',
                  overflowY: 'auto',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '10px 16px',
                        borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        backgroundColor: msg.isUser ? '#ef4444' : 'white',
                        color: msg.isUser ? 'white' : '#1f2937',
                        boxShadow: msg.isUser ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                      }}
                    >
                      <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{msg.text}</p>
                      <p style={{ 
                        fontSize: '11px', 
                        margin: '4px 0 0 0',
                        color: msg.isUser ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                      }}>
                        {msg.timestamp.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite' }} />
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.15s' }} />
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#9ca3af', borderRadius: '50%', animation: 'bounce 1s infinite 0.3s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '16px',
                backgroundColor: 'white',
                borderTop: '1px solid #f3f4f6',
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={t.placeholder}
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !inputText.trim()}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: (isLoading || !inputText.trim()) ? '#fca5a5' : '#ef4444',
                      color: 'white',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
