import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { resolveAssetUrl } from "@/lib/asset-url";

export type GalleryPhoto = { url: string; caption?: string | null };

export function PhotoGallery({
  photos,
  className = "",
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  emptyLabel = "Photos coming soon.",
}: {
  photos: GalleryPhoto[];
  className?: string;
  columns?: string;
  emptyLabel?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, next, prev]);

  if (photos.length === 0) {
    return <p className={`text-sm text-muted-foreground ${className}`}>{emptyLabel}</p>;
  }

  const active = index !== null ? photos[index] : null;

  return (
    <div className={className}>
      <div className={`grid gap-3 ${columns}`}>
        {photos.map((p, i) => (
          <button
            key={`${p.url}-${i}`}
            onClick={() => setIndex(i)}
            aria-label={p.caption || `Open photo ${i + 1}`}
            className="group relative aspect-4/3 overflow-hidden rounded-sm border border-border bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <img
              src={resolveAssetUrl(p.url)}
              alt={p.caption || "Property photo"}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <div
            className="relative max-h-full w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStartX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
              touchStartX.current = null;
            }}
          >
            <img
              src={resolveAssetUrl(active.url)}
              alt={active.caption || "Property photo"}
              className="mx-auto max-h-[85vh] w-auto object-contain"
            />
            {active.caption && (
              <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {active.caption}
              </p>
            )}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full bg-background/80 text-foreground hover:text-gold"
            >
              <X size={18} />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground hover:text-gold"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground hover:text-gold"
                >
                  <ChevronRight size={20} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-[11px] tracking-widest text-muted-foreground">
                  {(index ?? 0) + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
