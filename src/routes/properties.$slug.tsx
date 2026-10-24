import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react";
import { fetchPropertyBySlug, fetchPropertyImages, fetchPropertyVideos, videoMediaUrl } from "@/lib/property-types";
import { resolveAssetUrl } from "@/lib/asset-url";
import { parseYouTubeId, youtubeEmbedUrl } from "@/lib/youtube";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PhotoGallery } from "@/components/site/PhotoGallery";
import { EmiCalculator } from "@/components/site/EmiCalculator";
import { parseListingPrice } from "@/lib/utils";

export const Route = createFileRoute("/properties/$slug")({
  loader: async ({ params }) => {
    const property = await fetchPropertyBySlug(params.slug);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.property;
    const title = p ? `${p.title} — ${p.property_type} in ${p.city ?? "Telangana"} | KK Realtors` : "Property Details | KK Realtors";
    const description = p
      ? `${p.property_type} at ${p.location_label ?? p.city ?? ""}. ${p.price_display ?? ""} ${p.approvals?.join(", ") ?? ""}. ${p.description?.slice(0, 120) ?? ""}`.trim()
      : "Explore verified HMDA, DTCP and LRS approved plots, villas and farm lands with KK Realtors.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: p ? `/properties/${p.slug}` : "/properties" }],
    };
  },
  component: PropertyDetail,
});

function PropertyDetail() {
  const { property } = Route.useLoaderData();
  const { data: images = [] } = useQuery({
    queryKey: ["property-images", property.id],
    queryFn: () => fetchPropertyImages(property.id),
    enabled: !!property.id,
  });
  const { data: propertyVideos = [] } = useQuery({
    queryKey: ["property-videos", property.id],
    queryFn: () => fetchPropertyVideos(property.id),
    enabled: !!property.id,
  });

  const [lightbox, setLightbox] = useState<number | null>(null);
  const youtubeId = parseYouTubeId(property.youtube_url);

  const gallery = images.length > 0
    ? images.map((i) => ({ url: resolveAssetUrl(i.url), caption: i.caption ?? property.title }))
    : property.cover_image
    ? [{ url: resolveAssetUrl(property.cover_image), caption: property.title }]
    : [];

  const activeImg = lightbox !== null ? gallery[lightbox] : null;
  const goNext = () => setLightbox((i) => (i !== null && i < gallery.length - 1 ? i + 1 : i));
  const goPrev = () => setLightbox((i) => (i !== null && i > 0 ? i - 1 : i));

  const mapEmbed = property.google_maps_url
    ? (property.google_maps_url.includes("google.com/maps/embed")
        ? property.google_maps_url
        : `https://www.google.com/maps?q=${encodeURIComponent(property.google_maps_url)}&output=embed`)
    : property.latitude && property.longitude
    ? `https://www.google.com/maps?q=${property.latitude},${property.longitude}&output=embed`
    : property.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(property.address + " " + (property.city ?? ""))}&output=embed`
    : null;

  const listingPrice = property.price ?? parseListingPrice(property.price_display);

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link to="/properties" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">
          ← Back to Properties
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {gallery.length > 0 && (
              <>
                <button
                  onClick={() => setLightbox(0)}
                  className="block w-full overflow-hidden rounded-sm"
                >
                  <img src={gallery[0].url} alt={property.title} className="w-full h-[420px] object-cover" />
                </button>
                {gallery.length > 1 && (
                  <PhotoGallery
                    photos={gallery.slice(1).map((g) => ({ url: g.url, caption: g.caption }))}
                    columns="grid-cols-3 sm:grid-cols-4"
                  />
                )}
              </>
            )}

            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-sm border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold">
                  {property.property_type}
                </span>
                {property.highlight && (
                  <span className="rounded-sm bg-gradient-gold px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary-foreground">
                    {property.highlight}
                  </span>
                )}
                <span className={`rounded-sm px-3 py-1 text-[10px] uppercase tracking-[0.18em] ${property.status === "Sold" ? "bg-destructive/20 text-destructive" : "bg-emerald-500/10 text-emerald-500"}`}>
                  {property.status}
                </span>
              </div>
              <h1 className="font-display text-4xl leading-tight text-foreground">{property.title}</h1>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} className="text-gold" />
                {property.location_label || [property.address, property.city, property.state, property.pincode].filter(Boolean).join(", ")}
              </p>
              {property.price_display && (
                <p className="text-2xl text-gold">{property.price_display}</p>
              )}
              {property.description && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{property.description}</p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {property.area_sqft && (
                  <Info label="Area" value={`${property.area_sqft} sq.ft`} />
                )}
                {property.pincode && <Info label="Pincode" value={property.pincode} />}
                {property.city && <Info label="City" value={property.city} />}
                {property.state && <Info label="State" value={property.state} />}
              </div>

              {property.approvals && property.approvals.length > 0 && (
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Approvals</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {property.approvals.map((a) => (
                      <span key={a} className="rounded-sm border border-gold/40 px-2 py-1 text-[10px] uppercase tracking-wider text-gold">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Amenities</h3>
                  <ul className="mt-2 grid gap-2 sm:grid-cols-2 text-sm text-foreground">
                    {property.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {mapEmbed && (
                <div>
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Location</h3>
                  <div className="mt-2 aspect-video overflow-hidden rounded-sm border border-border">
                    <iframe src={mapEmbed} className="h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-sm border border-border bg-card p-6">
              <h3 className="font-display text-xl text-foreground">Contact KK Realtors</h3>
              <div className="mt-4 space-y-3 text-sm">
                <a href="tel:+918247532795" className="flex items-center gap-2 text-foreground hover:text-gold">
                  <Phone size={14} className="text-gold" /> +91 8247532795
                </a>
                <a href="mailto:KKrealtors02@gmail.com" className="flex items-center gap-2 text-foreground hover:text-gold">
                  <Mail size={14} className="text-gold" /> KKrealtors02@gmail.com
                </a>
                <a
                  href={`https://wa.me/918247532795?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(property.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-gold"
                >
                  <MessageCircle size={14} className="text-gold" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-sm border border-border bg-card p-6">
              <h3 className="font-display text-xl text-foreground">Enquire about this property</h3>
              <div className="mt-4">
                <InquiryForm compact propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>

            <EmiCalculator propertyPrice={listingPrice} title={property.title} />
          </aside>
        </div>
      </div>

      <Dialog open={lightbox !== null} onOpenChange={(o) => !o && setLightbox(null)}>
        <DialogContent className="max-w-[95vw] border-none bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Image</DialogTitle>
          {activeImg && (
            <div className="relative">
              <img src={activeImg.url} alt={activeImg.caption} className="mx-auto max-h-[85vh] w-auto object-contain" />
              <button onClick={() => setLightbox(null)} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-background/70">
                <X size={18} />
              </button>
              {lightbox! > 0 && (
                <button onClick={goPrev} className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/70">
                  <ChevronLeft size={20} />
                </button>
              )}
              {lightbox! < gallery.length - 1 && (
                <button onClick={goNext} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-background/70">
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-border bg-card/50 p-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}
