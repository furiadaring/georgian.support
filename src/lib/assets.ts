// Image assets - Replace with your actual image paths
// For production, place images in /public/images/ folder

export const IMAGES = {
  // Logo
  logo: "/images/logo.png",
  logoMask: "/images/logo-mask.png",
  
  // Hero
  heroDesktop: "/images/hero-desktop.png",
  heroMobile: "/images/hero-mobile.png",
  
  // About Us Detailed
  aboutImage1: "/images/about-1.png",
  aboutImage1Desktop: "/images/about-1-desktop.png",
  aboutImage2: "/images/about-2.png",
  aboutImage2Desktop: "/images/about-2-desktop.png",
  
  // Contact Form
  contactImage: "/images/contact.png",
  contactImageDesktop: "/images/contact-desktop.png",
  
  // Reviews - Avatars
  avatar1: "/images/avatars/avatar-1.png",
  avatar2: "/images/avatars/avatar-2.png",
  avatar3: "/images/avatars/avatar-3.png",
  avatar4: "/images/avatars/avatar-4.png",
} as const;

export const ICONS = {
  // Social
  telegram: "/icons/telegram.svg",
  telegramColor: "/icons/telegram-color.svg",
  whatsapp: "/icons/whatsapp.svg",
  whatsappColor: "/icons/whatsapp-color.svg",
  instagram: "/icons/instagram.svg",
  
  // UI
  phone: "/icons/phone.svg",
  email: "/icons/email.svg",
  map: "/icons/map.svg",
  check: "/icons/check.svg",
  star: "/icons/star.svg",
  arrowUp: "/icons/arrow-up.svg",
  chevronDown: "/icons/chevron-down.svg",
  menu: "/icons/menu.svg",
  close: "/icons/close.svg",
  
  // Advantages
  clock: "/icons/clock.svg",
  shield: "/icons/shield.svg",
  document: "/icons/document.svg",
  support: "/icons/support.svg",
} as const;

// Fallback to localhost URLs for development
export const DEV_IMAGES = {
  logo: "http://localhost:3845/assets/5afdee03f35efb41681088a701b117e1b62727fc.png",
  logoMask: "http://localhost:3845/assets/1d2272f0255fff13e6eef7d4f10cfdb9b42ae51a.png",
  heroDesktop: "http://localhost:3845/assets/82eb54dd2f6d35976adc45a53ea03d8703eccec1.png",
  heroMobile: "http://localhost:3845/assets/643f5beaabceead99a45da83cd07b1053b48b458.png",
} as const;
