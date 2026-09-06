import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/components/site/SectionHeader";
import { PhotoGallery } from "@/components/site/PhotoGallery";
import { DBPropertyCard } from "@/components/site/DBPropertyCard";
import { InquiryForm } from "@/components/site/InquiryForm";
import {
  fetchCorridorBySlug,
  fetchCorridorImages,
  fetchCorridorProperties,
} from "@/lib/corridor-types";
import type { DBProperty } from "@/lib/property-types";

function titleize(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export const Route = createFileRoute("/corridors/$slug")({
  head: ({ params }) => {
    const name = titleize(params.slug);
    const description = `Photo gallery, development updates and available open plots, villas and farm lands along the ${name} corridor near Hyderabad, Telangana.`;
    return {
      meta: [
        { title: `${name} Corridor — Plots & Farm Lands | KK Realtors` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} Corridor | KK Realtors` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/corridors/${params.slug}` }],
    };
  },
  component: CorridorPage,
});

function CorridorPage() {
  const { slug } = Route.useParams();

  const { data: corridor, isLoading } = useQuery({
    queryKey: ["corridor", slug],
    queryFn: () => fetchCorridorBySlug(slug),
  });

  const { data: images = [] } = useQuery({
    queryKey: ["corridor-images", corridor?.id],
    queryFn: () => fetchCorridorImages(corridor!.id),
    enabled: !!corridor?.id,
  });

  const { data: properties = [] } = useQuery({
    queryKey: ["corridor-properties", corridor?.name],
    queryFn: () => fetchCorridorProperties(corridor!.name),
    enabled: !!corridor?.name,
  });

  if (isLoading) {
    return <div className="pt-40 pb-24 text-center text-muted-foreground">Loading…</div>;
  }
  if (!corridor) {
    return (
      <div className="pt-40 pb-24 text-center">
        <p className="text-muted-foreground">Corridor not found.</p>
        <Link to="/corridors" className="mt-4 inline-block text-gold underline">← All corridors</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link to="/corridors" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">
          ← All Corridors
        </Link>

        <header className="mt-6 max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Highway Corridor</div>
          <h1 className="mt-3 font-display text-4xl text-foreground lg:text-5xl">{corridor.name}</h1>
          {corridor.tagline && <p className="mt-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">{corridor.tagline}</p>}
          {corridor.description && <p className="mt-5 leading-relaxed text-muted-foreground">{corridor.description}</p>}
        </header>

        <section className="mt-14">
          <SectionHeader
            align="left"
            eyebrow="Corridor Gallery"
            title="Development, surroundings & road access."
            subtitle="Representative photos of this corridor — site views, aerial shots and highway access."
          />
          <PhotoGallery
            className="mt-8"
            photos={images.map((i) => ({ url: i.url, caption: i.caption }))}
            emptyLabel="Photos for this corridor are being added soon."
          />
        </section>

        {properties.length > 0 && (
          <section className="mt-16">
            <SectionHeader align="left" eyebrow="Listings" title="Available along this corridor." />
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(properties as DBProperty[]).map((p) => (
                <DBPropertyCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-sm border border-border bg-card p-8">
          <h2 className="font-display text-2xl text-foreground">Enquire about {corridor.name}</h2>
          <div className="mt-6 max-w-2xl">
            <InquiryForm compact />
          </div>
        </section>
      </div>
    </div>
  );
}
