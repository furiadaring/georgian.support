import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Advantages from "@/components/sections/Advantages";
import InsurancePlans from "@/components/sections/InsurancePlans";
import FAQ from "@/components/sections/FAQ";
import ContactForm from "@/components/sections/ContactForm";
import Testimonials from "@/components/sections/Testimonials";
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
    <div className="w-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Traffic source tracking */}
      <span id="95a7120e-9386-f816-0ece-b8a15392df16" style={{ display: 'none' }}></span>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('95a7120e-9386-f816-0ece-b8a15392df16').innerHTML = '<a href="https://track.georgian.support/KXGB3w?&se_referrer=' + encodeURIComponent(document.referrer) + '&default_keyword=' + encodeURIComponent(document.title) + '&'+window.location.search.replace('?', '&')+'">Link</a>';
          `
        }}
      />
      <span id="0ba14e2f-f9da-4c81-4842-88da24f3af00" style={{ display: 'none' }}></span>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('0ba14e2f-f9da-4c81-4842-88da24f3af00').innerHTML = '<a href="https://redirgo.link/H4ZTcH?&se_referrer=' + encodeURIComponent(document.referrer) + '&default_keyword=' + encodeURIComponent(document.title) + '&'+window.location.search.replace('?', '&')+'">Link</a>';
          `
        }}
      />
      <Header locale={locale} dict={dict} />
      <main className="main-content w-full flex flex-col items-center">
        <Hero locale={locale} dict={dict} />
        <Advantages locale={locale} dict={dict} />
        <InsurancePlans locale={locale} dict={dict} />
        <FAQ locale={locale} dict={dict} />
        <ContactForm locale={locale} dict={dict} />
        <Testimonials locale={locale} dict={dict} />
      </main>
      <Footer locale={locale} dict={dict} />
    </div>
  );
}
