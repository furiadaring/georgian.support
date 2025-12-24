"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ClickTrackingInner() {
  const searchParams = useSearchParams();
  const clickid = searchParams.get("clickid");

  useEffect(() => {
    if (!clickid) return;

    // Append clickid to all WhatsApp links
    const whatsappLinks = document.querySelectorAll<HTMLAnchorElement>(
      'a[href*="wa.me"], a[href*="api.whatsapp.com/send"]'
    );

    whatsappLinks.forEach((a) => {
      try {
        const url = new URL(a.href);
        url.searchParams.set("clickid", clickid);
        a.href = url.toString();
      } catch (e) {
        // Invalid URL, skip
      }
    });
  }, [clickid]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>(
        'a[href*="wa.me"], a[href*="api.whatsapp.com/send"]'
      );
      
      if (!anchor) return;

      try {
        const url = new URL(anchor.href);
        const linkClickid = url.searchParams.get("clickid");
        
        if (!linkClickid) return;

        // Send postback
        fetch(
          `https://track.visitgeorgia.online/postback?cid=${encodeURIComponent(linkClickid)}`
        ).catch(() => {
          // Silently fail
        });
      } catch (e) {
        // Invalid URL, skip
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}

export default function ClickTracking() {
  return (
    <Suspense fallback={null}>
      <ClickTrackingInner />
    </Suspense>
  );
}
