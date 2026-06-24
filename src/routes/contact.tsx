import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import { InquiryForm } from "@/components/site/InquiryForm";
import { SectionHeader } from "@/components/site/SectionHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KK Realtors — Hyderabad, Telangana" },
      { name: "description", content: "Book a site visit, request property details or chat on WhatsApp. KK Realtors — Hyderabad, Telangana." },
      { property: "og:title", content: "Contact KK Realtors" },
      { property: "og:description", content: "Talk to our advisors about plots, villas, farm lands and gated community homes across Telangana." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <section className="pt-40 pb-16">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gold">Contact</div>
          <h1 className="mt-6 font-display text-5xl leading-tight text-foreground sm:text-6xl">
            Let's find your <span className="text-gradient-gold">next property.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Share your requirement and our advisors will reach out within 24 hours with shortlisted
            options and site visit availability.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 lg:grid-cols-[1.2fr_1fr] lg:px-10">
        <div className="rounded-sm border border-border bg-card p-8 lg:p-12">
          <SectionHeader align="left" eyebrow="Inquiry" title="Tell us what you're looking for." />
          <div className="mt-8">
            <InquiryForm />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-border bg-card p-8">
            <h3 className="font-display text-2xl text-foreground">KK Realtors</h3>
            <p className="mt-2 text-sm text-muted-foreground">Hyderabad, Telangana, India</p>

            <div className="mt-6 space-y-4 text-sm">
              <a href="tel:+919000000000" className="flex items-center gap-3 text-foreground hover:text-gold">
                <span className="grid h-10 w-10 place-items-center rounded-sm border border-gold/40 text-gold"><Phone size={16} /></span>
                +91 90000 00000
              </a>
              <a href="mailto:hello@kkrealtors.in" className="flex items-center gap-3 text-foreground hover:text-gold">
                <span className="grid h-10 w-10 place-items-center rounded-sm border border-gold/40 text-gold"><Mail size={16} /></span>
                hello@kkrealtors.in
              </a>
              <div className="flex items-start gap-3 text-foreground">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-gold/40 text-gold"><MapPin size={16} /></span>
                Hyderabad, Telangana, India
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-[oklch(0.72_0.18_145)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white"
              >
                <MessageCircle size={16} /> WhatsApp Chat
              </a>
              <a
                href="tel:+919000000000"
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-gold/60 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold hover:bg-gold/10"
              >
                <Phone size={16} /> Call Now
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-sm border border-border bg-card">
            <iframe
              title="KK Realtors Location"
              src="https://www.google.com/maps?q=Hyderabad%2C+Telangana%2C+India&output=embed"
              loading="lazy"
              className="h-72 w-full grayscale-[40%]"
            />
          </div>
        </div>
      </section>
    </>
  );
}