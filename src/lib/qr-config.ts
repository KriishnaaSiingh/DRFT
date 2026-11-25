/**
 * Shared, client-safe configuration for the QR routing app.
 *
 * The Supabase URL and publishable (anon) key are public values by design —
 * every row is protected by row-level security. They can be overridden with
 * env vars if the project is ever pointed at a different database.
 *
 * We read from both import.meta.env (Vite, replaced at build time) and
 * process.env (Node.js runtime on Vercel) so server functions work correctly.
 */

// Safe env reader — works in browser bundle, Vite SSR, and raw Node.js
function getEnv(key: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const v = import.meta.env[key] as string | undefined;
    if (v) return v;
  }
  if (typeof process !== "undefined" && process.env) {
    const v = process.env[key] as string | undefined;
    if (v) return v;
  }
  return undefined;
}

export const SUPABASE_URL =
  getEnv("VITE_SUPABASE_URL") ?? "https://aojohianxjjqrvcrpgao.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ??
  "sb_publishable_xIjd0A1mTs1n7q6sXYUhlg_Hz9qlhYC";

/** The 50 fixed card IDs: "001" … "050". */
export const CARD_IDS: readonly string[] = Array.from({ length: 50 }, (_, i) =>
  String(i + 1).padStart(3, "0"),
);

export const TOTAL_CARDS = CARD_IDS.length;

export const QR_BASE_URL =
  getEnv("VITE_APP_URL") ?? "https://drftreviews.vercel.app";

export function getCardQrUrl(id: string): string {
  return `${QR_BASE_URL}/q/${id}`;
}

export const DEFAULT_GOOGLE_REVIEW_LINKS = {
  "001": {
    shop_name: "DRFT Reviews — Location 1",
    url: "https://search.google.com/local/writereview?placeid=ChIJK7BfLrErCTkRvBd4rfs6X8g",
  },
  "002": {
    shop_name: "DRFT Reviews — Location 2",
    url: "https://search.google.com/local/writereview?placeid=ChIJUStYgL7pDDkRW8zAWxQ3Rhc",
  },
} as const;

export function getDefaultReviewLink(
  id: string,
): { readonly shop_name: string; readonly url: string } | null {
  if (id === "001") return DEFAULT_GOOGLE_REVIEW_LINKS["001"];
  if (id === "002") return DEFAULT_GOOGLE_REVIEW_LINKS["002"];
  return null;
}

export function isValidCardId(id: string): boolean {
  return /^0(0[1-9]|[1-4][0-9]|50)$/.test(id);
}

export type CardStatus = "active" | "inactive";

export type QrCard = {
  id: string;
  shop_name: string | null;
  destination_url: string | null;
  status: CardStatus;
  scan_count: number;
  last_scanned_at: string | null;
  created_at: string;
  updated_at: string;
};

export type QrScan = {
  id: string;
  card_id: string;
  scanned_at: string;
  device_type: string;
  user_agent: string | null;
};

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isValidUrl(raw: string): boolean {
  if (!raw.trim()) return false;
  try {
    const url = new URL(normalizeUrl(raw));
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function deviceTypeFromUserAgent(ua: string | null): string {
  if (!ua) return "unknown";
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|windows phone/.test(s)) return "mobile";
  if (/bot|crawl|spider|preview|facebookexternalhit/.test(s)) return "bot";
  return "desktop";
}
