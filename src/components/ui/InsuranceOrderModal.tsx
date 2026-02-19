"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Georgian cities
const GEORGIAN_CITIES = [
  "Tbilisi", "Batumi", "Kutaisi", "Rustavi", "Gori", "Zugdidi", "Poti",
  "Kobuleti", "Khashuri", "Samtredia", "Senaki", "Zestafoni", "Marneuli",
  "Telavi", "Ozurgeti", "Borjomi", "Mtskheta", "Sighnaghi", "Mestia",
];

// Transliteration map for Cyrillic and other scripts to Latin
const translitMap: Record<string, string> = {
  // Russian/Ukrainian Cyrillic
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts',
  'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu',
  'я': 'ya', 'і': 'i', 'ї': 'yi', 'є': 'ye', 'ґ': 'g',
  // Georgian
  'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't',
  'ი': 'i', 'კ': 'k', 'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh',
  'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u', 'ფ': 'p', 'ქ': 'k', 'ღ': 'gh', 'ყ': 'q',
  'შ': 'sh', 'ჩ': 'ch', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh',
  'ჯ': 'j', 'ჰ': 'h',
  // Hebrew
  'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z', 'ח': 'ch',
  'ט': 't', 'י': 'y', 'כ': 'k', 'ל': 'l', 'מ': 'm', 'נ': 'n', 'ס': 's', 'ע': 'a',
  'פ': 'p', 'צ': 'ts', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't',
  // Turkish special chars
  'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
};

function transliterate(text: string): string {
  return text.split('').map(char => {
    const lower = char.toLowerCase();
    if (translitMap[lower]) {
      const result = translitMap[lower];
      return char === lower ? result : result.toUpperCase();
    }
    // Only allow A-Z, a-z, space, hyphen
    if (/^[A-Za-z\s\-]$/.test(char)) return char;
    return '';
  }).join('').toUpperCase();
}

// All countries with ISO codes
const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MK", name: "North Macedonia" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

interface InsuranceOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: number;
  planName?: string;
  planPrice?: number;
  planPeriod?: string;
  initialPromocode?: string;
  locale: string;
  dict: {
    insuranceOrder?: {
      title?: string;
      policyDetails?: string;
      customerDetails?: string;
      coverageType?: string;
      policyType?: string;
      periodStart?: string;
      periodEnd?: string;
      policyPrice?: string;
      citizenship?: string;
      firstNameEng?: string;
      lastNameEng?: string;
      birthDate?: string;
      passportNumber?: string;
      cityInGeorgia?: string;
      mobileNumber?: string;
      email?: string;
      submit?: string;
      submitting?: string;
      success?: string;
      error?: string;
      required?: string;
      selectOption?: string;
      passportPhoto?: string;
      uploadPassport?: string;
      scanning?: string;
      removePhoto?: string;
      scanSuccess?: string;
      scanFailed?: string;
      periods?: {
        daily?: string;
        months3?: string;
        months6?: string;
        year?: string;
        month?: string;
      };
    };
  };
}

function calculateEndDate(startDate: string, period: string): string {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = new Date(start);
  
  switch (period) {
    case "months3": end.setMonth(end.getMonth() + 3); break;
    case "months6": end.setMonth(end.getMonth() + 6); break;
    case "year": end.setFullYear(end.getFullYear() + 1); break;
    case "month": end.setMonth(end.getMonth() + 1); break;
    default: return "";
  }
  end.setDate(end.getDate() - 1);
  // Format in local timezone
  const year = end.getFullYear();
  const month = String(end.getMonth() + 1).padStart(2, '0');
  const day = String(end.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getPeriodText(period: string, t: Record<string, unknown>): string {
  const periods = t.periods as Record<string, string> | undefined;
  switch (period) {
    case "day": return periods?.daily || "Daily";
    case "months3": return periods?.months3 || "3 Months";
    case "months6": return periods?.months6 || "6 Months";
    case "year": return periods?.year || "1 Year";
    case "month": return periods?.month || "1 Month";
    default: return period;
  }
}

function calculateDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

// Format date to YYYY-MM-DD in local timezone (not UTC)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function InsuranceOrderModal({
  isOpen,
  onClose,
  planId,
  planName = "",
  planPrice = 0,
  planPeriod = "day",
  initialPromocode,
  locale,
  dict,
}: InsuranceOrderModalProps) {
  const t = dict.insuranceOrder || {};
  const isDaily = planPeriod === "day";
  const isMonthly = planPeriod === "month"; // UNO Active and UNO Active+ plans
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    periodStart: "",
    periodEnd: "",
    citizenship: "",
    firstNameEng: "",
    lastNameEng: "",
    birthDate: "",
    passportNumber: "",
    city: "",
    phone: "",
    email: "",
  });
  
  const [paymentOption, setPaymentOption] = useState<"quarterly" | "yearly">("quarterly");

  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportPreview, setPassportPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState<string | null>(null);

  // Multi-step flow: form → payment → confirmation
  const [currentStep, setCurrentStep] = useState<"form" | "payment" | "confirmation">("form");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"bank" | "korona" | "card" | "crypto" | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Phone validation function
  const isPhoneValid = useCallback((phone: string) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10 && cleaned.length <= 15;
  }, []);

  // Email validation function
  const isEmailValid = useCallback((email: string) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  // Check if all required fields are filled
  const isFormValid = useMemo(() => {
    const { periodStart, periodEnd, citizenship, firstNameEng, lastNameEng, birthDate, passportNumber, city, phone, email } = formData;
    return (
      periodStart.trim() !== "" &&
      periodEnd.trim() !== "" &&
      citizenship.trim() !== "" &&
      firstNameEng.trim() !== "" &&
      lastNameEng.trim() !== "" &&
      birthDate.trim() !== "" &&
      passportNumber.trim() !== "" &&
      city.trim() !== "" &&
      isPhoneValid(phone) &&
      isEmailValid(email)
    );
  }, [formData, isPhoneValid, isEmailValid]);

  // Legacy validateEmail for backward compatibility
  const validateEmail = (email: string): boolean => {
    return isEmailValid(email);
  };

  // Compress image for mobile
  const compressImage = useCallback(async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = document.createElement("img");
      
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = (height / width) * maxDim;
            width = maxDim;
          } else {
            width = (width / height) * maxDim;
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.8);
      };
      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Auto-scan passport
  const scanPassport = useCallback(async (file: File) => {
    setIsScanning(true);
    setScanMessage(null);
    
    try {
      const compressed = await compressImage(file);
      const formDataToSend = new FormData();
      formDataToSend.append("passport", compressed, "passport.jpg");
      
      const response = await fetch("/api/passport-scan", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!response.ok) throw new Error("Network error");
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const { firstName, lastName, birthDate, passportNumber, citizenship } = result.data;
        setFormData(prev => ({
          ...prev,
          firstNameEng: firstName || prev.firstNameEng,
          lastNameEng: lastName || prev.lastNameEng,
          birthDate: birthDate || prev.birthDate,
          passportNumber: passportNumber || prev.passportNumber,
          citizenship: citizenship || prev.citizenship,
        }));
        
        if (firstName || lastName || passportNumber) {
          setScanMessage(t.scanSuccess || "✓ Data extracted");
        } else {
          setScanMessage(t.scanFailed || "Fill manually");
        }
      } else {
        setScanMessage(t.scanFailed || "Fill manually");
      }
    } catch {
      setScanMessage(t.scanFailed || "Fill manually");
    } finally {
      setIsScanning(false);
    }
  }, [compressImage, t.scanSuccess, t.scanFailed]);

  // Handle file select with auto-scan
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPassportFile(file);
      setScanMessage(null);
      
      const reader = new FileReader();
      reader.onloadend = () => setPassportPreview(reader.result as string);
      reader.readAsDataURL(file);
      
      // Auto-scan
      scanPassport(file);
    }
  }, [scanPassport]);

  const handleRemovePhoto = useCallback(() => {
    setPassportFile(null);
    setPassportPreview(null);
    setScanMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  useEffect(() => {
    if (!isDaily && formData.periodStart) {
      const endDate = calculateEndDate(formData.periodStart, planPeriod);
      setFormData(prev => ({ ...prev, periodEnd: endDate }));
    }
  }, [formData.periodStart, planPeriod, isDaily]);

  useEffect(() => {
    if (isOpen) {
      setSubmitStatus("idle");
      setPassportFile(null);
      setPassportPreview(null);
      setScanMessage(null);
      setEmailError(null);
      setCurrentStep("form");
      setSelectedPaymentMethod(null);
      setOrderId(null);
      setFormData({
        periodStart: "", periodEnd: "", citizenship: "", firstNameEng: "",
        lastNameEng: "", birthDate: "", passportNumber: "", city: "",
        phone: "", email: "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-transliterate name fields to English uppercase
    if (name === "firstNameEng" || name === "lastNameEng") {
      const transliterated = transliterate(value);
      setFormData(prev => ({ ...prev, [name]: transliterated }));
      return;
    }
    
    // Email validation
    if (name === "email") {
      if (value && !validateEmail(value)) {
        setEmailError("Invalid email format");
      } else {
        setEmailError(null);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submitting
    if (!validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const submitData = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        // Send phone as mobileNumber for backend compatibility
        if (key === "phone") {
          submitData.append("mobileNumber", "+" + value);
        } else {
          submitData.append(key, value);
        }
      });
      // Pass planId for database tracking
      if (planId) {
        submitData.append("planId", planId.toString());
      }
      submitData.append("planName", planName);
      submitData.append("planPrice", calculatedPrice.toString());
      submitData.append("planPricePerDay", isDaily ? planPrice.toString() : "");
      submitData.append("numberOfDays", isDaily ? numberOfDays.toString() : "");
      submitData.append("planPeriod", getPeriodText(planPeriod, t));
      if (isMonthly) {
        submitData.append("paymentOption", paymentOption);
        submitData.append("paymentMonths", paymentOption === "quarterly" ? "3" : "12");
      }
      submitData.append("locale", locale);
      if (passportFile) submitData.append("passportPhoto", passportFile);
      
      // Add source domain for tracking which website the order came from
      if (typeof window !== 'undefined') {
        submitData.append("sourceDomain", window.location.hostname);
      }

      // Add tracking attribution data from VGLeads / Keitaro
      try {
        const attr = (window as any).VGLeads?.getAttribution?.() || {};
        const subidInput = document.getElementById("kt_subid") as HTMLInputElement;
        const subid = subidInput?.value || attr.subid || "";
        if (subid) submitData.append("subid", subid);
        if (attr.click_id) submitData.append("clickId", attr.click_id);
        if (attr.ad_source) submitData.append("adSource", attr.ad_source);
        if (attr.keyword) submitData.append("keyword", attr.keyword);
        if (attr.utm_source) submitData.append("utmSource", attr.utm_source);
        if (attr.utm_medium) submitData.append("utmMedium", attr.utm_medium);
        if (attr.utm_campaign) submitData.append("utmCampaign", attr.utm_campaign);
        if (attr.utm_term) submitData.append("utmTerm", attr.utm_term);
        if (attr.utm_content) submitData.append("utmContent", attr.utm_content);
      } catch(e) {
        console.error("Attribution capture error:", e);
      }

      const response = await fetch("/api/insurance-order", { method: "POST", body: submitData });
      if (response.ok) {
        const data = await response.json();
        setOrderId(data.orderId || null);

        // Track Meta Pixel Lead conversion
        if (typeof window !== 'undefined' && typeof (window as unknown as { fbq?: (action: string, event: string, params?: object) => void }).fbq === 'function') {
          try {
            (window as unknown as { fbq: (action: string, event: string, params?: object) => void }).fbq('track', 'Lead', { source: 'form' });
          } catch (e) {
            console.error('Meta Pixel fbq error:', e);
          }
        }

        // Track Keitaro conversion
        if (typeof window !== 'undefined') {
          try {
            const KTracking = (window as unknown as { KTracking?: { reportConversion?: (params: { status: string }) => void } }).KTracking;
            if (KTracking?.reportConversion) {
              KTracking.reportConversion({ status: 'lead' });
              console.log('Keitaro lead conversion sent');
            }
          } catch (e) {
            console.error('Keitaro tracking error:', e);
          }
        }

        // Go to payment selection step
        setCurrentStep("payment");
      } else {
        const responseText = await response.text();
        console.error("Order submission failed:", response.status, responseText);
        setSubmitStatus("error");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = async (method: "bank" | "korona" | "card" | "crypto") => {
    // Update payment method in database
    if (orderId) {
      try {
        await fetch(`/api/orders/${orderId}/payment-method`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentMethod: method }),
        });
      } catch (err) {
        console.error("Failed to update payment method:", err);
      }
    }

    // For card payment, redirect to BOG payment at visitgeorgia.online
    if (method === "card" && orderId) {
      const returnUrl = `${window.location.origin}/${locale}/payment/success`;
      window.location.href = `https://visitgeorgia.online/${locale}/payment?order=${orderId}&return=${encodeURIComponent(returnUrl)}`;
      return;
    }

    setSelectedPaymentMethod(method);
    setCurrentStep("confirmation");
  };

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  // Today as Date object for minDate on DatePickers
  const todayDate = useMemo(() => new Date(), []);
  
  // Minimum end date: for visitor insurance (isDaily), must be at least 5 days from start
  const minEndDate = useMemo(() => {
    if (formData.periodStart) {
      const startDate = new Date(formData.periodStart);
      if (isDaily) {
        // 5-day minimum for visitor insurance: end date must be at least 4 days after start (5 days inclusive)
        const minEnd = new Date(startDate);
        minEnd.setDate(minEnd.getDate() + 4);
        return minEnd;
      }
      return startDate;
    }
    return new Date();
  }, [formData.periodStart, isDaily]);
  
  const calculatedPrice = useMemo(() => {
    if (isDaily && formData.periodStart && formData.periodEnd) {
      return calculateDays(formData.periodStart, formData.periodEnd) * planPrice;
    }
    if (isMonthly) {
      // UNO Active/Plus: quarterly = 3 months, yearly = 12 months
      return paymentOption === "quarterly" ? planPrice * 3 : planPrice * 12;
    }
    return planPrice;
  }, [isDaily, isMonthly, formData.periodStart, formData.periodEnd, planPrice, paymentOption]);

  const numberOfDays = useMemo(() => {
    if (isDaily && formData.periodStart && formData.periodEnd) {
      return calculateDays(formData.periodStart, formData.periodEnd);
    }
    return 0;
  }, [isDaily, formData.periodStart, formData.periodEnd]);

  if (!isOpen) return null;

  const inputClass = "w-full px-4 py-3 text-base border border-[#E5E5E5] rounded-none focus:ring-1 focus:ring-[#DE643B]/20 focus:border-[#DE643B] transition-all bg-white hover:border-[#ABA2A5] outline-none placeholder:text-[#ABA2A5]";
  const labelClass = "block text-sm font-medium text-[#2D1D38] mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center lg:p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      
      <div className="relative bg-[#F4F3EE] w-full lg:max-w-[680px] rounded-t-2xl lg:rounded-none max-h-[95vh] lg:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#F4F3EE] px-5 lg:px-8 pt-6 pb-4 flex items-start justify-between z-10 border-b border-[#E5E5E5]">
          <div>
            <h2 className="text-[#DE643B] font-bold text-xl lg:text-2xl">{t.title || "Оформление страховки"}</h2>
            <p className="text-[#2D1D38] text-sm mt-1 font-medium uppercase">{planName} / {getPeriodText(planPeriod, t)}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity mt-1">
            <svg className="w-6 h-6 text-[#2D1D38]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Step */}
        {currentStep === "form" && (
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-140px)] px-5 lg:px-8 py-5 bg-[#F4F3EE]">
          {/* Hidden subid field for tracking */}
          <input type="hidden" name="subid" id="kt_subid" value="" />
          
          {/* Passport Upload */}
          <div className="bg-[#FAFAFA] border border-[#E5E5E5] p-4" style={{ marginBottom: 20 }}>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="passport-upload" />
            
            {!passportPreview ? (
              <label htmlFor="passport-upload" className="flex items-center gap-4 cursor-pointer group">
                <div className="w-12 h-12 bg-[#F4EFF3] flex items-center justify-center group-hover:bg-[#E6CFE3] transition-all">
                  <svg className="w-6 h-6 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2D1D38]">{t.uploadPassport || "Нажмите, чтобы загрузить фото паспорта"}</p>
                  <p className="text-xs text-[#ABA2A5]">Auto-fills your details</p>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-12 overflow-hidden bg-gray-200 shrink-0">
                  <Image src={passportPreview} alt="Passport" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {isScanning ? (
                    <div className="flex items-center gap-2 text-[#DE643B]">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span className="text-xs">{t.scanning || "Scanning..."}</span>
                    </div>
                  ) : scanMessage ? (
                    <p className={`text-xs ${scanMessage.includes("✓") ? "text-green-600" : "text-amber-600"}`}>
                      {scanMessage}
                    </p>
                  ) : null}
                </div>
                <button type="button" onClick={handleRemovePhoto} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                  <svg className="w-4 h-4 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Period Section */}
          <div className="bg-white border border-[#E5E5E5] p-5" style={{ marginBottom: 20 }}>
            <h3 className="text-base font-bold text-[#2D1D38] mb-4">
              1. {t.policyDetails || "Детали полиса"}
            </h3>
            
            {isMonthly ? (
              /* UNO Active / UNO Active+ - Start Date + Payment Options */
              <div className="space-y-4">
                {/* Start Date */}
                <div>
                  <label className={labelClass}>{t.periodStart || "Начало периода"} <span className="text-[#DE643B]">*</span></label>
                  <DatePicker
                    selected={formData.periodStart ? new Date(formData.periodStart) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodStart: date ? formatLocalDate(date) : '' }))}
                    minDate={todayDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="дд/мм/гггг"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={inputClass}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-none !shadow-xl !border !border-[#E5E5E5]"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
                {/* Payment options */}
                <div>
                  <label className={labelClass}>{(t as Record<string, string>).paymentOption || "Payment Option"} <span className="text-[#DE643B]">*</span></label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("quarterly")}
                      className={`px-4 py-3 border transition-all text-center ${
                        paymentOption === "quarterly" 
                          ? "border-[#DE643B] bg-[#DE643B]/5" 
                          : "border-[#E5E5E5] hover:border-[#ABA2A5]"
                      }`}
                    >
                      <div className="text-xs font-medium text-[#ABA2A5]">{(t as Record<string, string>).paymentQuarterly || "Every 3 mo."}</div>
                      <div className="text-lg font-bold text-[#DE643B]">{planPrice * 3} GEL</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("yearly")}
                      className={`px-4 py-3 border transition-all text-center ${
                        paymentOption === "yearly" 
                          ? "border-[#DE643B] bg-[#DE643B]/5" 
                          : "border-[#E5E5E5] hover:border-[#ABA2A5]"
                      }`}
                    >
                      <div className="text-xs font-medium text-[#ABA2A5]">{(t as Record<string, string>).paymentYearly || "Yearly"}</div>
                      <div className="text-lg font-bold text-[#DE643B]">{planPrice * 12} GEL</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Other plans - Start/End Date */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t.periodStart || "Начало периода"} <span className="text-[#DE643B]">*</span></label>
                  <DatePicker
                    selected={formData.periodStart ? new Date(formData.periodStart) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodStart: date ? formatLocalDate(date) : '' }))}
                    minDate={todayDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="дд/мм/гггг"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={inputClass}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-none !shadow-xl !border !border-[#E5E5E5]"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>{t.periodEnd || "Конец периода"} <span className="text-[#DE643B]">*</span></label>
                  <DatePicker
                    selected={formData.periodEnd ? new Date(formData.periodEnd) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodEnd: date ? formatLocalDate(date) : '' }))}
                    minDate={minEndDate}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="дд/мм/гггг"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={`${inputClass} ${!isDaily ? "!bg-gray-100 !cursor-not-allowed" : ""}`}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-none !shadow-xl !border !border-[#E5E5E5]"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    disabled={!isDaily}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customer Details */}
          <div className="bg-white border border-[#E5E5E5] p-5" style={{ marginBottom: 20 }}>
            <h3 className="text-base font-bold text-[#2D1D38] mb-4">
              2. {t.customerDetails || "Данные клиента"}
            </h3>
          <div className="space-y-4">
            {/* Row 1: First Name, Last Name, Birth Date - Desktop: 3 cols, Mobile: 1 col */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>{t.firstNameEng || "Имя (ENG)"} <span className="text-[#DE643B]">*</span></label>
                <input type="text" name="firstNameEng" value={formData.firstNameEng} onChange={handleChange} required placeholder="Anna" className={`${inputClass} uppercase`} />
              </div>
              <div>
                <label className={labelClass}>{t.lastNameEng || "Фамилия (ENG)"} <span className="text-[#DE643B]">*</span></label>
                <input type="text" name="lastNameEng" value={formData.lastNameEng} onChange={handleChange} required placeholder="Gora" className={`${inputClass} uppercase`} />
              </div>
              <div>
                <label className={labelClass}>{t.birthDate || "Дата рождения"} <span className="text-[#DE643B]">*</span></label>
                <DatePicker
                  selected={formData.birthDate ? new Date(formData.birthDate) : null}
                  onChange={(date: Date | null) => setFormData(prev => ({ ...prev, birthDate: date ? formatLocalDate(date) : '' }))}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="дд/мм/гггг"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  className={inputClass}
                  wrapperClassName="w-full"
                  calendarClassName="!rounded-none !shadow-xl !border !border-[#E5E5E5]"
                  popperPlacement="top-start"
                  required
                />
              </div>
            </div>

            {/* Row 2: Passport #, Citizenship, City - Desktop: 3 cols, Mobile: 1 col */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>{t.passportNumber || "Номер паспорта"} <span className="text-[#DE643B]">*</span></label>
                <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required placeholder="AV125632" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>{t.citizenship || "Гражданство"} <span className="text-[#DE643B]">*</span></label>
                <Select
                  value={COUNTRIES.filter(c => c.code === formData.citizenship).map(c => ({ value: c.code, label: c.name }))[0] || null}
                  onChange={(option) => setFormData(prev => ({ ...prev, citizenship: option?.value || "" }))}
                  options={COUNTRIES.map(c => ({ value: c.code, label: c.name }))}
                  placeholder={t.selectOption || "Выберите..."}
                  isClearable
                  isSearchable
                  menuPlacement="top"
                  classNames={{
                    control: () => "!min-h-[46px] !border !border-[#E5E5E5] !rounded-none hover:!border-[#ABA2A5] !shadow-none",
                    menu: () => "!rounded-none !shadow-xl !border !border-[#E5E5E5] !z-50",
                    option: ({ isFocused, isSelected }) => 
                      `!py-2.5 !px-3 ${isSelected ? "!bg-[#DE643B] !text-white" : isFocused ? "!bg-[#F4EFF3]" : ""}`,
                    placeholder: () => "!text-[#ABA2A5]",
                    input: () => "!text-base",
                    singleValue: () => "!text-base",
                  }}
                  styles={{
                    control: (base) => ({ ...base, fontSize: "16px" }),
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>{t.cityInGeorgia || "Город в Грузии (местоположение)"} <span className="text-[#DE643B]">*</span></label>
                <Select
                  value={formData.city ? { value: formData.city, label: formData.city } : null}
                  onChange={(option) => setFormData(prev => ({ ...prev, city: option?.value || "" }))}
                  options={GEORGIAN_CITIES.map(city => ({ value: city, label: city }))}
                  placeholder={t.selectOption || "Выберите..."}
                  isClearable
                  isSearchable
                  menuPlacement="top"
                  classNames={{
                    control: () => "!min-h-[46px] !border !border-[#E5E5E5] !rounded-none hover:!border-[#ABA2A5] !shadow-none",
                    menu: () => "!rounded-none !shadow-xl !border !border-[#E5E5E5] !z-50",
                    option: ({ isFocused, isSelected }) => 
                      `!py-2.5 !px-3 ${isSelected ? "!bg-[#DE643B] !text-white" : isFocused ? "!bg-[#F4EFF3]" : ""}`,
                    placeholder: () => "!text-[#ABA2A5]",
                    input: () => "!text-base",
                    singleValue: () => "!text-base",
                  }}
                  styles={{
                    control: (base) => ({ ...base, fontSize: "16px" }),
                  }}
                />
              </div>
            </div>

            {/* Row 3: Phone with country code, Email - Desktop: 2 cols, Mobile: 1 col */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t.mobileNumber || "Мобильный номер"} <span className="text-[#DE643B]">*</span></label>
                <PhoneInput
                  country="ge"
                  value={formData.phone}
                  onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                  inputClass="!w-full !h-[46px] !text-base !border !border-[#E5E5E5] !rounded-none !pl-14 focus:!ring-1 focus:!ring-[#DE643B]/20 focus:!border-[#DE643B]"
                  buttonClass="!border !border-[#E5E5E5] !rounded-none !bg-white hover:!bg-[#F4EFF3] !h-[46px] !w-12"
                  containerClass="!w-full"
                  dropdownClass="!rounded-none !shadow-xl !border !border-[#E5E5E5] !bottom-full !top-auto !mb-1"
                  searchClass="!rounded-none !border-[#E5E5E5] !mx-2 !my-2"
                  enableSearch
                  searchPlaceholder="Search..."
                  preferredCountries={["ge", "ru", "ua", "tr", "il", "us", "de"]}
                  inputProps={{ required: true, placeholder: "+995 Телефон" }}
                />
              </div>
              <div>
                <label className={labelClass}>{t.email || "Электронная почта"} <span className="text-[#DE643B]">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="email@example.com" 
                  className={`${inputClass} ${emailError ? "!border-[#DE643B]" : ""}`} 
                />
                {emailError && <p className="text-[#DE643B] text-sm mt-1">{emailError}</p>}
              </div>
            </div>
          </div>
          </div>

          {/* Price Section */}
          <div className="bg-white border border-[#E5E5E5] p-5" style={{ marginBottom: 20 }}>
            <h3 className="text-base font-bold text-[#2D1D38] mb-3">
              3. {t.policyPrice || "Цена полиса"}
            </h3>
            <div className="border border-[#E5E5E5] py-4">
              <div className="text-center">
                <span className="font-bold text-2xl text-[#DE643B]">
                  {calculatedPrice} GEL
                </span>
                {isDaily && numberOfDays > 0 && <span className="text-sm font-normal text-[#ABA2A5] ml-2">({numberOfDays} дней)</span>}
                {isMonthly && <span className="text-sm font-normal text-[#ABA2A5] ml-2">({paymentOption === "quarterly" ? "3" : "12"} мес.)</span>}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-green-50 text-green-700 text-base px-5 py-4 flex items-center gap-3 border border-green-200" style={{ marginBottom: 20 }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.success || "Заявка отправлена!"}
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="bg-red-50 text-red-700 text-base px-5 py-4 border border-red-200" style={{ marginBottom: 20 }}>
              {t.error || "Ошибка. Попробуйте снова."}
            </div>
          )}

          {/* Submit Button + Privacy Text */}
          <div className="flex flex-col lg:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-5 pl-8 pr-1.5 py-1.5 bg-[#DE643B] rounded-full hover:bg-[#c55530] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span className="text-white font-medium text-base">{t.submitting || "Отправка..."}</span>
                </>
              ) : (
                <>
                  <span className="text-white font-medium text-base">{t.submit || "Отправить заявку"}</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </>
              )}
            </button>
            <p className="text-xs text-[#ABA2A5] text-center lg:text-left">
              Нажимая кнопку, вы соглашаетесь с<br className="lg:hidden" /> политикой конфиденциальности
            </p>
          </div>
        </form>
        )}

        {/* Payment Selection Step */}
        {currentStep === "payment" && (
          <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-5 lg:px-8 py-5 bg-[#F4F3EE]">
            <div className="text-center" style={{ marginBottom: 20 }}>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2D1D38] mb-2">{(t as Record<string, string>).orderReceived || "Order Received!"}</h3>
              <p className="text-[#ABA2A5]">{(t as Record<string, string>).selectPaymentMethod || "Please select your payment method"}</p>
            </div>

            {/* Price Summary */}
            <div className="bg-white border border-[#E5E5E5] px-5 py-4 flex items-center justify-between" style={{ marginBottom: 20 }}>
              <span className="text-base font-medium text-[#2D1D38]">{t.policyPrice || "Цена полиса"}</span>
              <span className="font-bold text-2xl text-[#DE643B]">{calculatedPrice} GEL</span>
            </div>

            {/* Payment Options */}
            <div className="flex flex-col gap-4">
              {/* Card Payment - BOG */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect("card")}
                className="w-full bg-white p-5 border border-[#E5E5E5] cursor-pointer text-left transition-all hover:border-[#DE643B] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#DE643B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-base font-bold text-[#2D1D38] group-hover:text-[#DE643B] transition-colors">{(t as Record<string, string>).cardPayment || "Card Payment"}</p>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5">✓ {(t as Record<string, string>).recommended || "Recommended"}</span>
                    </div>
                    <p className="text-sm text-[#ABA2A5] mt-1">{(t as Record<string, string>).cardPaymentDesc || "Pay securely with Visa, Mastercard, or Georgian cards"}</p>
                    {/* Payment Method Logos */}
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <div className="bg-blue-50 border border-blue-200 px-2 py-0.5">
                        <span className="text-blue-700 font-bold text-xs">VISA</span>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 px-2 py-0.5 flex items-center gap-0.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full -ml-1.5"></div>
                      </div>
                      <div className="bg-green-50 border border-green-200 px-2 py-0.5">
                        <span className="text-green-700 text-xs font-medium">BOG</span>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 px-2 py-0.5">
                        <span className="text-purple-700 text-xs font-medium">TBC</span>
                      </div>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-[#ABA2A5] group-hover:text-[#DE643B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect("bank")}
                className="w-full bg-white p-5 border border-[#E5E5E5] cursor-pointer text-left transition-all hover:border-[#DE643B] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F4F3EE] flex items-center justify-center group-hover:bg-[#DE643B]/10 transition-colors">
                    <svg className="w-7 h-7 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#2D1D38]">{(t as Record<string, string>).bankTransfer || "Bank Transfer"}</p>
                    <p className="text-sm text-[#ABA2A5] mt-1">{(t as Record<string, string>).bankTransferDesc || "For those with a Georgian bank account"}</p>
                  </div>
                  <svg className="w-5 h-5 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Korona Pay */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect("korona")}
                className="w-full bg-white p-5 border border-[#E5E5E5] cursor-pointer text-left transition-all hover:border-[#DE643B] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F4F3EE] flex items-center justify-center group-hover:bg-[#DE643B]/10 transition-colors">
                    <svg className="w-7 h-7 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#2D1D38]">{(t as Record<string, string>).koronaPay || "Korona Pay"}</p>
                    <p className="text-sm text-[#ABA2A5] mt-1">{(t as Record<string, string>).koronaPayDesc || "Transfer from Russia"}</p>
                  </div>
                  <svg className="w-5 h-5 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              {/* Crypto Payment (USDT TRC-20) */}
              <button
                type="button"
                onClick={() => handlePaymentMethodSelect("crypto")}
                className="w-full bg-white p-5 border border-[#E5E5E5] cursor-pointer text-left transition-all hover:border-[#DE643B] group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#F4F3EE] flex items-center justify-center group-hover:bg-[#DE643B]/10 transition-colors">
                    <span className="text-2xl text-[#DE643B]">₿</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-[#2D1D38]">{(t as Record<string, string>).cryptoPayment || "Crypto (USDT TRC-20)"}</p>
                    <p className="text-sm text-[#ABA2A5] mt-1">{(t as Record<string, string>).cryptoPaymentDesc || "Pay with USDT on Tron network"}</p>
                  </div>
                  <svg className="w-5 h-5 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === "confirmation" && (
          <div className="overflow-y-auto max-h-[calc(95vh-140px)] px-6 py-5 bg-[#F4F3EE]">
            {/* Bank Transfer Confirmation */}
            {selectedPaymentMethod === "bank" && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#DE643B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D1D38] mb-2">{(t as Record<string, string>).bankTransferTitle || "Bank Transfer Details"}</h3>
                  <p className="text-[#ABA2A5]">{(t as Record<string, string>).bankTransferInstructions || "Please transfer the amount to the following account"}</p>
                </div>

                {/* Price */}
                <div className="bg-[#DE643B] px-5 py-4 flex items-center justify-between">
                  <span className="text-base font-medium text-white/90">{(t as Record<string, string>).amountToPay || "Amount to Pay"}</span>
                  <span className="font-bold text-2xl text-white">{calculatedPrice} GEL</span>
                </div>

                {/* Bank Details Card */}
                <div className="bg-white p-5 border border-[#E5E5E5]">
                  <div className="mb-4">
                    <p className="text-sm text-[#ABA2A5] mb-1">{(t as Record<string, string>).bankName || "Bank"}</p>
                    <p className="font-semibold text-[#2D1D38]">Bank of Georgia</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-[#ABA2A5] mb-1">{(t as Record<string, string>).beneficiary || "Beneficiary"}</p>
                    <p className="font-semibold text-[#2D1D38]">Legal Residency Group</p>
                  </div>
                  <div className={orderId ? "mb-4" : ""}>
                    <p className="text-sm text-[#ABA2A5] mb-1">{(t as Record<string, string>).iban || "IBAN"}</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold text-[#2D1D38] text-sm">GE26BG0000000611265727</p>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText("GE26BG0000000611265727")}
                        className="p-1.5 hover:bg-[#F4F3EE] transition-colors"
                        title="Copy"
                      >
                        <svg className="w-4 h-4 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {orderId && (
                    <div>
                      <p className="text-sm text-[#ABA2A5] mb-1">{(t as Record<string, string>).reference || "Reference"}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#2D1D38]">Order #{orderId}</p>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(orderId)}
                          className="p-1.5 hover:bg-[#F4F3EE] transition-colors"
                          title="Copy"
                        >
                          <svg className="w-4 h-4 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#DE643B]/10 border border-[#DE643B]/20 px-5 py-4">
                  <p className="text-[#DE643B] text-sm">
                    <strong>{(t as Record<string, string>).important || "Important"}:</strong> {(t as Record<string, string>).bankTransferNote || "Please include your order number in the transfer description. Your policy will be activated after we confirm the payment."}
                  </p>
                </div>

                {/* Other Bank Note */}
                <div className="bg-blue-50 border border-blue-200 px-5 py-4">
                  <p className="text-blue-800 text-sm flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{(t as Record<string, string>).otherBankNote || "If you are paying from a bank other than Bank of Georgia, please send us the payment confirmation via WhatsApp, Telegram, or email so we can process your order faster."}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 bg-[#DE643B] text-white font-bold text-lg rounded-full hover:bg-[#c55632] active:scale-[0.98] transition-all"
                >
                  {(t as Record<string, string>).done || "Done"}
                </button>
              </div>
            )}

            {/* Korona Pay Confirmation */}
            {selectedPaymentMethod === "korona" && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#DE643B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-[#DE643B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D1D38] mb-2">{(t as Record<string, string>).koronaPayTitle || "Korona Pay Transfer"}</h3>
                  <p className="text-[#ABA2A5]">{(t as Record<string, string>).koronaPayInstructions || "Our operator will contact you shortly"}</p>
                </div>

                {/* Price */}
                <div className="bg-[#DE643B] px-5 py-4 flex items-center justify-between">
                  <span className="text-base font-medium text-white/90">{(t as Record<string, string>).amountToPay || "Amount to Pay"}</span>
                  <span className="font-bold text-2xl text-white">{calculatedPrice} GEL</span>
                </div>

                <div className="bg-white p-5 border border-[#E5E5E5]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-[#2D1D38] mb-1">{(t as Record<string, string>).orderConfirmed || "Order Confirmed"}</p>
                      <p className="text-sm text-[#ABA2A5]">{(t as Record<string, string>).koronaPayContactNote || "Our operator will contact you via WhatsApp or Telegram to provide Korona Pay transfer details."}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 px-5 py-4">
                  <p className="text-blue-800 text-sm">
                    <strong>{(t as Record<string, string>).note || "Note"}:</strong> {(t as Record<string, string>).koronaPayNote || "Please make sure your WhatsApp or Telegram is available on the phone number you provided."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 bg-[#DE643B] text-white font-bold text-lg rounded-full hover:bg-[#c55632] active:scale-[0.98] transition-all"
                >
                  {(t as Record<string, string>).done || "Done"}
                </button>
              </div>
            )}

            {/* Crypto Payment Confirmation */}
            {selectedPaymentMethod === "crypto" && (
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#DE643B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-[#DE643B]">₿</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#2D1D38] mb-2">{(t as Record<string, string>).cryptoPaymentTitle || "Crypto Payment (USDT TRC-20)"}</h3>
                  <p className="text-[#ABA2A5]">{(t as Record<string, string>).cryptoPaymentInstructions || "Please transfer USDT to the following TRC-20 wallet address"}</p>
                </div>

                {/* Price */}
                <div className="bg-[#DE643B] px-5 py-4 flex items-center justify-between">
                  <span className="text-base font-medium text-white/90">{(t as Record<string, string>).amountToPay || "Amount to Pay"}</span>
                  <span className="font-bold text-2xl text-white">{calculatedPrice} GEL</span>
                </div>

                {/* Wallet Address */}
                <div className="bg-white p-5 border border-[#E5E5E5]">
                  <p className="text-sm text-[#ABA2A5] mb-2">{(t as Record<string, string>).walletAddress || "TRC-20 Wallet Address"}</p>
                  <div className="flex items-center gap-2 bg-[#F4F3EE] p-3">
                    <p className="font-mono text-sm text-[#2D1D38] break-all flex-1">TFWLbF4gUBqDGhsQdMeQHWAqLNJNuVJqGX</p>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText("TFWLbF4gUBqDGhsQdMeQHWAqLNJNuVJqGX")}
                      className="p-2 hover:bg-[#E5E5E5] transition-colors shrink-0"
                      title="Copy"
                    >
                      <svg className="w-5 h-5 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  {orderId && (
                    <div className="mt-4">
                      <p className="text-sm text-[#ABA2A5] mb-1">{(t as Record<string, string>).reference || "Reference"}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#2D1D38]">Order #{orderId}</p>
                        <button
                          type="button"
                          onClick={() => navigator.clipboard.writeText(orderId)}
                          className="p-1.5 hover:bg-[#F4F3EE] transition-colors"
                          title="Copy"
                        >
                          <svg className="w-4 h-4 text-[#ABA2A5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-[#DE643B]/10 border border-[#DE643B]/20 px-5 py-4">
                  <p className="text-[#DE643B] text-sm">
                    <strong>{(t as Record<string, string>).important || "Important"}:</strong> {(t as Record<string, string>).cryptoPaymentNote || "Send only USDT on the TRC-20 network. Sending other tokens or using wrong network will result in loss of funds. After payment, please send a screenshot of the transaction to our WhatsApp or Telegram."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 bg-[#DE643B] text-white font-bold text-lg rounded-full hover:bg-[#c55632] active:scale-[0.98] transition-all"
                >
                  {(t as Record<string, string>).done || "Done"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
