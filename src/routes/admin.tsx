import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/lib/admin-auth";
import { resolveAssetUrl, storageImageUrl } from "@/lib/asset-url";
import { PROPERTY_TYPES, type DBProperty, type DBPropertyImage } from "@/lib/property-types";
import { LogOut, Plus, Pencil, Trash2, Upload, Star, StarOff, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { heroQuery, ctaQuery, HERO_DEFAULTS, CTA_DEFAULTS, saveSetting, type HeroSettings, type CtaSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — KK Realtors" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminApp,
});

function AdminApp() {
  const auth = useAdminAuth();

  if (auth.loading) {
    return <div className="pt-40 pb-24 text-center text-muted-foreground">Loading…</div>;
  }
  if (!auth.userId || !auth.isAdmin) {
    return <AdminLogin notAdmin={!!auth.userId && !auth.isAdmin} />;
  }
  return <AdminDashboard email={auth.email} />;
}

function AdminLogin({ notAdmin }: { notAdmin: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = mode === "signin"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setSubmitting(false);
    if (error) toast.error(error.message);
    else toast.success(mode === "signin" ? "Signed in" : "Account created — you can now sign in");
  };

  return (
    <div className="pt-40 pb-24">
      <div className="mx-auto max-w-md rounded-sm border border-border bg-card p-8">
        <h1 className="font-display text-3xl text-foreground">{mode === "signin" ? "Admin Login" : "Create Admin Account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Restricted area. Authorised staff only.</p>
        {notAdmin && (
          <p className="mt-3 rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            Your account is signed in but does not have admin access.
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-sm border border-border bg-input/30 px-4 py-3 text-sm outline-none focus:border-gold" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full rounded-sm bg-gradient-gold px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {submitting ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="w-full text-center text-xs text-muted-foreground hover:text-gold">
            {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ email }: { email: string | null }) {
  const [tab, setTab] = useState<"properties" | "inquiries" | "homepage">("properties");
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-gold hover:text-gold"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          {(["properties", "inquiries", "homepage"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2 text-xs uppercase tracking-[0.2em] ${tab === t ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "properties" && <PropertiesTab />}
          {tab === "inquiries" && <InquiriesTab />}
          {tab === "homepage" && <HomepageTab />}
        </div>
      </div>
    </div>
  );
}

function PropertiesTab() {
  const [items, setItems] = useState<DBProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [editing, setEditing] = useState<DBProperty | null>(null);
  const [creating, setCreating] = useState(false);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as DBProperty[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => items.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (q && !`${p.title} ${p.city ?? ""} ${p.property_type}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [items, q, statusFilter]);

  const toggleStatus = async (p: DBProperty) => {
    const newStatus = p.status === "Available" ? "Sold" : "Available";
    const { error } = await supabase.from("properties").update({ status: newStatus }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${newStatus}`);
    reload();
  };
  const toggleFeatured = async (p: DBProperty) => {
    const { error } = await supabase.from("properties").update({ featured: !p.featured }).eq("id", p.id);
    if (error) return toast.error(error.message);
    reload();
  };
  const remove = async (p: DBProperty) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Property deleted");
    reload();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)}
          className="flex-1 rounded-sm border border-border bg-input/30 px-4 py-2.5 text-sm outline-none focus:border-gold" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-sm border border-border bg-input/30 px-4 py-2.5 text-sm outline-none focus:border-gold">
          <option>All</option><option>Available</option><option>Coming Soon</option><option>Sold</option>
        </select>
        <button onClick={() => setCreating(true)}
          className="inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold">
          <Plus size={14} /> Add Property
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">No properties.</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.property_type}</td>
                <td className="p-3">{p.city}</td>
                <td className="p-3">{p.price_display ?? (p.price ? `₹${p.price}` : "-")}</td>
                <td className="p-3">
                  <select
                    value={p.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const { error } = await supabase.from("properties").update({ status: newStatus }).eq("id", p.id);
                      if (error) return toast.error(error.message);
                      toast.success(`Marked ${newStatus}`);
                      reload();
                    }}
                    className={`rounded-sm border border-border bg-transparent px-2 py-1 text-[10px] uppercase tracking-wider ${p.status === "Sold" ? "text-destructive" : p.status === "Coming Soon" ? "text-gold" : "text-emerald-500"}`}
                  >
                    <option>Available</option>
                    <option>Coming Soon</option>
                    <option>Sold</option>
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => toggleFeatured(p)} className="text-gold" title={p.featured ? "Unfeature" : "Feature"}>
                    {p.featured ? <Star size={16} fill="currentColor" /> : <StarOff size={16} />}
                  </button>
                </td>
                <td className="p-3 text-right">
                  <div className="inline-flex gap-1">
                    <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-gold hover:text-gold" title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(p)} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-destructive hover:text-destructive" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <PropertyEditor
          property={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); reload(); }}
        />
      )}
    </div>
  );
}

type FormState = {
  slug: string; title: string; description: string; property_type: string;
  status: string; price: string; price_display: string; area_sqft: string;
  address: string; city: string; state: string; pincode: string;
  google_maps_url: string; amenities: string; approvals: string;
  featured: boolean; highlight: string; location_label: string; cover_image: string;
};

function toForm(p: DBProperty | null): FormState {
  return {
    slug: p?.slug ?? "",
    title: p?.title ?? "",
    description: p?.description ?? "",
    property_type: p?.property_type ?? "Open Plots",
    status: p?.status ?? "Available",
    price: p?.price != null ? String(p.price) : "",
    price_display: p?.price_display ?? "",
    area_sqft: p?.area_sqft != null ? String(p.area_sqft) : "",
    address: p?.address ?? "",
    city: p?.city ?? "",
    state: p?.state ?? "Telangana",
    pincode: p?.pincode ?? "",
    google_maps_url: p?.google_maps_url ?? "",
    amenities: (p?.amenities ?? []).join("\n"),
    approvals: (p?.approvals ?? []).join(", "),
    featured: !!p?.featured,
    highlight: p?.highlight ?? "",
    location_label: p?.location_label ?? "",
    cover_image: p?.cover_image ?? "",
  };
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function PropertyEditor({ property, onClose, onSaved }: { property: DBProperty | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<FormState>(toForm(property));
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<DBPropertyImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const isEdit = !!property;

  useEffect(() => {
    if (!property) return;
    supabase.from("property_images").select("*").eq("property_id", property.id).order("sort_order")
      .then(({ data }) => setImages((data as DBPropertyImage[]) ?? []));
  }, [property]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      slug: form.slug || slugify(form.title),
      title: form.title,
      description: form.description || null,
      property_type: form.property_type,
      status: form.status,
      price: form.price ? Number(form.price) : null,
      price_display: form.price_display || null,
      area_sqft: form.area_sqft ? Number(form.area_sqft) : null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      pincode: form.pincode || null,
      google_maps_url: form.google_maps_url || null,
      amenities: form.amenities.split("\n").map((s) => s.trim()).filter(Boolean),
      approvals: form.approvals.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      highlight: form.highlight || null,
      location_label: form.location_label || null,
      cover_image: form.cover_image || null,
    };

    let result;
    if (isEdit) {
      result = await supabase.from("properties").update(payload).eq("id", property!.id);
    } else {
      result = await supabase.from("properties").insert(payload);
    }
    setSaving(false);
    if (result.error) return toast.error(result.error.message);
    toast.success(isEdit ? "Property updated" : "Property created");
    onSaved();
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || !property) return;
    setUploading(true);
    const currentLastOrder = images.at(-1)?.sort_order ?? 0;
    let firstUploadedUrl = "";
    for (const [index, file] of Array.from(files).entries()) {
      const path = `properties/${property.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("property-images").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      // Store the bare storage path (not the proxy URL) so storage read policies match.
      const imageUrl = path;
      if (!firstUploadedUrl) firstUploadedUrl = imageUrl;
      const { error: insErr } = await supabase.from("property_images").insert({
        property_id: property.id, url: imageUrl, sort_order: currentLastOrder + index + 1,
      });
      if (insErr) toast.error(insErr.message);
    }
    if (firstUploadedUrl && !form.cover_image) {
      const { error } = await supabase.from("properties").update({ cover_image: firstUploadedUrl }).eq("id", property.id);
      if (!error) set("cover_image", firstUploadedUrl);
    }
    const { data } = await supabase.from("property_images").select("*").eq("property_id", property.id).order("sort_order");
    setImages((data as DBPropertyImage[]) ?? []);
    setUploading(false);
  };

  const removeImage = async (img: DBPropertyImage) => {
    const { error } = await supabase.from("property_images").delete().eq("id", img.id);
    if (error) return toast.error(error.message);
    setImages((imgs) => imgs.filter((i) => i.id !== img.id));
  };

  const setAsCover = async (img: DBPropertyImage) => {
    if (!property) return;
    const { error } = await supabase.from("properties").update({ cover_image: img.url }).eq("id", property.id);
    if (error) return toast.error(error.message);
    set("cover_image", img.url);
    toast.success("Cover image updated");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
      <div className="mx-auto my-8 max-w-3xl rounded-sm border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{isEdit ? "Edit Property" : "Add Property"}</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-sm border border-border"><X size={16} /></button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Title *"><input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto from title" className={inputCls} /></Field>
          <Field label="Property Type">
            <select value={form.property_type} onChange={(e) => set("property_type", e.target.value)} className={inputCls}>
              {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              <option>Available</option><option>Coming Soon</option><option>Sold</option>
            </select>
          </Field>
          <Field label="Price (₹, numeric)"><input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} /></Field>
          <Field label="Price Display"><input value={form.price_display} onChange={(e) => set("price_display", e.target.value)} placeholder="₹ 13,999 / sq.yd" className={inputCls} /></Field>
          <Field label="Area (sq ft)"><input type="number" value={form.area_sqft} onChange={(e) => set("area_sqft", e.target.value)} className={inputCls} /></Field>
          <Field label="Highlight Badge"><input value={form.highlight} onChange={(e) => set("highlight", e.target.value)} placeholder="e.g. HMDA Approved" className={inputCls} /></Field>
          <Field label="City"><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} /></Field>
          <Field label="State"><input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls} /></Field>
          <Field label="Pincode"><input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} className={inputCls} /></Field>
          <Field label="Location Label"><input value={form.location_label} onChange={(e) => set("location_label", e.target.value)} placeholder="e.g. Amangal, Srisailam Highway" className={inputCls} /></Field>
          <Field label="Address" span2><input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} /></Field>
          <Field label="Google Maps URL / query" span2><input value={form.google_maps_url} onChange={(e) => set("google_maps_url", e.target.value)} placeholder="Full embed URL or place query" className={inputCls} /></Field>
          <Field label="Approvals (comma-separated)" span2><input value={form.approvals} onChange={(e) => set("approvals", e.target.value)} placeholder="HMDA, DTCP, LRS" className={inputCls} /></Field>
          <Field label="Amenities (one per line)" span2>
            <textarea rows={4} value={form.amenities} onChange={(e) => set("amenities", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Description" span2>
            <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Cover Image URL" span2>
            <input value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="Upload below or paste URL" className={inputCls} />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} />
            Mark as Featured
          </label>
        </div>

        {isEdit && (
          <div className="mt-8 border-t border-border pt-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg">Images</h3>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-gold hover:text-gold">
                <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => uploadImages(e.target.files)} />
              </label>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-sm border border-border">
                  <img src={resolveAssetUrl(img.url)} alt="" className="h-28 w-full object-cover" />
                  <div className="absolute inset-0 hidden items-end justify-between gap-1 bg-black/60 p-2 group-hover:flex">
                    <button onClick={() => setAsCover(img)} className="rounded-sm bg-background/80 px-2 py-1 text-[10px]">Set cover</button>
                    <button onClick={() => removeImage(img)} className="rounded-sm bg-destructive/80 px-2 py-1 text-[10px] text-destructive-foreground"><Trash2 size={12} /></button>
                  </div>
                </div>
              ))}
              {images.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No images yet.</p>}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-sm border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em]">Cancel</button>
          <button onClick={save} disabled={saving}
            className="rounded-sm bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Property"}
          </button>
        </div>
        {!isEdit && (
          <p className="mt-2 text-right text-[11px] text-muted-foreground">Save the property first, then reopen it to upload images.</p>
        )}
      </div>
    </div>
  );
}

const inputCls = "mt-2 w-full rounded-sm border border-border bg-input/30 px-3 py-2.5 text-sm outline-none focus:border-gold";

function Field({ label, children, span2 }: { label: string; children: React.ReactNode; span2?: boolean }) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function InquiriesTab() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  const filtered = rows.filter((r) =>
    !q || `${r.name} ${r.phone} ${r.email ?? ""} ${r.property_title ?? ""} ${r.requirement ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <input placeholder="Search inquiries…" value={q} onChange={(e) => setQ(e.target.value)}
        className="w-full rounded-sm border border-border bg-input/30 px-4 py-2.5 text-sm outline-none focus:border-gold" />
      <div className="mt-4 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No inquiries.</p>
        ) : filtered.map((r) => (
          <div key={r.id} className="rounded-sm border border-border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{r.name} <span className="text-muted-foreground">· {r.phone}</span></p>
                {r.email && <p className="text-xs text-muted-foreground">{r.email}</p>}
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
            </div>
            {r.property_title && <p className="mt-2 text-xs text-gold">Property: {r.property_title}</p>}
            {r.budget && <p className="mt-1 text-xs text-muted-foreground">Budget: {r.budget}</p>}
            {r.requirement && <p className="mt-1 text-xs text-muted-foreground">Requirement: {r.requirement}</p>}
            {r.message && <p className="mt-2 whitespace-pre-line text-sm text-foreground">{r.message}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HomepageTab() {
  const qc = useQueryClient();
  const { data: hero } = useQuery(heroQuery);
  const { data: cta } = useQuery(ctaQuery);
  const [h, setH] = useState<HeroSettings>(hero ?? HERO_DEFAULTS);
  const [c, setC] = useState<CtaSettings>(cta ?? CTA_DEFAULTS);
  const [savingHero, setSavingHero] = useState(false);
  const [savingCta, setSavingCta] = useState(false);

  useEffect(() => { if (hero) setH(hero); }, [hero]);
  useEffect(() => { if (cta) setC(cta); }, [cta]);

  const saveHero = async () => {
    setSavingHero(true);
    try {
      await saveSetting("hero", h);
      await qc.invalidateQueries({ queryKey: ["site_settings", "hero"] });
      toast.success("Hero section updated");
    } catch (e: any) { toast.error(e.message ?? "Save failed"); }
    setSavingHero(false);
  };
  const saveCta = async () => {
    setSavingCta(true);
    try {
      await saveSetting("cta", c);
      await qc.invalidateQueries({ queryKey: ["site_settings", "cta"] });
      toast.success("Call-to-action updated");
    } catch (e: any) { toast.error(e.message ?? "Save failed"); }
    setSavingCta(false);
  };

  const setH_ = <K extends keyof HeroSettings>(k: K, v: HeroSettings[K]) => setH((s) => ({ ...s, [k]: v }));
  const setC_ = <K extends keyof CtaSettings>(k: K, v: CtaSettings[K]) => setC((s) => ({ ...s, [k]: v }));

  return (
    <div className="space-y-10">
      <section className="rounded-sm border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Hero Section</h2>
          <button onClick={saveHero} disabled={savingHero}
            className="rounded-sm bg-gradient-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {savingHero ? "Saving…" : "Save Hero"}
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" span2><input value={h.eyebrow} onChange={(e) => setH_("eyebrow", e.target.value)} className={inputCls} /></Field>
          <Field label="Title — lead"><input value={h.title_lead} onChange={(e) => setH_("title_lead", e.target.value)} className={inputCls} /></Field>
          <Field label="Title — highlight (gold)"><input value={h.title_highlight} onChange={(e) => setH_("title_highlight", e.target.value)} className={inputCls} /></Field>
          <Field label="Title — trailing text" span2><input value={h.title_trail} onChange={(e) => setH_("title_trail", e.target.value)} className={inputCls} /></Field>
          <Field label="Subtitle" span2><textarea rows={4} value={h.subtitle} onChange={(e) => setH_("subtitle", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 1 — value"><input value={h.stat1_value} onChange={(e) => setH_("stat1_value", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 1 — label"><input value={h.stat1_label} onChange={(e) => setH_("stat1_label", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 2 — value"><input value={h.stat2_value} onChange={(e) => setH_("stat2_value", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 2 — label"><input value={h.stat2_label} onChange={(e) => setH_("stat2_label", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 3 — value"><input value={h.stat3_value} onChange={(e) => setH_("stat3_value", e.target.value)} className={inputCls} /></Field>
          <Field label="Stat 3 — label"><input value={h.stat3_label} onChange={(e) => setH_("stat3_label", e.target.value)} className={inputCls} /></Field>
        </div>
      </section>

      <section className="rounded-sm border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Call-to-Action Section</h2>
          <button onClick={saveCta} disabled={savingCta}
            className="rounded-sm bg-gradient-gold px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {savingCta ? "Saving…" : "Save CTA"}
          </button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" span2><input value={c.eyebrow} onChange={(e) => setC_("eyebrow", e.target.value)} className={inputCls} /></Field>
          <Field label="Title" span2><input value={c.title} onChange={(e) => setC_("title", e.target.value)} className={inputCls} /></Field>
          <Field label="Subtitle" span2><textarea rows={3} value={c.subtitle} onChange={(e) => setC_("subtitle", e.target.value)} className={inputCls} /></Field>
        </div>
      </section>
    </div>
  );
}