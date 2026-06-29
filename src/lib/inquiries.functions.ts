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