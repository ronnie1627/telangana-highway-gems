import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Stat } from "@/components/site/Stat";
import { TrustBadges } from "@/components/site/TrustBadges";
import interior from "@/assets/prop-interior.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KK Realtors — Trusted Telangana Real Estate Partner" },
      { name: "description", content: "KK Realtors helps buyers and investors find affordable, verified real estate opportunities across Telangana's high-growth highway corridors." },
      { property: "og:title", content: "About KK Realtors" },
      { property: "og:description", content: "Customer trust, transparent deals and long-term appreciation — that is the KK Realtors promise." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const pillars = [
  { t: "Customer Trust", d: "Every relationship begins with honesty. We disclose every cost, document and risk up front." },
  { t: "Transparent Deals", d: "Verified titles, clear approvals and full legal support across every transaction." },
  { t: "Highway Corridor Focus", d: "We invest where Telangana is growing — strategic plots along five major highway corridors." },
  { t: "Quality Properties", d: "Only HMDA, DTCP and LRS approved layouts with bank-loan-ready documentation." },
  { t: "Long-term Appreciation", d: "We help you buy assets that grow with Hyderabad's expanding metro footprint." },
  { t: "Loan Support", d: "Tie-ups with leading public and private banks to make ownership effortless." },
];

function About() {
  return (
    <>
      <section className="relative pt-40 pb-20">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">About Us</div>
          <h1 className="mt-6 font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Making property ownership <span className="text-gradient-gold">simple, affordable & profitable.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            KK Realtors helps buyers and investors find affordable and verified real estate opportunities
            across Telangana. We are committed to transparent deals, highway corridor investments and
            long-term value creation.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div className="relative overflow-hidden rounded-sm border border-border">
          <img src={interior} alt="Luxury property interior" loading="lazy" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Our Mission</div>
          <h2 className="mt-4 font-display text-4xl leading-tight text-foreground">
            "Making property ownership simple, affordable, and profitable."
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Real estate has long felt out of reach for many Indian families. We exist to change that.
            By focusing on affordable entry prices along Telangana's highway corridors and supporting
            every buyer with verified documentation and loan facilitation, we put high-growth assets
            within reach of first-time buyers and seasoned investors alike.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
            <Stat value="1200+" label="Plots Sold" />
            <Stat value="70+" label="Locations" />
            <Stat value="10+" label="Years Trust" />
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader eyebrow="Our Pillars" title="What we stand for." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.t} className="rounded-sm border border-border bg-background p-7 transition-colors hover:border-gold">
                <h3 className="font-display text-xl text-foreground">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 lg:px-10">
        <SectionHeader eyebrow="Approvals" title="Verified, financeable, future-ready." />
        <div className="mt-10"><TrustBadges /></div>
      </section>
    </>
  );
}