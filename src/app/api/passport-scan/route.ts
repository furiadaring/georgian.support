import { NextRequest, NextResponse } from "next/server";

// MRZ 3-letter to ISO 2-letter country code mapping
const COUNTRY_CODES: Record<string, string> = {
  GEO: "GE",
  RUS: "RU",
  UKR: "UA",
  TUR: "TR",
  ISR: "IL",
  USA: "US",
  GBR: "GB",
  DEU: "DE",
  FRA: "FR",
  BLR: "BY",
  KAZ: "KZ",
  AZE: "AZ",
  ARM: "AM",
  UZB: "UZ",
  TJK: "TJ",
  KGZ: "KG",
  MDA: "MD",
  IRN: "IR",
  IRQ: "IQ",
  IND: "IN",
  PAK: "PK",
  CHN: "CN",
  JPN: "JP",
  KOR: "KR",
  EGY: "EG",
  SAU: "SA",
  ARE: "AE",
  JOR: "JO",
  LBN: "LB",
  SYR: "SY",
  POL: "PL",
  ITA: "IT",
  ESP: "ES",
  NLD: "NL",
  BEL: "BE",
  AUT: "AT",
  CHE: "CH",
  CZE: "CZ",
  HUN: "HU",
  ROU: "RO",
  BGR: "BG",
  SRB: "RS",
  GRC: "GR",
  CAN: "CA",
  AUS: "AU",
  NZL: "NZ",
  BRA: "BR",
  ARG: "AR",
  MEX: "MX",
};

// Parse MRZ date format (YYMMDD) to YYYY-MM-DD
function parseMRZDate(mrzDate: string): string {
  if (!mrzDate || mrzDate.length !== 6) return "";
  
  // Clean any non-digit characters
  const cleanDate = mrzDate.replace(/[^0-9]/g, "");
  if (cleanDate.length !== 6) return "";
  
  const yy = parseInt(cleanDate.substring(0, 2));
  const mm = cleanDate.substring(2, 4);
  const dd = cleanDate.substring(4, 6);
  
  // Assume 19xx for years > 30, 20xx for years <= 30
  const yyyy = yy > 30 ? 1900 + yy : 2000 + yy;
  
  return `${yyyy}-${mm}-${dd}`;
}

// Extract data from MRZ text
function parseMRZ(text: string): {
  firstName?: string;
  lastName?: string;
  passportNumber?: string;
  birthDate?: string;
  citizenship?: string;
} {
  console.log("Raw OCR text:", text);
  
  // Find MRZ lines - they contain < characters and are typically 44 chars for passports
  const allLines = text.split("\n").map(l => l.trim());
  
  // Find lines that look like MRZ (contain < and alphanumeric)
  const mrzLines = allLines.filter(l => {
    const cleaned = l.replace(/\s+/g, "");
    return cleaned.includes("<") && cleaned.length >= 30;
  }).map(l => l.replace(/\s+/g, ""));
  
  console.log("Found MRZ lines:", mrzLines);
  
  if (mrzLines.length < 2) {
    // Try to find lines starting with P< or containing passport number pattern
    const potentialMRZ = allLines.filter(l => 
      l.includes("P<") || /^[A-Z0-9<]{30,}$/.test(l.replace(/\s+/g, ""))
    ).map(l => l.replace(/\s+/g, ""));
    
    if (potentialMRZ.length >= 2) {
      mrzLines.push(...potentialMRZ);
    }
  }
  
  if (mrzLines.length < 2) return {};
  
  // Find line 1 (starts with P<) and line 2 (starts with passport number)
  let line1 = mrzLines.find(l => l.startsWith("P<") || l.match(/^P.?[A-Z]{3}/)) || "";
  let line2 = "";
  
  // Line 2 is usually the one with the passport number (alphanumeric start)
  for (const line of mrzLines) {
    if (line !== line1 && /^[A-Z0-9]{9}/.test(line)) {
      line2 = line;
      break;
    }
  }
  
  // If we couldn't find line2 properly, try the next line after line1
  if (!line2) {
    const line1Index = mrzLines.indexOf(line1);
    if (line1Index >= 0 && line1Index < mrzLines.length - 1) {
      line2 = mrzLines[line1Index + 1];
    }
  }
  
  console.log("MRZ Line 1:", line1);
  console.log("MRZ Line 2:", line2);
  
  if (!line1 || !line2) return {};
  
  try {
    // Line 1: P<COUNTRY<<SURNAME<<GIVEN<NAMES<<<<<<<<<<<<
    // Example: P<GEOVALISHVILI<<DIMITRI<<<<<<<<<<<<<<<<<<<<<
    const countryMatch = line1.match(/P.?([A-Z]{3})/);
    const countryCode = countryMatch ? countryMatch[1] : "";
    
    // Extract names - everything after the country code
    const namesStart = line1.indexOf(countryCode) + 3;
    const namesPart = line1.substring(namesStart).replace(/<+$/, "");
    const nameParts = namesPart.split("<<").filter(p => p);
    const lastName = nameParts[0] || "";
    const firstName = nameParts.slice(1).join(" ").replace(/<+/g, " ").trim();
    
    // Line 2: PASSPORT#<CHECK<NATIONALITY<BIRTHDATE<CHECK<SEX<EXPIRY<CHECK<...
    // Example: 23AC605321GEO8911148M3410185<<<<<<<<<<<<<<04
    const passportNumber = line2.substring(0, 9).replace(/</g, "").trim();
    
    // Birth date is at position 13-19 (after passport# + check + nationality)
    const birthDateMRZ = line2.substring(13, 19);
    const birthDate = parseMRZDate(birthDateMRZ);
    
    console.log("Parsed data:", { firstName, lastName, passportNumber, birthDate, countryCode });
    
    return {
      firstName: firstName.replace(/<+/g, " ").trim().toUpperCase() || undefined,
      lastName: lastName.replace(/<+/g, " ").trim().toUpperCase() || undefined,
      passportNumber: passportNumber || undefined,
      birthDate: birthDate || undefined,
      citizenship: COUNTRY_CODES[countryCode] || "OTHER",
    };
  } catch (err) {
    console.error("MRZ parsing error:", err);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("passport") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Passport scan request received, file size:", file.size);

    // Convert file to base64 for OCR services
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    
    // Try Google Cloud Vision API if configured
    const GOOGLE_VISION_API_KEY = process.env.GOOGLE_VISION_API_KEY;
    
    console.log("GOOGLE_VISION_API_KEY configured:", !!GOOGLE_VISION_API_KEY, "key length:", GOOGLE_VISION_API_KEY?.length || 0);
    
    if (GOOGLE_VISION_API_KEY) {
      try {
        const visionResponse = await fetch(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requests: [{
                image: { content: base64 },
                features: [{ type: "TEXT_DETECTION" }],
              }],
            }),
          }
        );
        
        const visionData = await visionResponse.json();
        console.log("Vision API response status:", visionResponse.status);
        console.log("Vision API full response:", JSON.stringify(visionData));
        
        if (visionData.error) {
          console.error("Vision API error:", JSON.stringify(visionData.error));
        }
        
        const text = visionData.responses?.[0]?.fullTextAnnotation?.text || "";
        console.log("Vision API extracted text length:", text.length);
        
        if (text) {
          const parsed = parseMRZ(text);
          // Return success even with partial data
          if (parsed.passportNumber || parsed.firstName || parsed.lastName) {
            return NextResponse.json({
              success: true,
              data: parsed,
              method: "google-vision",
            });
          }
        }
      } catch (visionError) {
        console.error("Google Vision error:", visionError);
      }
    }
    
    // Fallback: Return empty data, user fills manually
    // The passport image will still be attached to the order
    return NextResponse.json({
      success: true,
      data: {},
      method: "manual",
      message: "Could not auto-read passport. Please fill in details manually.",
    });
    
  } catch (error) {
    console.error("Passport scan error:", error);
    return NextResponse.json(
      { error: "Failed to process passport" },
      { status: 500 }
    );
  }
}
