import type { DBProperty } from "@/lib/property-types";

export type Corridor = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  points: string[];
  /** Lowercase keywords matched against a property's location/title/city. */
  keywords: string[];
};

export const CORRIDORS: Corridor[] = [
  {
    slug: "mumbai-highway",
    name: "Mumbai Highway",
    tagline: "Western growth corridor",
    description:
      "The NH-65 western corridor through Budhera, Sangareddy and Zaheerabad — industrial parks, ORR connectivity and some of the most affordable entry prices around Hyderabad.",
    points: ["Budhera", "Sangareddy", "Zaheerabad", "Patancheru"],
    keywords: ["mumbai", "budhera", "zaheerabad", "sangareddy", "patancheru"],
  },
  {
    slug: "bangalore-highway",
    name: "Bangalore Highway",
    tagline: "Southern IT & aerospace corridor",
    description:
      "NH-44 south towards Shadnagar and Kothur — the airport, Amazon and Fab City belt, with HMDA approved layouts and villa plots ready for construction.",
    points: ["Shadnagar", "Kothur", "Burgula", "Nagulapally"],
    keywords: ["bangalore", "shadnagar", "kothur", "burgula", "nagulapally", "brindavanam"],
  },
  {
    slug: "vijayawada-highway",
    name: "Vijayawada Highway",
    tagline: "Eastern villa corridor",
    description:
      "NH-65 east through Ghatkesar and Choutuppal — HMDA villa communities, premium gated layouts and fast-moving infrastructure.",
    points: ["Ghatkesar", "Choutuppal", "Bhongir", "Pantangi"],
    keywords: ["vijayawada", "ghatkesar", "choutuppal", "bhongir", "pantangi"],
  },
  {
    slug: "srisailam-highway",
    name: "Srisailam Highway",
    tagline: "Future City & farmland belt",
    description:
      "The Future City corridor towards Amangal and Dindi — nature-friendly gated plot ventures, resort farmlands and low entry prices with high appreciation potential.",
    points: ["Amangal", "Kongarakalan", "Future City", "Dindi"],
    keywords: ["srisailam", "amangal", "dindi", "kongarakalan", "future city", "bilva", "green homes"],
  },
  {
    slug: "warangal-highway",
    name: "Warangal Highway",
    tagline: "Emerging north-east corridor",
    description:
      "NH-163 towards Bibinagar and Keesaragutta — anchored by AIIMS Bibinagar, with HMDA open plots on black-top roads inside gated layouts.",
    points: ["Keesaragutta", "Bibinagar", "Near AIIMS", "Ghatkesar"],
    keywords: ["warangal", "keesaragutta", "kesaraguta", "bibinagar", "aiims"],
  },
];

export function corridorBySlug(slug: string): Corridor | undefined {
  return CORRIDORS.find((c) => c.slug === slug);
}

export function propertyMatchesCorridor(p: Pick<DBProperty, "title" | "location_label" | "address" | "city">, c: Corridor) {
  const haystack = [p.title, p.location_label, p.address, p.city]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return c.keywords.some((k) => haystack.includes(k));
}
