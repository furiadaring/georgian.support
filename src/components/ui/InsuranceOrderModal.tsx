"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  planName?: string;
  planPrice?: number;
  planPeriod?: string;
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
  planName = "",
  planPrice = 0,
  planPeriod = "day",
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

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
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

      const response = await fetch("/api/insurance-order", { method: "POST", body: submitData });
      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(onClose, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  
  const tomorrow = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }, []);
  
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

  const inputClass = "w-full px-4 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white hover:border-gray-300 outline-none";
  const labelClass = "block text-sm font-semibold text-zinc-600 mb-2.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full sm:max-w-2xl lg:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-red-600 to-red-500 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white font-bold text-xl">{t.title || "Order Insurance"}</h2>
            <p className="text-red-100 text-sm mt-1">{planName} • {getPeriodText(planPeriod, t)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-140px)] px-6 py-5 bg-gray-50/50">
          {/* Passport Upload */}
          <div className="bg-white rounded-2xl p-5 border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors mb-6">
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" id="passport-upload" />
            
            {!passportPreview ? (
              <label htmlFor="passport-upload" className="flex items-center gap-4 cursor-pointer group">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 transition-all group-hover:scale-105">
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-800">{t.uploadPassport || "Upload Passport Photo"}</p>
                  <p className="text-sm text-gray-500">Auto-fills your details</p>
                </div>
              </label>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gray-200 shrink-0 shadow-sm">
                  <Image src={passportPreview} alt="Passport" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  {isScanning ? (
                    <div className="flex items-center gap-2 text-red-600">
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
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Period Section */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">1</span>
              {t.policyDetails || "Coverage Period"}
            </h3>
            
            {isMonthly ? (
              /* UNO Active / UNO Active+ - Start Date + Payment Options on one line */
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:items-end">
                {/* Start Date */}
                <div>
                  <label className={labelClass}>{t.periodStart || "Start Date"} <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={formData.periodStart ? new Date(formData.periodStart) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodStart: date ? formatLocalDate(date) : '' }))}
                    minDate={tomorrow}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={inputClass}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-xl !shadow-xl !border-2 !border-gray-200"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
                {/* Payment options with label */}
                <div>
                  <label className={labelClass}>{(t as Record<string, string>).paymentOption || "Payment Option"} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentOption("quarterly")}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all text-center whitespace-nowrap flex-1 ${
                        paymentOption === "quarterly" 
                          ? "border-red-500 bg-red-50 ring-2 ring-red-500/20" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600">{(t as Record<string, string>).paymentQuarterly || "Every 3 mo."}</div>
                      <div className="text-lg font-bold text-red-600">{planPrice * 3} GEL</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOption("yearly")}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all text-center whitespace-nowrap flex-1 ${
                        paymentOption === "yearly" 
                          ? "border-red-500 bg-red-50 ring-2 ring-red-500/20" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-xs font-medium text-gray-600">{(t as Record<string, string>).paymentYearly || "Yearly"}</div>
                      <div className="text-lg font-bold text-red-600">{planPrice * 12} GEL</div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Other plans - Start/End Date */
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>{t.periodStart || "Start Date"} <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={formData.periodStart ? new Date(formData.periodStart) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodStart: date ? formatLocalDate(date) : '' }))}
                    minDate={tomorrow}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={inputClass}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-xl !shadow-xl !border-2 !border-gray-200"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>{t.periodEnd || "End Date"} <span className="text-red-500">*</span></label>
                  <DatePicker
                    selected={formData.periodEnd ? new Date(formData.periodEnd) : null}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, periodEnd: date ? formatLocalDate(date) : '' }))}
                    minDate={formData.periodStart ? new Date(formData.periodStart) : new Date()}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD/MM/YYYY"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    className={`${inputClass} ${!isDaily ? "!bg-gray-100 !cursor-not-allowed" : ""}`}
                    wrapperClassName="w-full"
                    calendarClassName="!rounded-xl !shadow-xl !border-2 !border-gray-200"
                    popperClassName="!z-[100]"
                    popperPlacement="bottom-start"
                    disabled={!isDaily}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Price Display */}
          <div className="bg-linear-to-r from-red-600 to-red-500 rounded-2xl px-5 py-4 flex items-center justify-between mb-5 shadow-lg shadow-red-500/20">
            <span className="text-base font-medium text-white/90">{t.policyPrice || "Total Price"}</span>
            <span className="font-bold text-2xl text-white">
              {calculatedPrice} GEL
              {isDaily && numberOfDays > 0 && <span className="text-sm font-normal text-white/80 ml-1">({numberOfDays} days)</span>}
              {isMonthly && <span className="text-sm font-normal text-white/80 ml-1">({paymentOption === "quarterly" ? "3" : "12"} months)</span>}
            </span>
          </div>

          {/* Customer Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-5">
            <h3 className="text-sm font-bold text-zinc-800 mb-5 flex items-center gap-2">
              <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xs">2</span>
              {t.customerDetails || "Personal Information"}
            </h3>
          <div className="space-y-5">
            {/* Row 1: First Name, Last Name, Birth Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className={labelClass}>{t.firstNameEng || "First Name"} <span className="text-red-500">*</span></label>
                <input type="text" name="firstNameEng" value={formData.firstNameEng} onChange={handleChange} required placeholder="JOHN" className={`${inputClass} uppercase placeholder:text-gray-300`} />
              </div>
              <div>
                <label className={labelClass}>{t.lastNameEng || "Last Name"} <span className="text-red-500">*</span></label>
                <input type="text" name="lastNameEng" value={formData.lastNameEng} onChange={handleChange} required placeholder="DOE" className={`${inputClass} uppercase placeholder:text-gray-300`} />
              </div>
              <div>
                <label className={labelClass}>{t.birthDate || "Birth Date"} <span className="text-red-500">*</span></label>
                <DatePicker
                  selected={formData.birthDate ? new Date(formData.birthDate) : null}
                  onChange={(date: Date | null) => setFormData(prev => ({ ...prev, birthDate: date ? formatLocalDate(date) : '' }))}
                  maxDate={new Date()}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  yearDropdownItemNumber={100}
                  scrollableYearDropdown
                  className={inputClass}
                  wrapperClassName="w-full"
                  calendarClassName="!rounded-xl !shadow-xl !border-2 !border-gray-200"
                  popperPlacement="top-start"
                  required
                />
              </div>
            </div>

            {/* Row 2: Passport #, Citizenship, City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className={labelClass}>{t.passportNumber || "Passport #"} <span className="text-red-500">*</span></label>
                <input type="text" name="passportNumber" value={formData.passportNumber} onChange={handleChange} required placeholder="AB123456" className={`${inputClass} placeholder:text-gray-300`} />
              </div>
              <div>
                <label className={labelClass}>{t.citizenship || "Citizenship"} <span className="text-red-500">*</span></label>
                <Select
                  value={COUNTRIES.filter(c => c.code === formData.citizenship).map(c => ({ value: c.code, label: c.name }))[0] || null}
                  onChange={(option) => setFormData(prev => ({ ...prev, citizenship: option?.value || "" }))}
                  options={COUNTRIES.map(c => ({ value: c.code, label: c.name }))}
                  placeholder={t.selectOption || "Search..."}
                  isClearable
                  isSearchable
                  menuPlacement="top"
                  classNames={{
                    control: () => "!min-h-[52px] !border-2 !border-gray-200 !rounded-xl hover:!border-gray-300 !shadow-none",
                    menu: () => "!rounded-xl !shadow-xl !border-2 !border-gray-200 !z-50",
                    option: ({ isFocused, isSelected }) => 
                      `!py-2.5 !px-3 ${isSelected ? "!bg-red-500 !text-white" : isFocused ? "!bg-red-50" : ""}`,
                    placeholder: () => "!text-gray-400",
                    input: () => "!text-base",
                    singleValue: () => "!text-base",
                  }}
                  styles={{
                    control: (base) => ({ ...base, fontSize: "16px" }),
                  }}
                />
              </div>
              <div>
                <label className={labelClass}>{t.cityInGeorgia || "City in Georgia"} <span className="text-red-500">*</span></label>
                <Select
                  value={formData.city ? { value: formData.city, label: formData.city } : null}
                  onChange={(option) => setFormData(prev => ({ ...prev, city: option?.value || "" }))}
                  options={GEORGIAN_CITIES.map(city => ({ value: city, label: city }))}
                  placeholder={t.selectOption || "Search..."}
                  isClearable
                  isSearchable
                  menuPlacement="top"
                  classNames={{
                    control: () => "!min-h-[52px] !border-2 !border-gray-200 !rounded-xl hover:!border-gray-300 !shadow-none",
                    menu: () => "!rounded-xl !shadow-xl !border-2 !border-gray-200 !z-50",
                    option: ({ isFocused, isSelected }) => 
                      `!py-2.5 !px-3 ${isSelected ? "!bg-red-500 !text-white" : isFocused ? "!bg-red-50" : ""}`,
                    placeholder: () => "!text-gray-400",
                    input: () => "!text-base",
                    singleValue: () => "!text-base",
                  }}
                  styles={{
                    control: (base) => ({ ...base, fontSize: "16px" }),
                  }}
                />
              </div>
            </div>

            {/* Row 3: Phone with country code, Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <label className={labelClass}>{t.mobileNumber || "Phone"} <span className="text-red-500">*</span></label>
                <PhoneInput
                  country="ge"
                  value={formData.phone}
                  onChange={(phone) => setFormData(prev => ({ ...prev, phone }))}
                  inputClass="!w-full !h-[52px] !text-base !border-2 !border-gray-200 !rounded-xl !pl-14 focus:!ring-2 focus:!ring-red-500/20 focus:!border-red-500"
                  buttonClass="!border-2 !border-gray-200 !rounded-l-xl !bg-gray-50 hover:!bg-gray-100 !h-[52px] !w-12"
                  containerClass="!w-full"
                  dropdownClass="!rounded-xl !shadow-xl !border-2 !border-gray-200 !bottom-full !top-auto !mb-1"
                  searchClass="!rounded-lg !border-gray-200 !mx-2 !my-2"
                  enableSearch
                  searchPlaceholder="Search..."
                  preferredCountries={["ge", "ru", "ua", "tr", "il", "us", "de"]}
                  inputProps={{ required: true }}
                />
              </div>
              <div>
                <label className={labelClass}>{t.email || "Email"} <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  placeholder="email@example.com" 
                  className={`${inputClass} placeholder:text-gray-300 ${emailError ? "!border-red-500 !ring-2 !ring-red-500/20" : ""}`} 
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>
            </div>
          </div>
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-green-50 text-green-700 text-base px-5 py-4 rounded-xl flex items-center gap-3 border-2 border-green-200 mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.success || "Order submitted!"}
            </div>
          )}
          
          {submitStatus === "error" && (
            <div className="bg-red-50 text-red-700 text-base px-5 py-4 rounded-xl border-2 border-red-200 mb-5">
              {t.error || "Error. Please try again."}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-linear-to-r from-red-600 to-red-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t.submitting || "Submitting..."}
              </>
            ) : (
              t.submit || "Submit Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
