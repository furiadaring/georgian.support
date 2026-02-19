"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Client component that captures attribution data on page load.
 * Place in layout.tsx to run on every page.
 *
 * On first visit (landing from ad), captures subid + UTM params from URL.
 * On subsequent pages, retrieves subid from Keitaro SDK cookies.
 * All data persists in sessionStorage for the entire browsing session.
 */
export default function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
