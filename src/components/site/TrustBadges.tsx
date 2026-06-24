import { ShieldCheck } from "lucide-react";

const badges = [
  "HMDA Approved Properties",
  "DTCP Approved Layouts",
  "LRS Available Properties",
  "Loan Available",
  "Verified Documentation",
  "1200+ Successful Plot Sales",
  "50+ Locations Covered",
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {badges.map((b) => (
        <span
          key={b}
          className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-card/40 px-4 py-2 text-xs font-medium text-foreground backdrop-blur"
        >
          <ShieldCheck size={14} className="text-gold" /> {b}
        </span>
      ))}
    </div>
  );
}