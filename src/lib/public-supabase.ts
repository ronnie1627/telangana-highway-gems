import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Public (anon) credentials are safe to ship. They are pinned here as a
// fallback so public property reads keep working on deployments where the
// VITE_SUPABASE_* build variables are missing or stale (e.g. self-hosted
// Vercel builds), which otherwise fail with 401 and render an empty list.
const FALLBACK_URL = "https://ucdirffvkhtosoiksxcw.supabase.co";
const FALLBACK_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjZGlyZmZ2a2h0b3NvaWtzeGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3Mjc4ODMsImV4cCI6MjA5ODMwMzg4M30.DKSqc16PZ38924jRYl3I2oTyDNcnI2LIeHg1yOWgeok";

const URL_ =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const KEY_ =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  FALLBACK_KEY;

const resilientFetch: typeof fetch = async (input, init) => {
  const headers = new Headers(init?.headers);
  headers.set("apikey", KEY_);
  headers.set("Authorization", `Bearer ${KEY_}`);
  const res = await fetch(input, { ...init, headers });
  if (res.status !== 401 || KEY_ === FALLBACK_KEY) return res;

  // Build-time key is stale/invalid — retry once with the pinned anon key.
  const retryHeaders = new Headers(init?.headers);
  retryHeaders.set("apikey", FALLBACK_KEY);
  retryHeaders.set("Authorization", `Bearer ${FALLBACK_KEY}`);
  const retryUrl =
    typeof input === "string" && URL_ !== FALLBACK_URL
      ? input.replace(URL_, FALLBACK_URL)
      : input;
  return fetch(retryUrl, { ...init, headers: retryHeaders });
};

/** Anonymous, read-only client for public data (properties, images). */
export const publicSupabase = createClient<Database>(URL_, KEY_, {
  auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  global: { fetch: resilientFetch },
});