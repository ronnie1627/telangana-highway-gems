import { createFileRoute } from "@tanstack/react-router";
import { EmiCalculator } from "@/components/site/EmiCalculator";

export const Route = createFileRoute("/emi-calculator")({
  component: EmiCalculatorPage,
  head: () => ({
    meta: [
      { title: "EMI Calculator — KK Realtors" },
      { name: "description", content: "Calculate your home loan EMI instantly for plots, villas and farm lands across Telangana. Adjust price, down payment, tenure and interest rate." },
      { property: "og:title", content: "EMI Calculator — KK Realtors" },
      { property: "og:description", content: "Instant EMI estimates for Telangana real estate investments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function EmiCalculatorPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-2xl px-6 lg:px-10">
        <h1 className="font-display text-3xl text-foreground md:text-4xl">
          EMI Calculator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Plan your investment. Adjust the property value, down payment, tenure
          and interest rate to see your monthly EMI.
        </p>
        <div className="mt-8">
          <EmiCalculator />
        </div>
      </div>
    </div>
  );
}
