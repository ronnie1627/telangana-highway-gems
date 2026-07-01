import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback, useEffect } from "react";
import { galleryImages } from "@/data/properties";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

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
  const items = useMemo(
    () => (tag === "All" ? galleryImages : galleryImages.filter((g) => g.tag === tag)),
    [tag],
  );
  const shown = items.slice(0, visible);

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
              className="group relative aspect-square overflow-hidden rounded-sm border border-border"
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
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
    </>
  );
}