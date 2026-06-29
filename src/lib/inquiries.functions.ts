import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

export type InquiryInput = {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  requirement?: string;
  message?: string;
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

    // Send email notification to the team (best-effort; requires email domain setup)
    try {
      const { sendLovableEmail } = await import("@lovable.dev/email-js");
      await sendLovableEmail({
        to: "kkrealtors02@gmail.com",
        subject: `New Inquiry from ${data.name}`,
        html: `
          <h2>New Property Inquiry — KK Realtors</h2>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(data.email || "—")}</p>
          <p><strong>Budget:</strong> ${escapeHtml(data.budget || "—")}</p>
          <p><strong>Requirement:</strong> ${escapeHtml(data.requirement || "—")}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(data.message || "—").replace(/\n/g, "<br/>")}</p>
        `,
      });
    } catch (err) {
      console.warn("Email notification skipped:", (err as Error)?.message);
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