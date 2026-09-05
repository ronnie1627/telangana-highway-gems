import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/site/SectionHeader";
import { fetchCorridors } from "@/lib/corridor-types";

export const Route = createFileRoute("/corridors/")({
  head: () => ({
    meta: [
      { title: "Highway Corridors — Telangana Growth Belts | KK Realtors" },
      { name: "description", content: "Explore open plots, villas and farm lands along Hyderabad's Mumbai, Bangalore, Vijayawada, Srisailam and Warangal highway corridors." },
      { property: "og:title", content: "Highway Corridors | KK Realtors" },
      { property: "og:description", content: "Five Telangana highway corridors, with photo galleries of development and road access." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/corridors" }],
  }),
  component: CorridorsIndex,
});

function CorridorsIndex() {
  const { data: corridors = [], isLoading } = useQuery({
    queryKey: ["corridors"],
    queryFn: fetchCorridors,
  });

  return (
    <section className="pt-40 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          align="left"
          eyebrow="Highway Corridors"
          title="Five corridors. One growth story."
          subtitle="Each corridor has its own gallery of site, road access and development photos."
        />
        {isLoading ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading corridors…</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {corridors.map((c) => (
              <Link
                key={c.id}
                to="/corridors/$slug"
                params={{ slug: c.slug }}
                className="group rounded-sm border border-border bg-card p-8 transition-colors hover:border-gold"
              >
                <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Corridor</div>
                <h2 className="mt-3 font-display text-2xl text-foreground group-hover:text-gold">{c.name}</h2>
                {c.tagline && <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>}
                <span className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-gold">View gallery →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
