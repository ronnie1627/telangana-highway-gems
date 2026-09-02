import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Play, X } from "lucide-react";
import { publicSupabase } from "@/lib/public-supabase";

type GalleryVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  sort_order: number;
};

function mediaUrl(value: string | null | undefined) {
  if (!value) return "";
  if (/^(https?:|data:|blob:|\/)/.test(value)) return value;
  return `/api/property-videos/${value.split("/").map(encodeURIComponent).join("/")}`;
}

export function VideoGallery() {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["gallery-videos", "published"],
    queryFn: async () => {
      const { data, error } = await publicSupabase
        .from("gallery_videos")
        .select("id, title, description, thumbnail_url, video_url, duration, sort_order")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GalleryVideo[];
    },
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeVideo = useMemo(() => videos.find((video) => video.id === activeId) ?? null, [activeId, videos]);

  useEffect(() => {
    if (!activeVideo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeVideo]);

  return (
    <>
      <section className="border-y border-border bg-card/30 py-24" aria-labelledby="video-gallery-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <div className="max-w-2xl text-left">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Video Gallery</span>
              </div>
              <h2 id="video-gallery-title" className="mt-5 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                See the locations before you visit.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Walk through our highway corridors, open plots, villas and farm lands from wherever you are.
              </p>
            </div>
            {videos.length > 0 && <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{videos.length} videos</span>}
          </div>

          {isLoading ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">Loading video gallery…</p>
          ) : videos.length === 0 ? (
            <p className="mt-12 text-center text-sm text-muted-foreground">New property videos coming soon.</p>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setActiveId(video.id)}
                  className="group overflow-hidden rounded-sm border border-border bg-background text-left transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-luxe focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-background"
                  aria-label={`Play ${video.title}`}
                >
                  <div className="relative aspect-video overflow-hidden bg-ink">
                    {video.thumbnail_url ? (
                      <img
                        src={mediaUrl(video.thumbnail_url)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-gold opacity-80" aria-hidden="true" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-background/80 text-gold backdrop-blur transition-transform duration-300 group-hover:scale-110">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </span>
                    {video.duration && <span className="absolute bottom-3 right-3 rounded-sm bg-background/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground">{video.duration}</span>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl leading-snug text-foreground">{video.title}</h3>
                    {video.description && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{video.description}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={!!activeVideo} onOpenChange={(open) => { if (!open) setActiveId(null); }}>
        <DialogContent className="fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 border-border bg-background p-3 shadow-luxe sm:p-5">
          <DialogTitle className="sr-only">{activeVideo?.title ?? "Property video"}</DialogTitle>
          {activeVideo && (
            <div>
              <div className="relative overflow-hidden rounded-sm bg-black">
                <video
                  key={activeVideo.id}
                  src={mediaUrl(activeVideo.video_url)}
                  poster={mediaUrl(activeVideo.thumbnail_url)}
                  controls
                  preload="metadata"
                  playsInline
                  className="max-h-[75vh] w-full"
                />
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-sm border border-border bg-background/85 text-foreground backdrop-blur hover:border-gold hover:text-gold"
                  aria-label="Close video"
                >
                  <X size={18} />
                </button>
              </div>
              <h2 className="mt-4 font-display text-2xl text-foreground">{activeVideo.title}</h2>
              {activeVideo.description && <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{activeVideo.description}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
