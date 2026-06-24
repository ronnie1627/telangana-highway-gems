export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl text-gradient-gold sm:text-5xl">{value}</div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}