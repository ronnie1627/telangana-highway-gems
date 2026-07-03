import { MapPin, MessageCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Property } from "@/data/properties";
import { resolveAssetUrl } from "@/lib/asset-url";

export function PropertyCard({ p }: { p: Property }) {
  const cover = resolveAssetUrl(p.image);
  return (
    <article className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-luxe">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={cover}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        {p.highlight && (
          <span className="absolute left-4 top-4 rounded-sm bg-gradient-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-gold">
            {p.highlight}
          </span>
        )}
        <span className="absolute right-4 top-4 rounded-sm border border-gold/40 bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur">
          {p.category}
        </span>
        <div className="absolute inset-x-4 bottom-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gold-soft">{p.price}</p>
        </div>
      </div>
      <div className="space-y-4 p-6">
        <h3 className="font-display text-xl leading-snug text-foreground">{p.title}</h3>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} className="text-gold" />
          {p.location}
        </p>
        <div className="flex flex-wrap gap-2">
          {p.approvals.map((a) => (
            <span key={a} className="rounded-sm border border-gold/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold">
              {a}
            </span>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {p.features.map((f) => (
            <li key={f} className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-gold" /> {f}
            </li>
          ))}
        </ul>
        <div className="flex gap-2 pt-2">
          <Link
            to="/contact"
            className="flex-1 rounded-sm bg-gradient-gold px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Enquire Now
          </Link>
          <a
            href={`https://wa.me/918247532795?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(p.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="grid h-10 w-10 place-items-center rounded-sm border border-border text-foreground transition-colors hover:border-gold hover:text-gold"
          >
            <MessageCircle size={16} />
          </a>
        </div>
      </div>
    </article>
  );
}