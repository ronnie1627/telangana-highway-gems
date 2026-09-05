import { publicSupabase as supabase } from "@/lib/public-supabase";

export type DBCorridor = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  published: boolean;
};

export type DBCorridorImage = {
  id: string;
  corridor_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
};

export async function fetchCorridors() {
  const { data, error } = await supabase
    .from("corridors")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DBCorridor[];
}

export async function fetchCorridorBySlug(slug: string) {
  const { data, error } = await supabase
    .from("corridors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as DBCorridor | null) ?? null;
}

export async function fetchCorridorImages(corridorId: string) {
  const { data, error } = await supabase
    .from("corridor_images")
    .select("*")
    .eq("corridor_id", corridorId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DBCorridorImage[];
}

/** Properties that belong to a corridor, matched on location text. */
export async function fetchCorridorProperties(corridorName: string) {
  const keyword = corridorName.replace(/\s*highway\s*/i, "").trim();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("status", ["Available", "Coming Soon"])
    .or(
      [
        `location_label.ilike.%${keyword}%`,
        `title.ilike.%${keyword}%`,
        `description.ilike.%${keyword}%`,
      ].join(","),
    )
    .order("featured", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
