import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPinned } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { DBPropertyCard } from "@/components/site/DBPropertyCard";
import { PhotoGallery, type GalleryPhoto } from "@/components/site/PhotoGallery";
import { CORRIDORS, corridorBySlug, propertyMatchesCorridor } from "@/lib/corridors";
import { fetchAvailableProperties, fetchPropertyImages } from "@/lib/property-types";
import { publicSupabase as supabase } from "@/lib/public-supabase";

export const Route = createFileRoute("/corridors/$corridor")({
  head: ({ params }) => {
    const c = corridorBySlug(params.corridor);
    const name = c?.name ?? "Highway Corridor";
    const description =
      c?.description ??
      "Explore KK Realtors plots, villas and farm lands along Telangana's growth highway corridors.";
    return {
      meta: [
        { title: `${name} Plots & Photos | KK Realtors` },
        { name: "description", content: description.slice(0, 158) },
        { property: "og:title", content: `${name} — KK Realtors` },
        { property: "og:description", content: description.slice(0, 158) },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/corridors/${params.corridor}` }],
    };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="pt-40 pb-24 text-center text-muted-foreground">{error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="pt-40 pb-24 text-center text-muted-foreground">Corridor not found.</div>
  ),
  component: CorridorPage,
});

function CorridorPage() {
  const { corridor: slug } = Route.useParams();
  const corridor = corridorBySlug(slug);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["properties", "available"],
    queryFn: fetchAvailableProperties,
  });

  const matched = corridor ? properties.filter((p) => propertyMatchesCorridor(p, corridor)) : [];
  const ids = matched.map((p) => p.id);

  const { data: photos = [] } = useQuery({
    queryKey: ["corridor-photos", slug, ids.join(",")],
    enabled: ids.length > 0,
    queryFn: async (): Promise<GalleryPhoto[]> => {
      const { data, error } = await supabase
        .from("property_images")
        .select("url,caption,property_id,sort_order")
        .in("property_id", ids)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const titles = new Map(matched.map((p) => [p.id, p.title]));
      return (data ?? []).map((img) => ({
        url: img.url,
        caption: img.caption?.trim() || titles.get(img.property_id) || null,
      }));
    },
  });

  if (!corridor) throw notFound();

  return (
    <div className="pt-32 pb-24">
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link to="/properties" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">
          ← All Properties
        </Link>
        <div className="mt-6 flex items-start gap-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-gradient-gold text-primary-foreground">
            <MapPinned size={20} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{corridor.tagline}</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-foreground sm:text-5xl">{corridor.name}</h1>
            <p className="mt-4 max-w-3xl text-muted-foreground leading-relaxed">{corridor.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {corridor.points.map((p) => (
                <span key={p} className="rounded-sm border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-6 lg:px-10">
        <SectionHeader
          align="left"
          eyebrow="Corridor Gallery"
          title="Photos from this corridor."
          subtitle="Layout maps, site photos, aerial shots and road access views from our ventures along this highway."
        />
        <div className="mt-8">
          <PhotoGallery
            photos={photos}
            featureFirst
            emptyLabel="Photos for this corridor are being added. Contact us for the latest site pictures."
          />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6 lg:px-10">
        <SectionHeader align="left" eyebrow="Listings" title={`Properties on ${corridor.name}.`} />
        <div className="mt-8">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 animate-pulse rounded-sm border border-border bg-card/50" />
              ))}
            </div>
          ) : matched.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active listings on this corridor right now.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matched.map((p) => (
                <DBPropertyCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-6 lg:px-10">
        <SectionHeader align="left" eyebrow="Other corridors" title="Keep exploring." />
        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CORRIDORS.filter((c) => c.slug !== corridor.slug).map((c) => (
            <Link
              key={c.slug}
              to="/corridors/$corridor"
              params={{ corridor: c.slug }}
              className="group bg-card p-7 transition-colors hover:bg-card/60"
            >
              <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Corridor</div>
              <h3 className="mt-3 font-display text-xl text-foreground group-hover:text-gold">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.points.join(" · ")}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

// keep import used for property detail prefetching parity
void fetchPropertyImages;
