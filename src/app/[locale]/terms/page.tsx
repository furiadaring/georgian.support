import { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/constants";
import { createBreadcrumbSchema } from "@/lib/metadata";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";

type Locale = 'ru' | 'en' | 'ka' | 'uk' | 'tr' | 'he' | 'ar';

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = getDictionary(locale as Locale);
  
  return {
    title: dict.terms.title,
    description: dict.terms.description,
    alternates: {
      canonical: `/${locale}/terms`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: dict.common.backToHome, url: `https://visitgeorgia.online/${locale}` },
    { name: dict.terms.title, url: `https://visitgeorgia.online/${locale}/terms` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="w-full flex flex-col items-center">
        <Header locale={locale} dict={dict} />
        <main className="main-content w-full flex flex-col items-center">
          {/* Hero Section */}
          <section className="relative w-full bg-linear-to-br from-primary-blue via-primary-blue-dark to-slate-900 overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-[10%] w-72 h-72 bg-primary-blue-light/20 rounded-full blur-3xl" />
              <div className="absolute top-40 right-[15%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[50px_50px]" />
            </div>
            <div className="relative z-10" style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
              <div className="text-center">
                <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-blue-200/70 hover:text-white transition-colors text-sm" style={{ marginBottom: '1rem' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {dict.common.backToHome}
                </Link>
                <h1 className="text-3xl lg:text-4xl font-bold text-white" style={{ marginBottom: '1rem' }}>
                  {dict.terms.title}
                </h1>
                <p className="text-blue-100/70">
                  {dict.terms.lastUpdated}
                </p>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="relative w-full bg-white py-16 lg:py-24">
            <div style={{ maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
              
              {/* Section 1 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section1.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section1.p1}
                </p>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section1.p2}
                </p>
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section2.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section2.p1}
                </p>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section2.p2}
                </p>
              </div>

              {/* Section 3 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section3.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section3.p1}
                </p>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section3.p2}
                </p>
              </div>

              {/* Section 4 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section4.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section4.intro}
                </p>
                <ul className="text-primary-grey leading-relaxed" style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {dict.terms.section4.items.map((item: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                  ))}
                </ul>
                <p className="text-primary-grey leading-relaxed" style={{ marginTop: '1rem' }}>
                  {dict.terms.section4.note}
                </p>
              </div>

              {/* Section 5 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section5.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section5.p1}
                </p>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section5.p2}
                </p>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section5.seePrivacy}{" "}
                  <Link href={`/${locale}/privacy`} className="text-primary-blue hover:underline">
                    {dict.privacy.title}
                  </Link>.
                </p>
              </div>

              {/* Section 6 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section6.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section6.p1}
                </p>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section6.p2}
                </p>
              </div>

              {/* Section 7 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section7.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section7.intro}
                </p>
                <ul className="text-primary-grey leading-relaxed" style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                  {dict.terms.section7.items.map((item: string, index: number) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Section 8 */}
              <div style={{ marginBottom: '3rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section8.title}
                </h2>
                <p className="text-primary-grey leading-relaxed">
                  {dict.terms.section8.text}
                </p>
              </div>

              {/* Section 9 - Contacts */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200" style={{ padding: '2rem' }}>
                <h2 className="text-xl font-bold text-primary-black" style={{ marginBottom: '1rem' }}>
                  {dict.terms.section9.title}
                </h2>
                <p className="text-primary-grey leading-relaxed" style={{ marginBottom: '1.5rem' }}>
                  {dict.terms.section9.text}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a 
                    href={`mailto:${CONTACT.email}`} 
                    className="inline-flex items-center gap-3 text-primary-blue hover:text-primary-blue-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {CONTACT.email}
                  </a>
                  <a 
                    href={CONTACT.whatsapp} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-primary-blue hover:text-primary-blue-dark transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp: {CONTACT.phone}
                  </a>
                </div>
              </div>

              {/* Back to Home */}
              <div className="text-center" style={{ marginTop: '3rem' }}>
                <Link 
                  href={`/${locale}`} 
                  className="inline-flex items-center gap-2 bg-primary-blue hover:bg-primary-blue-dark text-white font-semibold rounded-xl transition-colors"
                  style={{ padding: '1rem 2rem' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {dict.common.backToHome}
                </Link>
              </div>

            </div>
          </section>
        </main>
        <Footer locale={locale} dict={dict} />
      </div>
    </>
  );
}
