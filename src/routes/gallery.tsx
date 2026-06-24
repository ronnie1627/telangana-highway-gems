import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { galleryImages } from "@/data/properties";
import { SectionHeader } from "@/components/site/SectionHeader";

const tags = ["All", "Open Plots", "Villas", "Farm Lands", "Gated Communities", "Location Photos"] as const;

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
  const items = useMemo(
    () => (tag === "All" ? galleryImages : galleryImages.filter((g) => g.tag === tag)),
    [tag],
  );

  return (
    <>
      <section className="pt-40 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader
            align="left"
            eyebrow="Gallery"
            title="A look across our portfolio."
            subtitle="Photography placeholders ready to be replaced with on-site captures of each layout."
          />
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
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
        <div className="grid auto-rows-[260px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((img, i) => (
            <figure
              key={img.caption + i}
              className={`group relative overflow-hidden rounded-sm border border-border ${
                i % 5 === 0 ? "row-span-2" : ""
              } ${i % 7 === 0 ? "col-span-2" : ""}`}
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
              <figcaption className="absolute inset-x-4 bottom-4">
                <div className="text-[10px] uppercase tracking-[0.25em] text-gold">{img.tag}</div>
                <div className="font-display text-lg text-foreground">{img.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}