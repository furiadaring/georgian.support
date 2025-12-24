import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Visit Georgia — Медицинское страхование в Грузии";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8FAFC",
          backgroundImage: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #DBEAFE 100%)",
        }}
      >
        {/* Blue accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundImage: "linear-gradient(90deg, #2563EB 0%, #1E3A8A 100%)",
          }}
        />
        
        {/* Content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            textAlign: "center",
          }}
        >
          {/* Shield Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              backgroundImage: "linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
              marginBottom: "32px",
              boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
            }}
          >
            <svg width="70" height="70" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>

          {/* Company name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#1E3A8A",
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}
          >
            Visit Georgia
          </div>
          
          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: "#2563EB",
              marginBottom: "32px",
            }}
          >
            Страхование в Грузии
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: "#64748B",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            Медицинская страховка для туристов и экспатов • от 3 GEL/день
          </div>
        </div>
        
        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "40px",
            color: "#94A3B8",
            fontSize: 20,
          }}
        >
          <span>visitgeorgia.online</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
