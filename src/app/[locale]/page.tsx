import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Advantages from "@/components/sections/Advantages";
import InsurancePlans from "@/components/sections/InsurancePlans";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Testimonials from "@/components/sections/Testimonials";
import Referral from "@/components/sections/Referral";
import { getDictionary, type Dictionary } from "@/lib/i18n";
import { structuredData } from "@/lib/metadata";

type Locale = 'ru' | 'en' | 'ka' | 'uk' | 'tr' | 'he' | 'ar';

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);
  
  return (
    <div className="w-full flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header locale={locale} dict={dict} />
      <main className="main-content w-full flex flex-col items-center">
        <Hero locale={locale} dict={dict} />
        <Advantages locale={locale} dict={dict} />
        <InsurancePlans locale={locale} dict={dict} />
        <FAQ locale={locale} dict={dict} />
        <ContactForm locale={locale} dict={dict} />
        <Testimonials locale={locale} dict={dict} />
        <Referral locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
