import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { fetchPropertyImages, type DBProperty } from "@/lib/property-types";
import { resolveAssetUrl } from "@/lib/asset-url";

export function PropertyCardGallery({ property }: { property: DBProperty }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { data: images = [], isLoading, isError } = useQuery({
    queryKey: ["property-images", property.id],
    queryFn: () => fetchPropertyImages(property.id),
    enabled: open,
  });

  const photos = useMemo(() => {
    if (images.length > 0) {
      return images.map((image) => ({
        url: resolveAssetUrl(image.url),
        caption: image.caption || property.title,
      }));
    }
    return property.cover_image
      ? [{ url: resolveAssetUrl(property.cover_image), caption: property.title }]
      : [];
  }, [images, property.cover_image, property.title]);

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => {
    setIndex((current) => (photos.length > 0 ? (current + 1) % photos.length : 0));
  }, [photos.length]);
  const prev = useCallback(() => {
    setIndex((current) => (photos.length > 0 ? (current - 1 + photos.length) % photos.length : 0));
  }, [photos.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, next, open, prev]);

  useEffect(() => {
    if (index >= photos.length && photos.length > 0) setIndex(photos.length - 1);
  }, [index, photos.length]);

  const active = photos[index];

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIndex(0);
          setOpen(true);
        }}
        aria-label={`Open photo gallery for ${property.title}`}
        title="Open photo gallery"
        className="absolute bottom-4 right-4 z-10 h-10 w-10 rounded-sm border border-border bg-background/80 text-foreground backdrop-blur hover:border-gold hover:text-gold"
      >
        <Images size={17} />
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${property.title} photo gallery`}
          onClick={close}
        >
          <div
            className="relative flex h-full w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const distance = event.changedTouches[0]?.clientX - touchStartX.current;
              if (Math.abs(distance) > 50) {
                if (distance < 0) next();
                else prev();
              }
              touchStartX.current = null;
            }}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={close}
              aria-label="Close photo gallery"
              className="absolute right-0 top-0 z-10 h-11 w-11 rounded-full bg-background/80 text-foreground hover:text-gold"
            >
              <X size={20} />
            </Button>

            {isLoading ? (
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Loading property photos…</p>
            ) : isError ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Property photos are unavailable right now.</p>
                {active && <img src={active.url} alt={active.caption} className="mx-auto mt-4 max-h-[75vh] w-auto object-contain" />}
              </div>
            ) : active ? (
              <>
                <img
                  src={active.url}
                  alt={active.caption}
                  className="max-h-[82vh] max-w-[calc(100%-5rem)] object-contain"
                />
                {active.caption && (
                  <p className="absolute bottom-2 left-1/2 max-w-[80%] -translate-x-1/2 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {active.caption}
                  </p>
                )}
                {photos.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={prev}
                      aria-label="Previous property photo"
                      className="absolute left-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-background/80 text-foreground hover:text-gold"
                    >
                      <ChevronLeft size={22} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={next}
                      aria-label="Next property photo"
                      className="absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full bg-background/80 text-foreground hover:text-gold"
                    >
                      <ChevronRight size={22} />
                    </Button>
                    <span className="absolute bottom-2 right-1/2 translate-x-1/2 rounded-full bg-background/80 px-3 py-1 text-[11px] tracking-widest text-muted-foreground">
                      {index + 1} / {photos.length}
                    </span>
                  </>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No photos have been added for this property yet.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}