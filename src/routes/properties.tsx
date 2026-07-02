import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DBPropertyCard } from "@/components/site/DBPropertyCard";
import { SectionHeader } from "@/components/site/SectionHeader";
import { fetchAvailableProperties } from "@/lib/property-types";

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
  const { data: all = [], isLoading } = useQuery({
    queryKey: ["properties", "available"],
    queryFn: fetchAvailableProperties,
  });

  const [filter, setFilter] = useState<string>("All");
  const [city, setCity] = useState<string>("All");
  const [q, setQ] = useState("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const categories = useMemo(() => {
    const s = new Set<string>(all.map((p) => p.property_type).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [all]);

  const cities = useMemo(() => {
    const s = new Set<string>(all.map((p) => p.city ?? "").filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [all]);

  const list = useMemo(() => {
    return all.filter((p) => {
      if (filter !== "All" && p.property_type !== filter) return false;
      if (city !== "All" && p.city !== city) return false;
      if (q && !`${p.title} ${p.location_label ?? ""} ${p.city ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (maxPrice && p.price != null && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [all, filter, city, q, maxPrice]);

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

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <input
              placeholder="Search title, city or location"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === "All" ? "All Cities" : c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Max price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground">Loading properties…</p>
        ) : list.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No properties match your filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => (
              <DBPropertyCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}