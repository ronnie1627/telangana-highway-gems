import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — KK Realtors" },
      { name: "description", content: "Set a new password for your KK Realtors admin account." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:title", content: "Reset Password — KK Realtors" },
      { property: "og:description", content: "Set a new password for your KK Realtors admin account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return toast.error("Use at least 8 characters");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated — you're signed in");
    navigate({ to: "/admin" });
  };

  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-md rounded-sm border border-border bg-card p-8">
        <h1 className="font-display text-3xl text-foreground">Set a New Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open this page from the reset link in your email, then choose a new password.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">New password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full rounded-sm bg-gradient-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {submitting ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}