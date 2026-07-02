import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  requirement?: string;
  message?: string;
  propertyId?: string | null;
  propertyTitle?: string | null;
};

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: InquiryInput) => {
    if (!data?.name || data.name.trim().length === 0) throw new Error("Name is required");
    if (!data?.phone || data.phone.trim().length === 0) throw new Error("Phone is required");
    return {
      name: data.name.trim().slice(0, 100),
      phone: data.phone.trim().slice(0, 30),
      email: data.email?.trim().slice(0, 200) || null,
      budget: data.budget?.trim().slice(0, 100) || null,
      requirement: data.requirement?.trim().slice(0, 500) || null,
      message: data.message?.trim().slice(0, 2000) || null,
      property_id: data.propertyId?.trim() || null,
      property_title: data.propertyTitle?.trim().slice(0, 200) || null,
    };
  })
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { error } = await supabase.from("inquiries").insert(data);
    if (error) {
      console.error("inquiry insert failed", error);
      throw new Error("Failed to save inquiry");
    }

    // Optional email notification via Resend if configured
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const html = `
          <h2>New Website Inquiry — KK Realtors</h2>
          ${data.property_title ? `<p><strong>Property:</strong> ${escapeHtml(data.property_title)}</p>` : ""}
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
          ${data.email ? `<p><strong>Email:</strong> ${escapeHtml(data.email)}</p>` : ""}
          ${data.budget ? `<p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>` : ""}
          ${data.requirement ? `<p><strong>Requirement:</strong> ${escapeHtml(data.requirement)}</p>` : ""}
          ${data.message ? `<p><strong>Message:</strong><br/>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>` : ""}
        `;
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.INQUIRY_FROM_EMAIL || "KK Realtors <onboarding@resend.dev>",
            to: ["KKrealtors02@gmail.com"],
            reply_to: data.email || undefined,
            subject: data.property_title
              ? `New inquiry — ${data.property_title}`
              : "New inquiry from KK Realtors website",
            html,
          }),
        });
      } catch (e) {
        console.error("email notify failed (inquiry still saved)", e);
      }
    }

    return { ok: true };
  });

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}