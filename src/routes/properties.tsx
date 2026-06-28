import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { properties } from "@/data/properties";
import { PropertyCard } from "@/components/site/PropertyCard";
import { SectionHeader } from "@/components/site/SectionHeader";

const categories = ["All", "Open Plots", "Villas & Plots", "Farm Land", "Gated Community"] as const;

export const Route = createFileRoute("/properties")({
  head: () => ({
    meta: [
      { title: "Properties — Open Plots, Villas, Farm Lands | KK Realtors" },
      { name: "description", content: "Browse low-budget open plots, HMDA approved villas, farm lands and gated community homes across Telangana's Mumbai, Bangalore, Vijayawada, Srisailam and Warangal highways." },
      { property: "og:title", content: "KK Realtors Properties" },
      { property: "og:description", content: "Verified, financeable, high-growth properties across Telangana." },
      { property: "og:url", content: "/properties" },
    ],
    links: [{ rel: "canonical", href: "/properties" }],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const list = useMemo(
    () => (filter === "All" ? properties : properties.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <>
      <section className="pt-40 pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeader
            align="left"
            eyebrow="Properties"
            title="The full collection."
            subtitle="Filter by category to find low-budget open plots, premium HMDA villas, farm lands or lake-view gated community homes."
          />

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-sm border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                  filter === c
                    ? "border-gold bg-gradient-gold text-primary-foreground shadow-gold"
                    : "border-border text-muted-foreground hover:border-gold hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}