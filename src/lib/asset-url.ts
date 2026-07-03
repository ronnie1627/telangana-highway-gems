const STORAGE_PROXY_PREFIX = "/api/property-images/";
const STORAGE_BUCKET = "property-images";

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

function filenameFromPath(src: string) {
  const clean = src.split("?")[0].split("#")[0];
  return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1));
}

function pathFromStorageUrl(src: string) {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const authMarker = `/storage/v1/object/authenticated/${STORAGE_BUCKET}/`;
  const idx = src.indexOf(marker);
  const authIdx = src.indexOf(authMarker);
  if (idx >= 0) return decodeURIComponent(src.slice(idx + marker.length));
  if (authIdx >= 0) return decodeURIComponent(src.slice(authIdx + authMarker.length));
  return null;
}

export function storageImagePath(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith(STORAGE_PROXY_PREFIX)) return src.slice(STORAGE_PROXY_PREFIX.length);
  if (src.startsWith(`${STORAGE_BUCKET}/`)) return src.slice(STORAGE_BUCKET.length + 1);
  if (src.startsWith("properties/")) return src;
  const fromStorage = pathFromStorageUrl(src);
  if (fromStorage) return fromStorage;
  const file = filenameFromPath(src);
  return file ? `properties/${file}` : "";
}

export function storageImageUrl(pathOrUrl?: string | null): string {
  const path = storageImagePath(pathOrUrl);
  return path ? `${STORAGE_PROXY_PREFIX}${path.split("/").map(encodeURIComponent).join("/")}` : "";
}

export function resolveAssetUrl(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith(STORAGE_PROXY_PREFIX) || src.startsWith(`${STORAGE_BUCKET}/`) || src.startsWith("properties/")) {
    return storageImageUrl(src);
  }
  if (pathFromStorageUrl(src)) return storageImageUrl(src);
  if (src.startsWith("/__l5e/assets-v1/") || src.startsWith("/src/assets/")) {
    return storageImageUrl(src);
  }
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