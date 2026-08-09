import { publicSupabase as supabase } from "@/lib/public-supabase";

export type DBProperty = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  property_type: string;
  status: "Available" | "Sold" | string;
  price: number | null;
  price_display: string | null;
  area_sqft: number | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  google_maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[] | null;
  approvals: string[] | null;
  featured: boolean;
  cover_image: string | null;
  highlight: string | null;
  location_label: string | null;
  created_at: string;
  updated_at: string;
};

export type DBPropertyImage = {
  id: string;
  property_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export const PROPERTY_TYPES = [
  "Plot",
  "Open Plots",
  "Villa",
  "Villas & Plots",
  "Apartment",
  "House",
  "Farm Land",
  "Gated Community",
  "Commercial",
] as const;

export async function fetchAvailableProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("status", ["Available", "Coming Soon"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DBProperty[];
}

export async function fetchPropertyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as DBProperty | null;
}

export async function fetchPropertyImages(propertyId: string) {
  const { data, error } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DBPropertyImage[];
}