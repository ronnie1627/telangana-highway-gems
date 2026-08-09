import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback, useEffect } from "react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from "lucide-react";
import { resolveAssetUrl } from "@/lib/asset-url";
import { publicSupabase as supabase } from "@/lib/public-supabase";

const TAG_ORDER = [
  "Srisailam Highway",
  "Warangal Highway",
  "Shadnagar",
  "Bangalore Highway",
  "Mumbai Highway",
  "Open Plots",
  "Villas",
  "Farm Lands",
  "Gated Communities",
];

type GalleryItem = { src: string; tag: string; tags: string[]; caption: string };

/** Short project label used as its own filter chip (e.g. "Iconic-9"). */
function projectTag(title: string): string {
  return (title.split("—")[0] ?? title).trim();
}

function deriveTags(
  title: string,
  locationLabel: string | null,
  propertyType: string | null,
): string[] {
  const loc = (locationLabel ?? "").toLowerCase();
  const type = (propertyType ?? "").toLowerCase();
  const out: string[] = [];

  if (loc.includes("srisailam") || loc.includes("amangal") || loc.includes("dindi") || loc.includes("kongarakalan") || loc.includes("future city"))
    out.push("Srisailam Highway");
  if (loc.includes("warangal") || loc.includes("keesaragutta") || loc.includes("bibinagar"))
    out.push("Warangal Highway");
  if (loc.includes("shadnagar") || loc.includes("burgula") || loc.includes("nagulapally"))
    out.push("Shadnagar");
  if (loc.includes("bangalore")) out.push("Bangalore Highway");
  if (loc.includes("mumbai")) out.push("Mumbai Highway");

  if (type.includes("farm")) out.push("Farm Lands");
  else if (type.includes("villa") || type.includes("house")) out.push("Villas");
  else if (type.includes("gated")) out.push("Gated Communities");
  else if (type.includes("plot")) out.push("Open Plots");

  out.push(projectTag(title));
  return Array.from(new Set(out.filter(Boolean)));
}

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Telangana Properties | KK Realtors" },
      { name: "description", content: "A visual tour of our open plots, villas, farm lands, gated communities and highway corridor locations across Telangana." },
      { property: "og:title", content: "KK Realtors Gallery" },
      { property: "og:description", content: "Premium property photography from across Telangana." },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: Gallery,
});

function Gallery() {
  const [tag, setTag] = useState<string>("All");
  const [visible, setVisible] = useState(24);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [databaseImages, setDatabaseImages] = useState<GalleryItem[]>([]);

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      const { data: properties, error: propertiesError } = await supabase
        .from("properties")
        .select("id,title,location_label,property_type");

      if (propertiesError || !properties?.length) return;

      const byId = new Map(properties.map((property) => [property.id, property]));
      const { data: images, error: imagesError } = await supabase
        .from("property_images")
        .select("id,property_id,url,caption,sort_order")
        .order("sort_order", { ascending: true });

      if (imagesError || !active) return;

      setDatabaseImages(
        (images ?? []).flatMap((image) => {
          const property = byId.get(image.property_id);
          if (!property) return [];
          const itemTags = deriveTags(property.title, property.location_label, property.property_type);
          return [{
            src: image.url,
            tag: itemTags[0],
            tags: itemTags,
            caption: image.caption?.trim() || property.title,
          }];
        }),
      );
    };

    void loadImages();
    return () => { active = false; };
  }, []);

  const allImages = useMemo<GalleryItem[]>(() => {
    const seen = new Set<string>();
    return databaseImages.filter((image) => {
      const source = resolveAssetUrl(image.src);
      if (seen.has(source)) return false;
      seen.add(source);
      return true;
    });
  }, [databaseImages]);

  const tags = useMemo<string[]>(() => {
    const present = new Set<string>();
    allImages.forEach((image) => image.tags.forEach((t) => present.add(t)));
    const ordered = TAG_ORDER.filter((t) => present.has(t));
    const rest = [...present].filter((t) => !TAG_ORDER.includes(t)).sort();
    return ["All", ...ordered, ...rest];
  }, [allImages]);

  const items = useMemo(
    () => (tag === "All" ? allImages : allImages.filter((g) => g.tags.includes(tag))),
    [allImages, tag],
  );
  const shown = items.slice(0, visible);

  const activeImg = openIndex !== null ? items[openIndex] : null;

  const goNext = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((prev) => (prev !== null && prev < items.length - 1 ? prev + 1 : prev));
  }, [openIndex, items.length]);

  const goPrev = useCallback(() => {
    if (openIndex === null) return;
    setOpenIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, [openIndex]);

  const handleDownload = useCallback(async () => {
    if (!activeImg) return;
    try {
      const imageUrl = resolveAssetUrl(activeImg.src);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = activeImg.caption.replace(/\s+/g, "_") + ".jpg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(resolveAssetUrl(activeImg.src), "_blank");
    }
  }, [activeImg]);

  const handleShare = useCallback(async () => {
    if (!activeImg) return;
    const shareData = {
      title: activeImg.caption,
      text: `Check out this property: ${activeImg.caption}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
    }
  }, [activeImg]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, goNext, goPrev]);

  return (
    <>
      <section className="pt-40 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader
            align="left"
            eyebrow="Gallery"
            title="A look across our portfolio."
            subtitle="Hundreds of on-site captures from our plots, villas, farm lands and gated communities across Telangana."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => { setTag(t); setVisible(24); }}
                className={`rounded-sm border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                  tag === t
                    ? "border-gold bg-gradient-gold text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-gold hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map((img, i) => (
            <figure
              key={img.caption + i}
              onClick={() => setOpenIndex(items.indexOf(img))}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm border border-border"
            >
              <img
                src={resolveAssetUrl(img.src)}
                alt={img.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn size={28} className="text-gold drop-shadow-lg" />
              </div>
              <figcaption className="absolute inset-x-3 bottom-3">
                <div className="text-[9px] uppercase tracking-[0.25em] text-gold">{img.tag}</div>
                <div className="font-display text-sm text-foreground">{img.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
        {visible < items.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisible((v) => v + 24)}
              className="rounded-sm border border-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gradient-gold hover:text-primary-foreground"
            >
              Load More ({items.length - visible} remaining)
            </button>
          </div>
        )}
        <p className="mt-10 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Showing {shown.length} of {items.length} photos
        </p>
      </section>

      <Dialog open={openIndex !== null} onOpenChange={(v) => { if (!v) setOpenIndex(null); }}>
        <DialogContent
          className="fixed left-0 top-0 z-[60] flex h-screen w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none border-0 bg-black/95 p-0 shadow-none outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <DialogTitle className="sr-only">{activeImg?.caption ?? "Gallery image"}</DialogTitle>
          {activeImg && (
            <div className="relative flex h-full w-full items-center justify-center px-4 py-8">
              <button
                onClick={goPrev}
                disabled={openIndex === 0}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
                aria-label="Previous image"
              >
                <ChevronLeft size={28} />
              </button>
              <img
                src={resolveAssetUrl(activeImg.src)}
                alt={activeImg.caption}
                className="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
              />
              <button
                onClick={goNext}
                disabled={openIndex === items.length - 1}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 disabled:opacity-30"
                aria-label="Next image"
              >
                <ChevronRight size={28} />
              </button>
              <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{activeImg.tag}</div>
                <div className="mt-1 font-display text-lg text-white">{activeImg.caption}</div>
                <div className="mt-2 text-xs text-white/60">
                  {openIndex !== null ? openIndex + 1 : 0} / {items.length}
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Download image"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-white/20"
                    aria-label="Share image"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}