// Resolves legacy `/src/assets/...` paths (used in seeded DB rows and static data)
// into real bundled URLs. Also passes through absolute URLs (from Supabase Storage
// uploads) unchanged.

const staticImgs = import.meta.glob(
  "/src/assets/*.{jpg,jpeg,png,webp,svg}",
  { eager: true, import: "default", query: "?url" },
) as Record<string, string>;

const jsonAssets = import.meta.glob("/src/assets/*.asset.json", {
  eager: true,
  import: "default",
}) as Record<string, { url: string }>;

const map = new Map<string, string>();
for (const [k, v] of Object.entries(staticImgs)) map.set(k, v);
for (const [k, v] of Object.entries(jsonAssets)) {
  map.set(k, v.url);
  map.set(k.replace(/\.asset\.json$/, ""), v.url);
}

export function resolveAssetUrl(src?: string | null): string {
  if (!src) return "";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }
  return map.get(src) ?? src;
}