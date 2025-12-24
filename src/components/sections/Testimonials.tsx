"use client";

import { useState, useEffect } from "react";
import { type Locale, type Dictionary, isRtlLocale } from "@/lib/i18n";

interface TestimonialsProps {
  locale: Locale;
  dict: Dictionary;
}

// Testimonials data - names are transliterated/adapted for different locales
const getTestimonials = (locale: Locale) => {
  const testimonials = [
    {
      name: locale === 'ru' ? "Анна К." : locale === 'uk' ? "Ганна К." : locale === 'ka' ? "ანა კ." : locale === 'he' ? "אנה ק." : locale === 'ar' ? "آنا ك." : locale === 'tr' ? "Anna K." : "Anna K.",
      role: locale === 'ru' ? "Туристка из России" : locale === 'uk' ? "Туристка з Росії" : locale === 'ka' ? "ტურისტი რუსეთიდან" : locale === 'he' ? "תיירת מרוסיה" : locale === 'ar' ? "سائحة من روسيا" : locale === 'tr' ? "Rusya'dan turist" : "Tourist from Russia",
      text: locale === 'ru' ? "Оформили страховку за 10 минут прямо в аэропорту. Когда понадобилась помощь — всё решили моментально. Очень довольна!" :
            locale === 'uk' ? "Оформили страховку за 10 хвилин прямо в аеропорту. Коли знадобилась допомога — все вирішили миттєво. Дуже задоволена!" :
            locale === 'ka' ? "10 წუთში გავაფორმეთ დაზღვევა პირდაპირ აეროპორტში. როცა დახმარება დამჭირდა — ყველაფერი მომენტალურად მოგვარდა." :
            locale === 'he' ? "הנפקנו ביטוח ב-10 דקות ישירות בשדה התעופה. כשהייתי צריכה עזרה — הכל נפתר מיד. מאוד מרוצה!" :
            locale === 'ar' ? "أصدرنا التأمين في 10 دقائق مباشرة في المطار. عندما احتجت مساعدة — تم حل كل شيء فوراً. سعيدة جداً!" :
            locale === 'tr' ? "Sigortayı havalimanında 10 dakikada yaptırdık. Yardım gerektiğinde — her şey anında çözüldü. Çok memnunum!" :
            "Got insurance in 10 minutes right at the airport. When I needed help — everything was resolved instantly. Very satisfied!",
      plan: "PREMIUM"
    },
    {
      name: locale === 'ru' ? "Михаил Д." : locale === 'uk' ? "Михайло Д." : locale === 'ka' ? "მიხეილ დ." : locale === 'he' ? "מיכאל ד." : locale === 'ar' ? "ميخائيل د." : locale === 'tr' ? "Mihail D." : "Michael D.",
      role: locale === 'ru' ? "Экспат, программист" : locale === 'uk' ? "Експат, програміст" : locale === 'ka' ? "ექსპატი, პროგრამისტი" : locale === 'he' ? "שוהה, מתכנת" : locale === 'ar' ? "مقيم، مبرمج" : locale === 'tr' ? "Göçmen, yazılımcı" : "Expat, programmer",
      text: locale === 'ru' ? "Живу в Тбилиси уже год. UNO ACTIVE — идеальный вариант. Покрывает всё, включая плановые осмотры." :
            locale === 'uk' ? "Живу в Тбілісі вже рік. UNO ACTIVE — ідеальний варіант. Покриває все, включаючи планові огляди." :
            locale === 'ka' ? "თბილისში ვცხოვრობ უკვე ერთი წელია. UNO ACTIVE — იდეალური ვარიანტია. ფარავს ყველაფერს, პროფილაქტიკური შემოწმებების ჩათვლით." :
            locale === 'he' ? "גר בטביליסי כבר שנה. UNO ACTIVE — אפשרות מושלמת. מכסה הכל, כולל בדיקות שגרתיות." :
            locale === 'ar' ? "أعيش في تبليسي منذ سنة. UNO ACTIVE — خيار مثالي. يغطي كل شيء، بما في ذلك الفحوصات الروتينية." :
            locale === 'tr' ? "Tiflis'te bir yıldır yaşıyorum. UNO ACTIVE — mükemmel seçenek. Rutin kontroller dahil her şeyi kapsıyor." :
            "Living in Tbilisi for a year now. UNO ACTIVE — perfect option. Covers everything, including routine checkups.",
      plan: "UNO ACTIVE"
    },
    {
      name: locale === 'ru' ? "Елена В." : locale === 'uk' ? "Олена В." : locale === 'ka' ? "ელენა ვ." : locale === 'he' ? "אלנה ו." : locale === 'ar' ? "إيلينا ف." : locale === 'tr' ? "Elena V." : "Elena V.",
      role: locale === 'ru' ? "Туристка из Украины" : locale === 'uk' ? "Туристка з України" : locale === 'ka' ? "ტურისტი უკრაინიდან" : locale === 'he' ? "תיירת מאוקראינה" : locale === 'ar' ? "سائحة من أوكرانيا" : locale === 'tr' ? "Ukrayna'dan turist" : "Tourist from Ukraine",
      text: locale === 'ru' ? "Сломала ногу на горнолыжном курорте. Страховка покрыла всё: скорую, операцию, реабилитацию. Спасибо огромное!" :
            locale === 'uk' ? "Зламала ногу на гірськолижному курорті. Страховка покрила все: швидку, операцію, реабілітацію. Дякую величезне!" :
            locale === 'ka' ? "ფეხი მოვიტეხე სათხილამურო კურორტზე. დაზღვევამ ყველაფერი დაფარა: სასწრაფო, ოპერაცია, რეაბილიტაცია. დიდი მადლობა!" :
            locale === 'he' ? "שברתי רגל באתר סקי. הביטוח כיסה הכל: אמבולנס, ניתוח, שיקום. תודה רבה!" :
            locale === 'ar' ? "كسرت ساقي في منتجع التزلج. غطى التأمين كل شيء: الإسعاف، العملية، إعادة التأهيل. شكراً جزيلاً!" :
            locale === 'tr' ? "Kayak merkezinde bacağımı kırdım. Sigorta her şeyi karşıladı: ambulans, ameliyat, rehabilitasyon. Çok teşekkürler!" :
            "Broke my leg at a ski resort. Insurance covered everything: ambulance, surgery, rehabilitation. Thank you so much!",
      plan: "PREMIUM"
    },
    {
      name: locale === 'ru' ? "Давид С." : locale === 'uk' ? "Давід С." : locale === 'ka' ? "დავით ს." : locale === 'he' ? "דוד ס." : locale === 'ar' ? "داود س." : locale === 'tr' ? "David S." : "David S.",
      role: locale === 'ru' ? "Бизнесмен из Израиля" : locale === 'uk' ? "Бізнесмен з Ізраїлю" : locale === 'ka' ? "ბიზნესმენი ისრაელიდან" : locale === 'he' ? "איש עסקים מישראל" : locale === 'ar' ? "رجل أعمال من إسرائيل" : locale === 'tr' ? "İsrail'den iş adamı" : "Businessman from Israel",
      text: locale === 'ru' ? "Регулярно приезжаю в Грузию по бизнесу. Краткосрочная страховка — отличное решение. 3 лари в день — это копейки за спокойствие." :
            locale === 'uk' ? "Регулярно приїжджаю до Грузії по бізнесу. Короткострокова страховка — відмінне рішення. 3 ларі на день — це дрібниці за спокій." :
            locale === 'ka' ? "რეგულარულად ვჩამოვდივარ საქართველოში ბიზნესით. მოკლევადიანი დაზღვევა — შესანიშნავი გადაწყვეტილებაა. 3 ლარი დღეში — სიმშვიდისთვის ეს წვრილმანია." :
            locale === 'he' ? "מגיע לגאורגיה באופן קבוע לעסקים. ביטוח קצר טווח — פתרון מצוין. 3 לארי ליום — זה כלום בשביל שקט נפשי." :
            locale === 'ar' ? "أزور جورجيا بانتظام للأعمال. التأمين قصير المدى — حل ممتاز. 3 لاري في اليوم — هذا لا شيء مقابل راحة البال." :
            locale === 'tr' ? "Gürcistan'a düzenli olarak iş için geliyorum. Kısa süreli sigorta — mükemmel çözüm. Günde 3 lari — huzur için bu hiçbir şey." :
            "I regularly visit Georgia for business. Short-term insurance — excellent solution. 3 lari per day — that's nothing for peace of mind.",
      plan: "VISITOR"
    },
    {
      name: locale === 'ru' ? "Мария П." : locale === 'uk' ? "Марія П." : locale === 'ka' ? "მარია პ." : locale === 'he' ? "מריה פ." : locale === 'ar' ? "ماريا ب." : locale === 'tr' ? "Maria P." : "Maria P.",
      role: locale === 'ru' ? "Удалённый работник" : locale === 'uk' ? "Віддалений працівник" : locale === 'ka' ? "დისტანციური მუშაკი" : locale === 'he' ? "עובדת מרחוק" : locale === 'ar' ? "عاملة عن بعد" : locale === 'tr' ? "Uzaktan çalışan" : "Remote worker",
      text: locale === 'ru' ? "Переехала в Батуми на зимовку. За полгода пользовалась страховкой дважды — всё было организовано идеально." :
            locale === 'uk' ? "Переїхала до Батумі на зимівлю. За півроку користувалася страховкою двічі — все було організовано ідеально." :
            locale === 'ka' ? "ბათუმში გადავედი ზამთრისთვის. ნახევარ წელიწადში ორჯერ გამოვიყენე დაზღვევა — ყველაფერი იდეალურად იყო ორგანიზებული." :
            locale === 'he' ? "עברתי לבטומי לחורף. בחצי שנה השתמשתי בביטוח פעמיים — הכל היה מאורגן מושלם." :
            locale === 'ar' ? "انتقلت إلى باتومي لفصل الشتاء. في نصف عام استخدمت التأمين مرتين — كل شيء كان منظماً بشكل مثالي." :
            locale === 'tr' ? "Kış için Batum'a taşındım. Altı ayda sigortayı iki kez kullandım — her şey mükemmel organize edilmişti." :
            "Moved to Batumi for the winter. Used insurance twice in half a year — everything was organized perfectly.",
      plan: "OPTIMUM"
    },
    {
      name: locale === 'ru' ? "Алексей Н." : locale === 'uk' ? "Олексій Н." : locale === 'ka' ? "ალექსეი ნ." : locale === 'he' ? "אלכסיי נ." : locale === 'ar' ? "أليكسي ن." : locale === 'tr' ? "Aleksey N." : "Alexey N.",
      role: locale === 'ru' ? "Пенсионер" : locale === 'uk' ? "Пенсіонер" : locale === 'ka' ? "პენსიონერი" : locale === 'he' ? "פנסיונר" : locale === 'ar' ? "متقاعد" : locale === 'tr' ? "Emekli" : "Retiree",
      text: locale === 'ru' ? "В 68 лет решил пожить в Грузии. UNO ACTIVE+ покрывает всё, включая хронические заболевания. Очень благодарен за заботу!" :
            locale === 'uk' ? "У 68 років вирішив пожити в Грузії. UNO ACTIVE+ покриває все, включаючи хронічні захворювання. Дуже вдячний за турботу!" :
            locale === 'ka' ? "68 წლის ასაკში გადავწყვიტე საქართველოში მეცხოვრა. UNO ACTIVE+ ყველაფერს ფარავს, ქრონიკული დაავადებების ჩათვლით. ძალიან მადლობელი ვარ ზრუნვისთვის!" :
            locale === 'he' ? "בגיל 68 החלטתי לגור בגאורגיה. UNO ACTIVE+ מכסה הכל, כולל מחלות כרוניות. תודה רבה על הדאגה!" :
            locale === 'ar' ? "في سن 68 قررت العيش في جورجيا. UNO ACTIVE+ يغطي كل شيء، بما في ذلك الأمراض المزمنة. شكراً جزيلاً على الرعاية!" :
            locale === 'tr' ? "68 yaşında Gürcistan'da yaşamaya karar verdim. UNO ACTIVE+ kronik hastalıklar dahil her şeyi kapsıyor. İlgi için çok teşekkürler!" :
            "At 68 I decided to live in Georgia. UNO ACTIVE + covers everything, including chronic conditions. Very grateful for the care!",
      plan: "UNO ACTIVE +"
    }
  ];
  return testimonials;
};

const colors = [
  { bg: "from-primary-blue to-blue-600", light: "bg-blue-100", text: "text-primary-blue" },
  { bg: "from-emerald-500 to-green-600", light: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "from-violet-500 to-purple-600", light: "bg-violet-100", text: "text-violet-600" },
  { bg: "from-orange-400 to-red-500", light: "bg-orange-100", text: "text-orange-600" },
  { bg: "from-pink-500 to-rose-600", light: "bg-pink-100", text: "text-pink-600" },
  { bg: "from-cyan-500 to-teal-600", light: "bg-cyan-100", text: "text-cyan-600" },
];

export default function Testimonials({ locale, dict }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const t = dict.testimonials;
  const testimonials = getTestimonials(locale);
  const isRtl = isRtlLocale(locale);

  // Auto-rotate featured testimonial
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative bg-linear-to-b from-white via-slate-50 to-white py-16 lg:py-24 w-full overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-20 w-75 h-75 bg-violet-500/5 rounded-full blur-3xl" />
        {/* Decorative quotes */}
        <div className="absolute top-20 left-10 text-primary-blue/5 text-[200px] font-serif leading-none select-none">"</div>
        <div className="absolute bottom-20 right-10 text-primary-blue/5 text-[200px] font-serif leading-none select-none rotate-180">"</div>
      </div>

      <div className="relative z-10" style={{ maxWidth: '1200px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '56px' }}>
          <div className="inline-flex items-center gap-2 bg-primary-blue/10 text-primary-blue text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full" style={{ marginBottom: '20px' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t.label}
          </div>
          <h2 id="testimonials-heading" className="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-black" style={{ margin: '0 0 20px 0' }}>
            {t.title} <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-blue to-blue-600">{t.titleHighlight}</span>
          </h2>
          <p className="text-base lg:text-lg text-primary-grey" style={{ margin: '0 auto', maxWidth: '550px' }}>
            {t.description}
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="relative bg-white rounded-3xl border border-gray-200 shadow-2xl shadow-primary-blue/10 overflow-hidden" style={{ marginBottom: '32px', padding: '40px' }}>
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-blue via-emerald-500 to-violet-500" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Quote */}
            <div className={`lg:col-span-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              <svg className={`w-12 h-12 text-primary-blue/20 ${isRtl ? 'rotate-180' : ''}`} style={{ marginBottom: '16px' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl lg:text-2xl text-primary-black leading-relaxed font-medium" style={{ marginBottom: '24px' }}>
                {testimonials[activeIndex].text}
              </p>
              <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${colors[activeIndex].bg} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                  {testimonials[activeIndex].name.charAt(0)}
                </div>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="font-bold text-primary-black text-lg">{testimonials[activeIndex].name}</p>
                  <p className="text-primary-grey">{testimonials[activeIndex].role}</p>
                </div>
                {testimonials[activeIndex].plan && (
                  <span className={`${isRtl ? 'mr-auto' : 'ml-auto'} hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary-blue bg-primary-blue/10 px-4 py-2 rounded-full`}>
                    ✓ {testimonials[activeIndex].plan}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="lg:col-span-2 flex lg:flex-col items-center justify-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex 
                      ? `w-12 h-3 lg:w-3 lg:h-12 bg-linear-to-r lg:bg-linear-to-b ${colors[index].bg}` 
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`${t.label} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`group text-left bg-white rounded-2xl border transition-all duration-300 ${
                index === activeIndex 
                  ? "border-primary-blue shadow-xl shadow-primary-blue/10 scale-[1.02]" 
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              } ${isRtl ? 'text-right' : 'text-left'}`}
              style={{ padding: '24px' }}
            >
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`} style={{ marginBottom: '12px' }}>
                <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${colors[index].bg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {testimonial.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary-black truncate">{testimonial.name}</p>
                  <p className="text-xs text-primary-grey truncate">{testimonial.role}</p>
                </div>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-primary-grey line-clamp-3 leading-relaxed">
                "{testimonial.text}"
              </p>
              {testimonial.plan && (
                <div style={{ marginTop: '12px' }}>
                  <span className={`inline-flex items-center text-xs font-medium ${colors[index].text} ${colors[index].light} px-2.5 py-1 rounded-full`}>
                    {testimonial.plan}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden" style={{ marginTop: '48px' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/10">
            <div className="text-center" style={{ padding: '24px 16px' }}>
              <p className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>5000+</p>
              <p className="text-sm text-slate-400">{t.stats.clients}</p>
            </div>
            <div className="text-center" style={{ padding: '24px 16px' }}>
              <p className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>4.9</p>
              <p className="text-sm text-slate-400">{t.stats.rating}</p>
            </div>
            <div className="text-center" style={{ padding: '24px 16px' }}>
              <p className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>{t.stats.processingTime}</p>
              <p className="text-sm text-slate-400">{t.stats.processing}</p>
            </div>
            <div className="text-center" style={{ padding: '24px 16px' }}>
              <p className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '4px' }}>24/7</p>
              <p className="text-sm text-slate-400">{t.stats.support}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
