import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { resolveAssetUrl } from "@/lib/asset-url";

export type GalleryPhoto = {
  url: string;
  caption?: string | null;
};

type Props = {
  photos: GalleryPhoto[];
  /** Show the first photo as a large hero tile above the grid. */
  featureFirst?: boolean;
  className?: string;
  emptyLabel?: string;
};

/**
 * Responsive photo grid with a full-screen lightbox:
 * click / Enter / Space to open, arrows + swipe + keyboard to navigate.
 * Photos come from the database (property_images), so they can be added or
 * removed from the admin dashboard with no code changes.
 */
export function PhotoGallery({ photos, featureFirst = false, className = "", emptyLabel }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = photos.length;
  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % count)), [count]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + count) % count)), [count]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, next, prev]);

  if (count === 0) {
    return emptyLabel ? (
      <p className="rounded-sm border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    ) : null;
  }

  const active = index !== null ? photos[index] : null;
  const gridPhotos = featureFirst ? photos.slice(1) : photos;
  const gridOffset = featureFirst ? 1 : 0;

  const tile = (photo: GalleryPhoto, i: number, big = false) => (
    <button
      key={`${photo.url}-${i}`}
      type="button"
      onClick={() => setIndex(i)}
      aria-label={`Open photo ${i + 1} of ${count}${photo.caption ? `: ${photo.caption}` : ""}`}
      className={`group relative block w-full overflow-hidden rounded-sm border border-border bg-card outline-none focus-visible:ring-2 focus-visible:ring-gold ${
        big ? "h-[240px] sm:h-[380px] lg:h-[440px]" : "aspect-[4/3]"
      }`}
    >
      <img
        src={resolveAssetUrl(photo.url)}
        alt={photo.caption ?? `Property photo ${i + 1}`}
        loading={i > 2 ? "lazy" : "eager"}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <span className="pointer-events-none absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-background/70 text-gold opacity-0 transition-opacity group-hover:opacity-100">
        <ZoomIn size={15} />
      </span>
      {photo.caption && big && (
        <span className="pointer-events-none absolute bottom-3 left-4 text-xs uppercase tracking-[0.18em] text-gold-soft">
          {photo.caption}
        </span>
      )}
    </button>
  );

  return (
    <div className={className}>
      {featureFirst && <div className="mb-3">{tile(photos[0], 0, true)}</div>}
      {gridPhotos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {gridPhotos.map((p, i) => tile(p, i + gridOffset))}
        </div>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          onClick={close}
          onTouchStart={(e) => {
            const t = e.touches[0];
            touchStart.current = { x: t.clientX, y: t.clientY };
          }}
          onTouchEnd={(e) => {
            const start = touchStart.current;
            if (!start) return;
            const t = e.changedTouches[0];
            const dx = t.clientX - start.x;
            const dy = t.clientY - start.y;
            touchStart.current = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
              if (dx < 0) next();
              else prev();
            }
          }}
        >
          <img
            src={resolveAssetUrl(active.url)}
            alt={active.caption ?? "Property photo"}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-auto max-w-full object-contain"
          />

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:text-gold"
          >
            <X size={20} />
          </button>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:text-gold"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-border bg-background/80 text-foreground transition-colors hover:text-gold"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-5 text-center">
            {active.caption && (
              <p className="mx-auto max-w-2xl px-6 text-sm text-foreground/90">{active.caption}</p>
            )}
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold">
              {(index ?? 0) + 1} / {count}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
