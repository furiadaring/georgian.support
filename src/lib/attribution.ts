"use client";

/**
 * Attribution/Tracking Data Utility
 *
 * Captures and persists attribution data (subid, UTM params, etc.) across page navigations.
 *
 * DATA FLOW:
 * 1. User clicks Google ad → Keitaro redirect → georgian.support/?subid=XXXXX&utm_source=...
 * 2. On first page load, this utility captures ALL tracking params from URL + Keitaro SDK
 * 3. Stores them in sessionStorage so they persist across page navigations
 * 4. Forms read attribution from sessionStorage (not URL) so data isn't lost
 *
 * Keitaro SDK Integration:
 * - k.min.js stores subid in cookies internally
 * - KTracking.getSubId(callback) returns the stored subid on any page
 * - We call getSubId() to fill in subid even when URL param is gone
 */

// TypeScript interface for KTracking global
interface KTrackingGlobal {
  getSubId: (fn: (subId: string) => void) => void;
  reportConversion: (payout: number, status: string) => void;
  listeners: Array<(subId: string) => void>;
  queued?: unknown;
}

declare global {
  interface Window {
    KTracking?: KTrackingGlobal;
  }
}

const STORAGE_KEY = "gs_attribution";

export interface AttributionData {
  subid: string;
  click_id: string;
  campaign: string;
  ad_source: string;
  keyword: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  landing_page: string;
  referrer: string;
  source_domain: string;
}

function getEmptyAttribution(): AttributionData {
  return {
    subid: "",
    click_id: "",
    campaign: "",
    ad_source: "",
    keyword: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    landing_page: "",
    referrer: "",
    source_domain: "",
  };
}

/**
 * Capture attribution data from URL params and store to sessionStorage.
 * Should be called once on initial page load (e.g., in layout or root component).
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  // If we already have attribution data stored, only update subid from Keitaro
  const existing = sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    // Still try to get subid from Keitaro in case it wasn't available initially
    tryKeitaroSubId(JSON.parse(existing));
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);

  const data: AttributionData = {
    subid: urlParams.get("subid") || urlParams.get("sub_id") || "",
    click_id: urlParams.get("click_id") || urlParams.get("clickid") || "",
    campaign: urlParams.get("campaign") || urlParams.get("c") || "",
    ad_source: urlParams.get("source") || urlParams.get("src") || urlParams.get("ad_source") || "",
    keyword: urlParams.get("keyword") || urlParams.get("kw") || "",
    utm_source: urlParams.get("utm_source") || "",
    utm_medium: urlParams.get("utm_medium") || "",
    utm_campaign: urlParams.get("utm_campaign") || "",
    utm_term: urlParams.get("utm_term") || "",
    utm_content: urlParams.get("utm_content") || "",
    landing_page: window.location.pathname + window.location.search,
    referrer: document.referrer || "",
    source_domain: window.location.hostname,
  };

  // Store immediately with what we have from URL params
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Then try to get subid from Keitaro SDK (async, may update storage)
  tryKeitaroSubId(data);
}

/**
 * Try to get subid from Keitaro k.min.js SDK.
 * The SDK stores subid in cookies and provides it via getSubId() callback.
 * This works even after the user navigates away from the landing page.
 */
function tryKeitaroSubId(data: AttributionData): void {
  if (typeof window === "undefined" || !window.KTracking) return;

  try {
    window.KTracking.getSubId((subId: string) => {
      if (subId && (!data.subid || data.subid !== subId)) {
        data.subid = subId;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    });
  } catch {
    // Keitaro SDK not ready yet, will try again on next call
  }
}

/**
 * Get stored attribution data. Returns empty data if nothing captured yet.
 * All form components should use this instead of reading URL params directly.
 */
export function getAttribution(): AttributionData {
  if (typeof window === "undefined") return getEmptyAttribution();

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getEmptyAttribution();
    }
  }

  return getEmptyAttribution();
}

/**
 * Report a Keitaro conversion (lead or sale).
 */
export function reportKeitaroConversion(payout: number = 0, status: string = "lead"): void {
  if (typeof window === "undefined" || !window.KTracking) return;
  try {
    window.KTracking.reportConversion(payout, status);
    console.log('Keitaro conversion reported:', status, payout);
  } catch {
    // Silently fail
  }
}
