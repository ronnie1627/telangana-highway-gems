import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Building2, Banknote, MapPinned, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Stat } from "@/components/site/Stat";
import highway from "@/assets/prop-highway.jpg";

export const Route = createFileRoute("/investors")({
  head: () => ({
    meta: [
      { title: "Investors — Telangana Real Estate Growth Corridors | KK Realtors" },
      { name: "description", content: "Invest in Telangana's fastest-growing highway corridors. Mumbai, Bangalore, Vijayawada and Srisailam — affordable entry prices, long-term ROI potential." },
      { property: "og:title", content: "Invest in Telangana's Future Growth" },
      { property: "og:description", content: "Highway corridor appreciation, infrastructure development and growing demand — KK Realtors helps you enter early." },
      { property: "og:url", content: "/investors" },
    ],
    links: [{ rel: "canonical", href: "/investors" }],
  }),
  component: Investors,
});

const drivers = [
  { icon: TrendingUp, t: "Highway Corridor Appreciation", d: "Land values along Hyderabad's five major corridors have consistently outperformed metro averages." },
  { icon: Building2, t: "Infrastructure Development", d: "Metro expansion, ring roads and industrial parks are reshaping the demand map of Telangana." },
  { icon: MapPinned, t: "Growing Demand", d: "Hyderabad's IT, pharma and aviation footprint is fueling demand for plots, villas and farm lands." },
  { icon: Banknote, t: "Affordable Entry Prices", d: "Get in early at corridor prices that are still a fraction of central Hyderabad — with full loan support." },
];

const corridors = [
  { name: "Mumbai Highway", d: "Western corridor with Budhera, Zaheerabad and Sangareddy growth pockets." },
  { name: "Bangalore Highway", d: "Southern IT corridor with Shadnagar and Kothur emerging as top investment zones." },
  { name: "Vijayawada Highway", d: "Eastern corridor lined with HMDA villa communities and premium gated layouts." },
  { name: "Srisailam Highway", d: "Scenic southern stretch with farm lands and weekend home opportunities." },
  { name: "Warangal Highway", d: "Eastern growth route connecting Hyderabad to Warangal with rising industrial and residential demand." },
];

function Investors() {
  return (
    <>
      <section className="relative isolate overflow-hidden pt-40 pb-24">
        <img src={highway} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Investors</div>
          <h1 className="mt-6 font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Invest in <span className="text-gradient-gold">Telangana's future growth.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Strategic land assets along the Mumbai, Bangalore, Vijayawada and Srisailam corridors —
            engineered for long-term appreciation, ready infrastructure and bank-loan support.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-border pt-8">
            <Stat value="3-5x" label="Avg. 5-yr ROI" />
            <Stat value="₹6.9L+" label="Entry Price" />
            <Stat value="5" label="Growth Corridors" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <SectionHeader eyebrow="Why Telangana" title="Four growth drivers, one window of opportunity." />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {drivers.map((d) => (
            <div key={d.t} className="rounded-sm border border-border bg-card p-7 transition-all hover:border-gold hover:shadow-luxe">
              <d.icon size={28} className="text-gold" />
              <h3 className="mt-5 font-display text-xl text-foreground">{d.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader eyebrow="Corridors" title="Where we invest." />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {corridors.map((c) => (
              <div key={c.name} className="group flex items-start gap-6 rounded-sm border border-border bg-background p-7 transition-colors hover:border-gold">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-gradient-gold text-primary-foreground">
                  <MapPinned size={20} />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-gold">{c.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-10">
        <h2 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
          Ready to invest in Telangana's growth story?
        </h2>
        <p className="mt-5 text-muted-foreground">
          Speak with an investment advisor for a personalised corridor report and shortlist.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
        >
          Talk To An Advisor <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}