import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback, useEffect } from "react";
import { galleryImages } from "@/data/properties";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from "lucide-react";

const tags = ["All", "Warangal Highway", "Srisailam Highway", "Open Plots", "Villas", "Farm Lands", "Gated Communities", "Location Photos"] as const;

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
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const [visible, setVisible] = useState(24);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = useMemo(
    () => (tag === "All" ? galleryImages : galleryImages.filter((g) => g.tag === tag)),
    [tag],
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
      const response = await fetch(activeImg.src);
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
      window.open(activeImg.src, "_blank");
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
                src={img.src}
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
                src={activeImg.src}
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