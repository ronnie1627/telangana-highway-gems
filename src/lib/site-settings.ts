import { publicSupabase as supabase } from "@/lib/public-supabase";
import { queryOptions } from "@tanstack/react-query";

export type HeroSettings = {
  eyebrow: string;
  title_lead: string;
  title_highlight: string;
  title_trail: string;
  subtitle: string;
  stat1_value: string; stat1_label: string;
  stat2_value: string; stat2_label: string;
  stat3_value: string; stat3_label: string;
};

export type CtaSettings = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

export const HERO_DEFAULTS: HeroSettings = {
  eyebrow: "Open Plots At Low Budget · Limited Inventory",
  title_lead: "Affordable Open Plots, Villas &",
  title_highlight: "Farm Lands",
  title_trail: "across Telangana's prime highways.",
  subtitle:
    "Invest today in Telangana's fastest-growing real estate corridors. HMDA, DTCP, LRS, Farms and agricultural lands approved properties across Hyderabad & Telangana with bank loan support and verified documentation.",
  stat1_value: "1200+", stat1_label: "Plots Sold",
  stat2_value: "70+",   stat2_label: "Locations Covered",
  stat3_value: "100%",  stat3_label: "Verified Title",
};

export const CTA_DEFAULTS: CtaSettings = {
  eyebrow: "Talk To Us",
  title: "Tell us what you're looking for. We'll find the right property.",
  subtitle:
    "Share your requirement and one of our advisors will reach out within 24 hours with shortlisted options, transparent pricing and site visit availability.",
};

async function fetchSetting<T extends Record<string, string>>(key: string, defaults: T): Promise<T> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return { ...defaults, ...((data?.value as Partial<T>) ?? {}) };
}

export const heroQuery = queryOptions({
  queryKey: ["site_settings", "hero"],
  queryFn: () => fetchSetting("hero", HERO_DEFAULTS),
  staleTime: 30_000,
});

export const ctaQuery = queryOptions({
  queryKey: ["site_settings", "cta"],
  queryFn: () => fetchSetting("cta", CTA_DEFAULTS),
  staleTime: 30_000,
});

export async function saveSetting(key: string, value: Record<string, string>) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value as unknown as never }, { onConflict: "key" });
  if (error) throw error;
}