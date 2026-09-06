import { useEffect, useMemo, useState } from "react";
import { Calculator, Info } from "lucide-react";

export function EmiCalculator({
  propertyPrice,
  title,
}: {
  propertyPrice?: number | null;
  title?: string;
}) {
  const [price, setPrice] = useState(propertyPrice ?? 0);
  const [downPayment, setDownPayment] = useState(0);
  const [tenure, setTenure] = useState(10);
  const [rate, setRate] = useState(9.5);

  useEffect(() => {
    if (propertyPrice && propertyPrice > 0) {
      setPrice(propertyPrice);
      setDownPayment(Math.round(propertyPrice * 0.2));
    }
  }, [propertyPrice]);

  const { emi, totalInterest, totalPayable, loanAmount } = useMemo(() => {
    const principal = Math.max(0, price - downPayment);
    const monthlyRate = Math.max(0, rate) / 12 / 100;
    const months = Math.max(0, tenure) * 12;

    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: 0, loanAmount: principal };
    }

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayable = emi * months;

    return {
      emi,
      totalInterest: totalPayable - principal,
      totalPayable,
      loanAmount: principal,
    };
  }, [price, downPayment, tenure, rate]);

  const fmt = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="rounded-sm border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Calculator size={18} className="text-gold" />
        <h3 className="font-display text-xl text-foreground">EMI Calculator</h3>
      </div>
      {title && (
        <p className="mt-1 truncate text-sm text-muted-foreground">{title}</p>
      )}

      <div className="mt-5 space-y-4">
        <NumberField
          label="Property Price"
          value={price}
          onChange={setPrice}
          min={0}
          step={1000}
        />
        <NumberField
          label="Down Payment"
          value={downPayment}
          onChange={setDownPayment}
          min={0}
          step={1000}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Loan Tenure
            </label>
            <select
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
            >
              {Array.from({ length: 16 }, (_, i) => i + 5).map((years) => (
                <option key={years} value={years}>
                  {years} Years
                </option>
              ))}
            </select>
          </div>

          <NumberField
            label="Interest Rate (% p.a.)"
            value={rate}
            onChange={setRate}
            min={0}
            max={30}
            step={0.1}
          />
        </div>
      </div>

      <div className="mt-6 space-y-3 rounded-sm bg-background/50 p-4">
        <ResultRow label="Loan Amount" value={fmt(loanAmount)} />
        <ResultRow label="EMI / Month" value={fmt(emi)} highlight />
        <ResultRow label="Total Interest Payable" value={fmt(totalInterest)} />
        <ResultRow label="Total Payment" value={fmt(totalPayable)} />
      </div>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <Info size={14} className="mt-0.5 shrink-0 text-gold" />
        This is an indicative estimate only. Actual EMI depends on bank
        approval, eligibility, processing fees, and prevailing rates.
      </p>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-gold" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
