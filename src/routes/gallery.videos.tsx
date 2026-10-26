import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Play, ChevronLeft, ChevronRight, X, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { publicSupabase } from "@/lib/public-supabase";
import { parseYouTubeId, youtubeEmbedUrl, youtubeThumbnailUrl } from "@/lib/youtube";

export const Route = createFileRoute("/gallery/videos")({
  head: () => ({
    meta: [
      { title: "Property Video Links — Property Tours | KK Realtors" },
      { name: "description", content: "Browse YouTube walkthrough videos for every KK Realtors property that has one — open plots, villas, farm lands and gated communities across Telangana." },
      { property: "og:title", content: "Property Video Links | KK Realtors" },
      { property: "og:description", content: "Watch walkthrough videos of our Telangana properties in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "/gallery/videos" },
    ],
    links: [{ rel: "canonical", href: "/gallery/videos" }],
  }),
  component: GalleryVideos,
});

type VideoLinkProperty = {
  id: string;
  slug: string;
  title: string;
  location_label: string | null;
  city: string | null;
  youtube_url: string;
};

function GalleryVideos() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [visible, setVisible] = useState(9);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["property-video-links"],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("properties")
        .select("id, slug, title, location_label, city, youtube_url")
        .not("youtube_url", "is", null)
        .neq("youtube_url", "")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as VideoLinkProperty[]).filter((p) => parseYouTubeId(p.youtube_url));
    },
  });

  const items = properties.slice(0, visible);
  const active = openId !== null ? properties.find((p) => p.id === openId) ?? null : null;
  const activeIndex = openId !== null ? properties.findIndex((p) => p.id === openId) : -1;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight" && activeIndex < properties.length - 1) setOpenId(properties[activeIndex + 1].id);
      if (e.key === "ArrowLeft" && activeIndex > 0) setOpenId(properties[activeIndex - 1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, properties]);

  return (
    <>
      <section className="pt-40 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader
            align="left"
            eyebrow="Gallery — Videos"
            title="Property video links."
            subtitle="Walkthrough videos for every project that has one — browse them all here instead of opening each listing."
          />
          <div className="mt-8">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition-all hover:border-gold hover:text-gold"
            >
              <ChevronLeft size={14} /> Back to Photo Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse rounded-sm border border-border bg-card/40" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <p className="mt-12 text-center text-sm text-muted-foreground">No property videos have been linked yet. Check back soon.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((property) => {
                const id = parseYouTubeId(property.youtube_url)!;
                return (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => setOpenId(property.id)}
                    className="group overflow-hidden rounded-sm border border-border bg-background text-left transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-luxe focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background"
                    aria-label={`Play video for ${property.title}`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-ink">
                      <img
                        src={youtubeThumbnailUrl(id)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                      <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-background/80 text-gold backdrop-blur transition-transform duration-300 group-hover:scale-110">
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="text-[9px] uppercase tracking-[0.25em] text-gold">Property Video</div>
                      <h3 className="mt-1 font-display text-xl leading-snug text-foreground">{property.title}</h3>
                      <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={13} className="text-gold" />
                        {property.location_label || property.city || "Telangana"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
            {visible < properties.length && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisible((v) => v + 9)}
                  className="rounded-sm border border-gold px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gradient-gold hover:text-primary-foreground"
                >
                  Load More ({properties.length - visible} remaining)
                </button>
              </div>
            )}
            <p className="mt-10 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Showing {items.length} of {properties.length} property videos
            </p>
          </>
        )}
      </section>

      <Dialog open={!!active} onOpenChange={(open) => { if (!open) setOpenId(null); }}>
        <DialogContent
          className="fixed left-0 top-0 z-[60] flex h-screen w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none border-0 bg-black/95 p-0 shadow-none outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        >
          <DialogTitle className="sr-only">{active?.title ?? "Property video"}</DialogTitle>
          {active && (
            <div className="relative flex h-full w-full items-center justify-center px-4 py-8">
              <button
                onClick={() => setOpenId(null)}
                className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
                aria-label="Close video"
              >
                <X size={20} />
              </button>
              {activeIndex > 0 && (
                <button
                  onClick={() => setOpenId(properties[activeIndex - 1].id)}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Previous property video"
                >
                  <ChevronLeft size={28} />
                </button>
              )}
              <div className="w-full max-w-5xl">
                <div className="aspect-video overflow-hidden rounded-sm bg-black">
                  <iframe
                    src={youtubeEmbedUrl(parseYouTubeId(active.youtube_url)!, true)}
                    title={`${active.title} — property video`}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <div className="mt-4 text-center">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold">Property Video</div>
                  <div className="mt-1 font-display text-lg text-white">{active.title}</div>
                  <div className="mt-1 text-xs text-white/60">
                    {active.location_label || active.city || "Telangana"} · {activeIndex + 1} / {properties.length}
                  </div>
                </div>
              </div>
              {activeIndex < properties.length - 1 && (
                <button
                  onClick={() => setOpenId(properties[activeIndex + 1].id)}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Next property video"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
