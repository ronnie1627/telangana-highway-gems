import { useState } from "react";
import { toast } from "sonner";

export function InquiryForm({ compact = false }: { compact?: boolean }) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thank you! Our team will reach out within 24 hours.");
    }, 700);
  };

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <Field name="name" label="Full Name" required />
      <Field name="phone" label="Phone Number" type="tel" required />
      <Field name="email" label="Email" type="email" />
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