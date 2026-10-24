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
  youtube_url: string | null;
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
export type DBGalleryVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
};

/** Videos uploaded to storage and linked to a single property. */
export async function fetchPropertyVideos(propertyId: string) {
  const { data, error } = await supabase
    .from("gallery_videos")
    .select("id, title, description, thumbnail_url, video_url, duration")
    .eq("property_id", propertyId)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DBGalleryVideo[];
}

/** Resolve a stored video path (or passthrough URLs) to a playable URL. */
export function videoMediaUrl(value: string | null | undefined) {
  if (!value) return "";
  if (/^(https?:|data:|blob:|\/)/.test(value)) return value;
  return `/api/property-videos/${value.split("/").map(encodeURIComponent).join("/")}`;
}

export async function fetchFeaturedProperties(limit = 6) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("status", ["Available", "Coming Soon"])
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as DBProperty[];
}
