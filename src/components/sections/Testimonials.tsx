"use client";

import { useState } from "react";
import { type Locale, type Dictionary } from "@/lib/i18n";

interface TestimonialsProps {
  locale: Locale;
  dict: Dictionary;
}

const getTestimonials = (locale: Locale) => {
  const testimonials = [
    {
      name: locale === 'ru' ? "Алексей М." : locale === 'uk' ? "Олексій М." : locale === 'ka' ? "ალექსი მ." : locale === 'he' ? "אלכס מ." : locale === 'ar' ? "أليكس م." : locale === 'tr' ? "Alexey M." : "Alex M.",
      country: locale === 'ru' ? "Россия" : locale === 'uk' ? "Росія" : locale === 'ka' ? "რუსეთი" : locale === 'he' ? "רוסיה" : locale === 'ar' ? "روسيا" : locale === 'tr' ? "Rusya" : "Russia",
      text: locale === 'ru' ? "Оформил страховку за 15 минут через WhatsApp. Когда заболел — позвонил на горячую линию, и уже через час был у врача. Всё оплатили без вопросов!" :
            locale === 'uk' ? "Оформив страховку за 15 хвилин через WhatsApp. Коли захворів — зателефонував на гарячу лінію, і вже через годину був у лікаря. Все оплатили без питань!" :
            locale === 'ka' ? "15 წუთში გავაფორმე დაზღვევა WhatsApp-ით. როცა ავად გავხდი — დავურეკე ცხელ ხაზზე და უკვე ერთ საათში ვიყავი ექიმთან. ყველაფერი გადაიხადეს კითხვების გარეშე!" :
            locale === 'he' ? "הנפקתי ביטוח ב-15 דקות דרך WhatsApp. כשחליתי — התקשרתי לקו החם, ותוך שעה כבר הייתי אצל רופא. שילמו על הכל בלי שאלות!" :
            locale === 'ar' ? "أصدرت التأمين في 15 دقيقة عبر واتساب. عندما مرضت — اتصلت بالخط الساخن، وخلال ساعة كنت عند الطبيب. دفعوا كل شيء بدون أسئلة!" :
            locale === 'tr' ? "15 dakikada WhatsApp üzerinden sigorta yaptırdım. Hastalandığımda — yardım hattını aradım ve bir saat içinde doktordaydım. Her şeyi soru sormadan ödediler!" :
            "Got insurance in 15 minutes via WhatsApp. When I got sick — called the hotline, and within an hour I was at the doctor. They paid for everything without questions!",
      rating: 5,
      plan: "EMERGENCY FLEXI",
      avatar: "AM"
    },
    {
      name: locale === 'ru' ? "Светлана К." : locale === 'uk' ? "Світлана К." : locale === 'ka' ? "სვეტლანა კ." : locale === 'he' ? "סבטלנה ק." : locale === 'ar' ? "سفيتلانا ك." : locale === 'tr' ? "Svetlana K." : "Svetlana K.",
      country: locale === 'ru' ? "Украина" : locale === 'uk' ? "Україна" : locale === 'ka' ? "უკრაინა" : locale === 'he' ? "אוקראינה" : locale === 'ar' ? "أوكرانيا" : locale === 'tr' ? "Ukrayna" : "Ukraine",
      text: locale === 'ru' ? "Живу в Батуми уже полгода. Страховка MEDICAL STANDARD покрывает даже плановые визиты к врачу. Очень удобно и выгодно!" :
            locale === 'uk' ? "Живу в Батумі вже півроку. Страховка MEDICAL STANDARD покриває навіть планові візити до лікаря. Дуже зручно і вигідно!" :
            locale === 'ka' ? "ბათუმში უკვე ნახევარი წელია ვცხოვრობ. MEDICAL STANDARD დაზღვევა ფარავს დაგეგმილ ვიზიტებსაც ექიმთან. ძალიან მოსახერხებელი და მომგებიანია!" :
            locale === 'he' ? "גרה בבטומי כבר חצי שנה. ביטוח MEDICAL STANDARD מכסה אפילו ביקורים מתוכננים אצל רופא. נוח ומשתלם מאוד!" :
            locale === 'ar' ? "أعيش في باتومي منذ نصف عام. تأمين MEDICAL STANDARD يغطي حتى الزيارات المخططة للطبيب. مريح ومربح جداً!" :
            locale === 'tr' ? "Batum'da yarım yıldır yaşıyorum. MEDICAL STANDARD sigortası planlı doktor ziyaretlerini bile kapsıyor. Çok kullanışlı ve avantajlı!" :
            "Living in Batumi for half a year. MEDICAL STANDARD insurance covers even planned doctor visits. Very convenient and cost-effective!",
      rating: 5,
      plan: "MEDICAL STANDARD",
      avatar: "СК"
    },
    {
      name: locale === 'ru' ? "Дмитрий В." : locale === 'uk' ? "Дмитро В." : locale === 'ka' ? "დიმიტრი ვ." : locale === 'he' ? "דמיטרי ו." : locale === 'ar' ? "ديمتري ف." : locale === 'tr' ? "Dmitry V." : "Dmitry V.",
      country: locale === 'ru' ? "Беларусь" : locale === 'uk' ? "Білорусь" : locale === 'ka' ? "ბელარუსი" : locale === 'he' ? "בלארוס" : locale === 'ar' ? "بيلاروسيا" : locale === 'tr' ? "Belarus" : "Belarus",
      text: locale === 'ru' ? "Приехал на месяц, понадобилась экстренная помощь. Страховка сработала идеально — госпитализация, операция, всё покрыто. Спасибо команде!" :
            locale === 'uk' ? "Приїхав на місяць, знадобилась екстрена допомога. Страховка спрацювала ідеально — госпіталізація, операція, все покрито. Дякую команді!" :
            locale === 'ka' ? "ერთი თვით ჩამოვედი, გადაუდებელი დახმარება დამჭირდა. დაზღვევამ იდეალურად იმუშავა — ჰოსპიტალიზაცია, ოპერაცია, ყველაფერი დაფარული. მადლობა გუნდს!" :
            locale === 'he' ? "הגעתי לחודש, הייתי צריך עזרה חירום. הביטוח עבד מושלם — אשפוז, ניתוח, הכל מכוסה. תודה לצוות!" :
            locale === 'ar' ? "جئت لمدة شهر، احتجت مساعدة طارئة. التأمين عمل بشكل مثالي — دخول المستشفى، العملية، كل شيء مغطى. شكراً للفريق!" :
            locale === 'tr' ? "Bir aylığına geldim, acil yardıma ihtiyacım oldu. Sigorta mükemmel çalıştı — hastaneye yatış, ameliyat, her şey karşılandı. Ekibe teşekkürler!" :
            "Came for a month, needed emergency help. Insurance worked perfectly — hospitalization, surgery, everything covered. Thanks to the team!",
      rating: 5,
      plan: "EMERGENCY STANDARD",
      avatar: "ДВ"
    },
    {
      name: locale === 'ru' ? "Марина П." : locale === 'uk' ? "Марина П." : locale === 'ka' ? "მარინა პ." : locale === 'he' ? "מרינה פ." : locale === 'ar' ? "مارينا ب." : locale === 'tr' ? "Marina P." : "Marina P.",
      country: locale === 'ru' ? "Казахстан" : locale === 'uk' ? "Казахстан" : locale === 'ka' ? "ყაზახეთი" : locale === 'he' ? "קזחסטן" : locale === 'ar' ? "كازاخستان" : locale === 'tr' ? "Kazakistan" : "Kazakhstan",
      text: locale === 'ru' ? "Переехала в Тбилиси с семьёй. Оформили страховку на троих — быстро, понятно, без бюрократии. Рекомендую всем!" :
            locale === 'uk' ? "Переїхала до Тбілісі з сім'єю. Оформили страховку на трьох — швидко, зрозуміло, без бюрократії. Рекомендую всім!" :
            locale === 'ka' ? "თბილისში ოჯახთან ერთად გადავედი. სამივეზე გავაფორმეთ დაზღვევა — სწრაფად, გასაგებად, ბიუროკრატიის გარეშე. ყველას ვურჩევ!" :
            locale === 'he' ? "עברתי לטביליסי עם המשפחה. הנפקנו ביטוח לשלושה — מהר, ברור, בלי בירוקרטיה. ממליצה לכולם!" :
            locale === 'ar' ? "انتقلت إلى تبليسي مع عائلتي. أصدرنا تأميناً لثلاثة — سريع، واضح، بدون بيروقراطية. أنصح الجميع!" :
            locale === 'tr' ? "Ailemle Tiflis'e taşındım. Üçümüz için sigorta yaptırdık — hızlı, anlaşılır, bürokrasi yok. Herkese tavsiye ederim!" :
            "Moved to Tbilisi with family. Got insurance for three — fast, clear, no bureaucracy. Recommend to everyone!",
      rating: 5,
      plan: "MEDICAL FLEXI",
      avatar: "МП"
    }
  ];
  return testimonials;
};

export default function Testimonials({ locale, dict }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = dict.testimonials;
  const testimonials = getTestimonials(locale);

  return (
    <section 
      id="testimonials" 
      className="w-full relative overflow-hidden"
      style={{ 
        background: '#fff',
        paddingTop: '60px',
        paddingBottom: '80px'
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10" style={{ maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px' }}>
        
        {/* Section Header */}
        <div className="text-center" style={{ marginBottom: '48px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.15em',
              padding: '8px 16px',
              borderRadius: '50px',
              marginBottom: '20px'
            }}
          >
            <svg style={{ width: '14px', height: '14px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {t.label}
          </div>
          <h2 
            style={{ 
              fontSize: 'clamp(28px, 5vw, 44px)',
              fontWeight: '800',
              color: '#18181b',
              marginBottom: '16px',
              lineHeight: '1.2'
            }}
          >
            {t.title} <span style={{ color: '#ef4444' }}>{t.titleHighlight}</span>
          </h2>
          <p 
            style={{ 
              fontSize: '16px',
              color: '#71717a',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}
          >
            {t.description}
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div style={{ position: 'relative' }}>
          
          {/* Main Testimonial Card */}
          <div 
            style={{
              background: '#fff',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
              border: '1px solid #f4f4f5',
              marginBottom: '24px'
            }}
          >
            {/* Quote Icon */}
            <div 
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}
            >
              <svg style={{ width: '24px', height: '24px', color: '#fff' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
            </div>

            {/* Testimonial Text */}
            <p 
              style={{
                fontSize: '18px',
                lineHeight: '1.7',
                color: '#3f3f46',
                marginBottom: '28px',
                fontStyle: 'italic'
              }}
            >
              "{testimonials[activeIndex].text}"
            </p>

            {/* Author Info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div 
                  style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}
                >
                  {testimonials[activeIndex].avatar}
                </div>
                <div>
                  <p style={{ fontWeight: '700', color: '#18181b', fontSize: '16px', marginBottom: '2px' }}>
                    {testimonials[activeIndex].name}
                  </p>
                  <p style={{ color: '#71717a', fontSize: '14px' }}>
                    {testimonials[activeIndex].country}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Rating */}
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{ width: '18px', height: '18px', color: '#facc15' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))}
                </div>
                
                {/* Plan Badge */}
                <span 
                  style={{
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '6px 12px',
                    borderRadius: '8px'
                  }}
                >
                  {testimonials[activeIndex].plan}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                style={{
                  width: index === activeIndex ? '32px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: index === activeIndex ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e4e4e7',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            marginTop: '48px'
          }}
          className="sm:!grid-cols-4"
        >
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>5000+</p>
            <p style={{ fontSize: '13px', color: '#71717a' }}>{t.stats.clients}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>4.9</p>
            <p style={{ fontSize: '13px', color: '#71717a' }}>{t.stats.rating}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>15 {t.stats.processingTime?.replace('15 ', '').replace('15', '') || 'мин'}</p>
            <p style={{ fontSize: '13px', color: '#71717a' }}>{t.stats.processing}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '28px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>24/7</p>
            <p style={{ fontSize: '13px', color: '#71717a' }}>{t.stats.support}</p>
          </div>
        </div>

      </div>
    </section>
  );
}