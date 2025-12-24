# Visit Georgia Insurance

Medical insurance website for tourists and expats in Georgia. Multi-language platform with coverage up to $50,000 and a referral program.

**Live Site:** [visitgeorgia.online](https://visitgeorgia.online)

---

## 🚀 Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| **Next.js** | 16.0.10 | React framework with App Router & Turbopack |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.9.3 | Type-safe JavaScript |
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework (v4 syntax) |
| **ESLint** | 9.39.2 | Linting with Next.js config |
| **Prettier** | 3.7.4 | Code formatting with Tailwind plugin |
| **Husky** | 9.1.7 | Git hooks |
| **lint-staged** | 15.5.2 | Run linters on staged files |

---

## 🌍 Internationalization (i18n)

The website supports **7 languages** with full translation coverage:

| Language | Code | Direction | Flag |
|----------|------|-----------|------|
| Русский (Russian) | `ru` | LTR | 🇷🇺 |
| English | `en` | LTR | 🇬🇧 |
| ქართული (Georgian) | `ka` | LTR | 🇬🇪 |
| Українська (Ukrainian) | `uk` | LTR | 🇺🇦 |
| Türkçe (Turkish) | `tr` | LTR | 🇹🇷 |
| עברית (Hebrew) | `he` | **RTL** | 🇮🇱 |
| العربية (Arabic) | `ar` | **RTL** | 🇸🇦 |

**Default locale:** Russian (`ru`)

### URL Structure
- `visitgeorgia.online/ru` - Russian
- `visitgeorgia.online/en` - English
- `visitgeorgia.online/ka` - Georgian
- etc.

### RTL Support
Hebrew and Arabic locales have full RTL (right-to-left) support with proper text alignment, mirrored layouts, and reversed navigation.

---

## 🏥 Insurance Plans

| Plan | Price | Period | Coverage | Target Audience |
|------|-------|--------|----------|-----------------|
| **VISITOR** | 4 GEL | /day | $30,000 | Short-term tourists |
| **STANDARD** | 200 GEL | /3 months | $30,000 | Extended stays |
| **OPTIMUM** | 250 GEL | /6 months | $30,000 | Long-term tourists |
| **PREMIUM** ⭐ | 300 GEL | /year | $50,000 | Full coverage |
| **UNO ACTIVE** | 55 GEL | /month | $15,000 | Flexible monthly |
| **UNO ACTIVE+** | 90 GEL | /month | $20,000 | Enhanced monthly |

### Coverage Details
Each plan includes detailed coverage information in a modal popup with:
- Full list of covered services (up to 18 items)
- Exclusions and limitations
- FAQ specific to the plan

---

## 🎁 Referral Program

Customers can earn discounts by referring friends:

| Plan | Discount per Friend | Max Friends | Max Discount |
|------|---------------------|-------------|--------------|
| **OPTIMUM** | 50 GEL | 5 | 250 GEL (FREE) |
| **PREMIUM** | 100 GEL | 3 | 300 GEL (FREE) |

**Features:**
- Discounts can be used immediately or accumulated
- Progress visualization for each referral
- Dedicated section with step-by-step instructions
- Fully translated in all 7 languages

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/              # Localized pages
│   │   ├── layout.tsx         # Root layout with i18n
│   │   ├── page.tsx           # Home page
│   │   ├── privacy/           # Privacy policy
│   │   └── terms/             # Terms of service
│   ├── api/
│   │   ├── contact/           # Contact form endpoint
│   │   └── health/            # Health check endpoint
│   ├── opengraph-image.tsx    # Dynamic OG image
│   ├── twitter-image.tsx      # Dynamic Twitter image
│   ├── sitemap.ts             # XML sitemap (all locales)
│   └── robots.ts              # robots.txt
│
├── components/
│   ├── sections/
│   │   ├── Hero.tsx           # Hero banner with pricing cards
│   │   ├── Advantages.tsx     # Why choose us (4 cards)
│   │   ├── InsurancePlans.tsx # 6 insurance plans grid
│   │   ├── Testimonials.tsx   # Customer reviews carousel
│   │   ├── Referral.tsx       # Referral program section
│   │   ├── FAQ.tsx            # Accordion FAQ
│   │   └── ContactForm.tsx    # Lead generation form
│   ├── ui/
│   │   ├── LanguageSwitcher.tsx  # Flag-based locale picker
│   │   ├── InsuranceModal.tsx    # Plan details modal
│   │   ├── CookieConsent.tsx     # GDPR cookie banner
│   │   ├── Snowflakes.tsx        # Christmas decoration
│   │   ├── SocialLinks.tsx       # Social media icons
│   │   ├── FadeIn.tsx            # Scroll animation wrapper
│   │   ├── Skeletons.tsx         # Loading skeletons
│   │   └── ErrorBoundary.tsx     # Error handling
│   ├── Header.tsx             # Navigation with mobile menu
│   └── Footer.tsx             # Site footer
│
├── lib/
│   ├── i18n/
│   │   ├── config.ts          # Locale configuration
│   │   ├── index.ts           # i18n utilities
│   │   └── locales/           # Translation JSON files
│   │       ├── ru.json
│   │       ├── en.json
│   │       ├── ka.json
│   │       ├── uk.json
│   │       ├── tr.json
│   │       ├── he.json
│   │       └── ar.json
│   ├── constants.ts           # Plans, contact info, FAQs
│   ├── metadata.ts            # SEO metadata & schemas
│   ├── fonts.ts               # Font configuration
│   └── assets.ts              # Asset utilities
│
├── hooks/
│   └── index.ts               # Custom React hooks
│
└── types/
    └── index.ts               # TypeScript definitions

public/
├── .well-known/
│   └── security.txt           # Security contact info
├── ads.txt                    # Google Ads verification
├── manifest.json              # PWA manifest
├── icons/                     # App icons & flags
└── images/                    # Static images
```

---

## ✨ Features

### Core Features
- **📱 Responsive Design** - Mobile-first with Tailwind CSS v4
- **🌐 Multi-language** - 7 languages with RTL support
- **🔒 Security** - HSTS, XSS protection, CSP headers
- **⚡ Performance** - Next.js 16 with Turbopack, optimized images
- **🍪 Cookie Consent** - GDPR-compliant banner
- **📧 Contact Form** - WhatsApp integration with API

### SEO Features
- **Dynamic sitemap** with all 7 locales and hreflang
- **Structured data** (JSON-LD): Organization, Product, FAQ, Service schemas
- **OpenGraph/Twitter** images per locale
- **Google Ads** tracking with conversion events
- **Meta tags** optimized for each language

### Seasonal Features
- **🎄 Christmas Decorations** - Pine branch corners with ornaments
- **❄️ Snowflakes Animation** - Falling snow effect

---

## 📊 SEO Implementation

### Structured Data (JSON-LD)
Located in `src/lib/metadata.ts`:

| Schema | Purpose |
|--------|---------|
| **Organization** | Company info with social profiles |
| **InsuranceAgency** | Specific business type |
| **Product** (x4) | Each insurance plan with pricing in GEL |
| **Service** | Insurance service description |
| **FAQPage** | FAQ rich snippets (incl. referral FAQs) |
| **OfferCatalog** | Referral program offers |

### Sitemap & Robots
- **sitemap.ts** - All pages × 7 locales with `hreflang` alternates
- **robots.ts** - Crawl rules with sitemap reference

### Google Ads Integration
- **Tag ID:** AW-17722179248
- **Conversion ID:** KRKnCOCOwcIbELD9y4JC
- Conversion tracking on contact form submission

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone git@github.com:furiadaring/visitgeorgia.git
cd visitgeorgia

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run typecheck` | TypeScript type check |

### Code Quality
Pre-commit hooks via Husky + lint-staged:
- ESLint checking
- Prettier formatting
- TypeScript validation

---

## 🚀 Deployment

### Server Configuration

| Property | Value |
|----------|-------|
| **Domain** | visitgeorgia.online |
| **Server** | VPS (179.61.246.55) |
| **Proxy** | Nginx → localhost:3004 |
| **Process Manager** | PM2 |
| **SSL** | Let's Encrypt (Certbot) |

### Deploy Script

```bash
# SSH into server
ssh root@179.61.246.55

# Navigate to project
cd /var/www/visitgeorgia

# Run deploy script
./visitgeorgia-deploy.sh
```

Or manually:

```bash
git pull origin master
npm install
npm run build
pm2 restart visitgeorgia
```

### Nginx Configuration
Located at `nginx-visitgeorgia.conf`

---

## 📱 Responsive Breakpoints

| Breakpoint | Range | Tailwind Prefix |
|------------|-------|-----------------|
| Mobile | < 640px | (default) |
| SM | 640px+ | `sm:` |
| MD | 768px+ | `md:` |
| LG | 1024px+ | `lg:` |
| XL | 1280px+ | `xl:` |
| 2XL | 1536px+ | `2xl:` |

---

## 📞 Contact Information

| Channel | Value |
|---------|-------|
| **Phone/WhatsApp** | +995 591 19 63 00 |
| **Email** | info@visitgeorgia.online |
| **Telegram** | [@georgialegalresidency](https://t.me/georgialegalresidency) |

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Production site URL |
| `TELEGRAM_BOT_TOKEN` | Telegram bot for notifications |
| `TELEGRAM_CHAT_ID` | Telegram chat for notifications |

---

## 📊 Lighthouse Scores

Configuration in `lighthouserc.json`:

| Category | Target |
|----------|--------|
| Performance | 80%+ |
| Accessibility | 90%+ |
| Best Practices | 90%+ |
| SEO | 90%+ |

---

## 📝 Recent Updates

### December 2025
- ✅ Migrated to Tailwind CSS v4 class syntax
- ✅ Added Google Ads conversion tracking
- ✅ Added multi-language OpenGraph metadata
- ✅ Enhanced SEO schemas with GEL pricing
- ✅ Added Christmas decorations (pine branches, snowflakes)
- ✅ Added referral program with full i18n
- ✅ Cleaned up unused files
- ✅ Added ads.txt and security.txt
- ✅ Fixed alt text accessibility issues

### Previous
- ✅ 7-language i18n implementation
- ✅ RTL support for Hebrew/Arabic
- ✅ 6 insurance plans with detailed modals
- ✅ Customer testimonials section
- ✅ Mobile-responsive header redesign
- ✅ SVG flag icons for language switcher

---

## 📄 License

© 2024-2025 Visit Georgia Insurance. All rights reserved.

---

## 🏢 Company

**Visit Georgia Insurance**  
Insurance services for tourists and expats in Georgia  
[visitgeorgia.online](https://visitgeorgia.online)
