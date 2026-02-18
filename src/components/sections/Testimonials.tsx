"use client";

import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

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
      plan: "Emergency Flexi",
      hasPhoto: true,
      bgColor: "#F4EFF3"
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
      plan: "Medical Standard",
      hasPhoto: false,
      avatar: "С",
      bgColor: "#F4EFF3"
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
      plan: "Emergency Standard",
      hasPhoto: true,
      bgColor: "#F4EFF3"
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
      plan: "Medical Flexi",
      hasPhoto: true,
      bgColor: "#F4EFF3"
    }
  ];
  return testimonials;
};

/* Star icon matching Figma 16×16 */
function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M8 0.5L10.163 5.3L15.5 5.955L11.575 9.6L12.615 15L8 12.3L3.385 15L4.425 9.6L0.5 5.955L5.837 5.3L8 0.5Z" fill="#F6C644"/>
    </svg>
  );
}

/* Quote icon matching Figma — orange double-quote marks */
function QuoteIcon() {
  return (
    <svg width="24" height="19" viewBox="0 0 24 19" fill="none" className="shrink-0">
      <path d="M5.31 18.7C3.81 18.7 2.61 18.16 1.71 17.08C0.87 15.94 0.45 14.5 0.45 12.76C0.45 10.42 1.11 8.2 2.43 6.1C3.81 3.94 5.67 2.2 8.01 0.879999L8.91 2.32C7.35 3.34 6.12 4.48 5.22 5.74C4.38 7 3.93 8.32 3.87 9.7C4.29 9.52 4.77 9.43 5.31 9.43C6.63 9.43 7.71 9.88 8.55 10.78C9.39 11.62 9.81 12.76 9.81 14.2C9.81 15.58 9.36 16.72 8.46 17.62C7.62 18.34 6.57 18.7 5.31 18.7ZM16.11 18.7C14.61 18.7 13.41 18.16 12.51 17.08C11.67 15.94 11.25 14.5 11.25 12.76C11.25 10.42 11.91 8.2 13.23 6.1C14.61 3.94 16.47 2.2 18.81 0.879999L19.71 2.32C18.15 3.34 16.92 4.48 16.02 5.74C15.18 7 14.73 8.32 14.67 9.7C15.09 9.52 15.57 9.43 16.11 9.43C17.43 9.43 18.51 9.88 19.35 10.78C20.19 11.62 20.61 12.76 20.61 14.2C20.61 15.58 20.16 16.72 19.26 17.62C18.42 18.34 17.37 18.7 16.11 18.7Z" fill="#DE643B"/>
    </svg>
  );
}

export default function Testimonials({ locale, dict }: TestimonialsProps) {
  const t = dict.testimonials;
  const testimonials = getTestimonials(locale);

  return (
    <section
      id="testimonials"
      className="w-full relative overflow-hidden bg-[#FAFAFA]"
    >
      {/* Figma: px-[310px] py-[80px], content 1300px wide */}
      <div className="mx-auto px-5 lg:px-[100px] xl:px-[200px] 2xl:px-[310px]" style={{ maxWidth: 1920, paddingTop: 80, paddingBottom: 80 }}>

        {/* Section Header — Figma: flex-col gap-[20px] items-start, left-aligned */}
        <div className="flex flex-col items-start" style={{ gap: 20, marginBottom: 40 }}>
          <span className="text-[18px] font-medium text-[#ABA2A5] leading-[1.3]">
            {t.label}
          </span>
          <p className="text-[28px] md:text-[40px] lg:text-[55px] font-bold text-[#2D1D38] leading-[0.9]">
            {t.title}{' '}
            <span className="text-[#DE643B]">{t.titleHighlight}</span>
          </p>
          <p className="text-[16px] font-medium text-[#776667] leading-[1.3]">
            {t.description}
          </p>
        </div>

        {/* Cards Container — Figma: flex gap-[20px], 4 cards each 310×361 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: 20 }}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#F4EFF3] flex items-center"
              style={{ borderRadius: 16, padding: '30px 20px', minHeight: 361 }}
            >
              {/* Inner container — Figma: flex-col gap-[70px] w-[270px] */}
              <div className="flex flex-col items-start w-full" style={{ gap: 70 }}>

                {/* Upper block — Figma: flex-col gap-[30px] h-[176px] */}
                <div className="flex flex-col items-start w-full" style={{ gap: 30, minHeight: 176 }}>

                  {/* Quote icon + plan badge row — Figma: flex justify-between w-full */}
                  <div className="flex items-center justify-between w-full shrink-0">
                    <QuoteIcon />
                    <div className="bg-[#FAFAFA] flex items-center justify-center shrink-0" style={{ borderRadius: 1000, padding: '2px 8px' }}>
                      <span className="text-[12px] font-semibold text-[#ABA2A5] leading-[1.3] whitespace-nowrap">
                        {testimonial.plan}
                      </span>
                    </div>
                  </div>

                  {/* Testimonial text — Figma: 16px medium, flex-1 */}
                  <p className="text-[16px] font-medium text-[#2D1D38] leading-[1.3] flex-1">
                    {testimonial.text}
                  </p>
                </div>

                {/* Author block — Figma: flex gap-[15px] items-start */}
                <div className="flex items-start shrink-0" style={{ gap: 15 }}>
                  {/* Avatar — Figma: 55×55 rounded-[30px] */}
                  {testimonial.hasPhoto ? (
                    <div className="shrink-0 bg-[#ABA2A5] overflow-hidden flex items-center justify-center" style={{ width: 55, height: 55, borderRadius: 30 }}>
                      <span className="text-white font-bold text-[20px]">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  ) : (
                    <div className="shrink-0 bg-[#DE643B] overflow-hidden flex items-center justify-center" style={{ width: 55, height: 55, borderRadius: 30 }}>
                      <span className="text-white font-bold text-[20px]">
                        {testimonial.avatar || testimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Name + Country + Stars — Figma: flex-col gap-[2px] */}
                  <div className="flex flex-col items-start" style={{ gap: 2 }}>
                    <span className="text-[14px] font-semibold text-[#2D1D38] leading-[1.3]">
                      {testimonial.name}
                    </span>
                    <span className="text-[12px] font-semibold text-[#ABA2A5] leading-[1.3]">
                      {testimonial.country}
                    </span>
                    {/* Stars — Figma: flex gap-[2px] */}
                    <div className="flex items-center" style={{ gap: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}