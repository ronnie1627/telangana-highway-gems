import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Compass, FileCheck2, Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero-estate.jpg";
import { properties, testimonials } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { DBPropertyCard } from "@/components/site/DBPropertyCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DBProperty } from "@/lib/property-types";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Stat } from "@/components/site/Stat";
import { TrustBadges } from "@/components/site/TrustBadges";
import { VideoGallery } from "@/components/site/VideoGallery";
import { InquiryForm } from "@/components/site/InquiryForm";
import { heroQuery, ctaQuery, HERO_DEFAULTS, CTA_DEFAULTS } from "@/lib/site-settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KK Realtors — Affordable Open Plots, Villas & Farm Lands in Telangana" },
      { name: "description", content: "Low budget open plots, HMDA approved villas, farm lands and gated community homes across Hyderabad and Telangana's high-growth highway corridors." },
      { property: "og:title", content: "KK Realtors — Telangana's Trusted Real Estate Partner" },
      { property: "og:description", content: "1200+ plots sold across 70+ locations. DTCP, LRS and HMDA approved properties on Mumbai, Bangalore, Vijayawada and Srisailam highways." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <FeaturedBand />
      <Featured />
      <VideoGallery />
      <HowItWorks />
      <Corridors />
      <Trust />
      <Testimonials />
      <CtaBlock />
    </>
  );
}

function Hero() {
  const { data: h = HERO_DEFAULTS } = useQuery(heroQuery);
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <img
        src={hero}
        alt="Luxury Telangana real estate"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/60 to-ink" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.12_0.010_60/0.6)_80%)]" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 lg:px-10">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-card/40 px-3 py-1.5 backdrop-blur">
            <Sparkles size={12} className="text-gold" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-soft">
              {h.eyebrow}
            </span>
          </div>

          <h1 className="mt-8 font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
            {h.title_lead}{" "}
            <span className="text-gradient-gold">{h.title_highlight}</span>{" "}
            {h.title_trail}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {h.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/properties"
              className="group inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
            >
              View Properties <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-gold/60 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold/10"
            >
              Book Site Visit
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-foreground transition-colors hover:border-foreground"
            >
              Contact Us Now
            </Link>
          </div>

          <div className="mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-8">
            <Stat value={h.stat1_value} label={h.stat1_label} />
            <Stat value={h.stat2_value} label={h.stat2_label} />
            <Stat value={h.stat3_value} label={h.stat3_label} />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedBand() {
  const items = [
    { icon: BadgeCheck, text: "Limited Plots Available" },
    { icon: Sparkles, text: "Best Price Guaranteed" },
    { icon: FileCheck2, text: "\u00a0HMDA ·\u00a0DTCP ·\u00a0LRS\u00a0Approved" },
    { icon: Compass, text: "Highway Corridor Investments" },
  ];
  return (
    <div className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4 lg:px-10">
        {items.map((i) => (
          <div key={i.text} className="flex items-center gap-3 text-sm text-foreground">
            <i.icon size={18} className="text-gold" />
            {i.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
      <div className="space-y-4 p-6">
        <div className="h-5 w-3/4 animate-pulse rounded-sm bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded-sm bg-muted" />
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-sm bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded-sm bg-muted" />
        </div>
        <div className="h-10 w-full animate-pulse rounded-sm bg-muted" />
      </div>
    </div>
  );
}

function Featured() {
  const { data: featured = [], isPending, isError } = useQuery({
    queryKey: ["properties", "featured"],
    queryFn: () => fetchFeaturedProperties(6),
    staleTime: 60_000,
  });

  const fallback = properties.slice(0, 3);
  const showFallback = isError && fallback.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
        <SectionHeader
          align="left"
          eyebrow="Featured Listings"
          title="Hand-picked properties at exceptional value."
          subtitle="From low-budget open plots to HMDA approved villas — every listing is verified, financeable and ready for site visit."
        />
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isPending ? (
          Array.from({ length: 3 }).map((_, i) => <FeaturedSkeleton key={i} />)
        ) : showFallback ? (
          fallback.map((p) => <PropertyCard key={p.id} p={p} />)
        ) : featured.length > 0 ? (
          featured.slice(0, 3).map((p) => <DBPropertyCard key={p.id} p={p} />)
        ) : (
          <div className="col-span-full rounded-sm border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <p className="font-display text-xl text-foreground">No featured properties right now</p>
            <p className="mt-2 text-sm text-muted-foreground">
              New verified plots, villas and farm lands are added regularly — browse the full catalogue meanwhile.
            </p>
            <Link
              to="/properties"
              className="mt-6 inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground"
            >
              View All Properties <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}


function HowItWorks() {
  const steps = [
    { n: "01", t: "Choose Your Property", d: "Browse our curated catalogue of open plots, villas, farm lands and gated community homes." },
    { n: "02", t: "Site Visit & Verification", d: "Visit the location with our team and inspect approvals, layouts and infrastructure first-hand." },
    { n: "03", t: "Secure Your Investment", d: "Complete documentation with full legal support and proudly own a high-growth Telangana asset." },
  ];
  return (
    <section className="relative border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeader
          eyebrow="How It Works"
          title="Three steps to owning a Telangana property."
          subtitle="Transparent, guided and obligation-free — designed for first-time buyers and seasoned investors alike."
        />
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="group relative rounded-sm border border-border bg-background p-8 transition-all hover:border-gold hover:shadow-luxe">
              <div className="font-display text-6xl text-gradient-gold">{s.n}</div>
              <h3 className="mt-4 font-display text-2xl text-foreground">{s.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              <div className="hairline mt-6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Corridors() {
  const corridors = [
    { name: "Mumbai Highway", points: "Budhera · Zaheerabad" },
    { name: "Bangalore Highway", points: "Shadnagar · Kothur" },
    { name: "Vijayawada Highway", points: "HMDA Villa Communities" },
    { name: "Srisailam Highway", points: "Premium Plots & Farms" },
    { name: "Warangal Highway", points: "Emerging Growth Corridor" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="Highway Corridors"
        title="Invest where Telangana is growing fastest."
        subtitle="Strategic locations along Hyderabad's five major highway corridors — proven appreciation, ready infrastructure."
      />
      <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {corridors.map((c) => (
          <div key={c.name} className="group cursor-default bg-card p-8 transition-colors hover:bg-card/60">
            <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Corridor</div>
            <h3 className="mt-3 font-display text-2xl text-foreground transition-colors group-hover:text-gold">{c.name}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{c.points}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="border-y border-border bg-card/30 py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <SectionHeader eyebrow="Trust & Transparency" title="Every listing, verified end-to-end." />
        <div className="mt-10">
          <TrustBadges />
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const five = testimonials.slice(0, 6);
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <SectionHeader
        eyebrow="Customer Stories"
        title="What our buyers and investors say."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {five.map((t) => (
          <figure key={t.name} className="rounded-sm border border-border bg-card p-7 transition-colors hover:border-gold/60">
            <div className="flex gap-0.5 text-gold">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-relaxed text-foreground">{t.text}</blockquote>
            <figcaption className="mt-5 text-xs uppercase tracking-[0.2em] text-muted-foreground">— {t.name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/about" className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Read more →</Link>
      </div>
    </section>
  );
}

function CtaBlock() {
  const { data: c = CTA_DEFAULTS } = useQuery(ctaQuery);
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
      <div className="grid gap-10 rounded-sm border border-gold/40 bg-card p-10 shadow-luxe lg:grid-cols-2 lg:p-16">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">{c.eyebrow}</div>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
            {c.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {c.subtitle}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6">
            <Stat value="24h" label="Response Time" />
            <Stat value="0%" label="Brokerage" />
          </div>
        </div>
        <InquiryForm compact />
      </div>
    </section>
  );
}
