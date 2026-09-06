import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseListingPrice(input?: string | null): number | null {
  if (!input) return null;
  const cleaned = input.replace(/,/g, "");
  const match = cleaned.match(/₹\s*([\d.]+)\s*(Lakhs?|Lacs?|Crores?|Cr)?/i);
  if (!match) {
    const numeric = Number(cleaned.replace(/[^\d.]/g, ""));
    return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
  }
  let value = parseFloat(match[1]);
  const unit = (match[2] ?? "").toLowerCase();
  if (unit.startsWith("crore") || unit === "cr") value *= 10000000;
  else if (unit.startsWith("lakh") || unit === "lac") value *= 100000;
  return Number.isFinite(value) && value > 0 ? value : null;
}
