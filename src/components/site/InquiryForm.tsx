import { useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/inquiries.functions";

export function InquiryForm({ compact = false }: { compact?: boolean }) {
  const [submitting, setSubmitting] = useState(false);
  const submit = useServerFn(submitInquiry);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSubmitting(true);
    try {
      await submit({
        data: {
          name: String(fd.get("name") || ""),
          phone: String(fd.get("phone") || ""),
          email: String(fd.get("email") || ""),
          budget: String(fd.get("budget") || ""),
          requirement: String(fd.get("requirement") || ""),
          message: String(fd.get("message") || ""),
        },
      });
      form.reset();
      toast.success("Thank you! Our team will reach out within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.error("Could not submit. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <Field name="name" label="Full Name" required />
      <Field name="phone" label="Phone Number" type="tel" required />
      <Field name="email" label="Email" type="email" />
      <BudgetSelect />
      <Field name="requirement" label="Property Requirement" placeholder="e.g. HMDA villa, Shadnagar plot" />
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Message</label>
        <textarea
          name="message"
          rows={4}
          className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
          placeholder="Tell us a little about what you're looking for..."
        />
      </div>
      <div className={compact ? "" : "sm:col-span-2"}>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-sm bg-gradient-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
      />
    </div>
  );
}

function BudgetSelect() {
  const options = [
    "Below ₹20 Lakhs",
    "₹20 - ₹50 Lakhs",
    "₹50 Lakhs - ₹1 Crore",
    "₹1 - ₹3 Crores",
    "₹3 - ₹5 Crores",
    "Above ₹5 Crores",
  ];
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Budget Range
      </label>
      <select
        name="budget"
        className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gold"
        defaultValue=""
      >
        <option value="" disabled>
          Select your budget
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}