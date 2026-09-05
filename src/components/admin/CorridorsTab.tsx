import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveAssetUrl } from "@/lib/asset-url";
import type { DBCorridor, DBCorridorImage } from "@/lib/corridor-types";
import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";

const inputCls =
  "mt-2 w-full rounded-sm border border-border bg-input/30 px-3 py-2.5 text-sm outline-none focus:border-gold";

export function CorridorsTab() {
  const [corridors, setCorridors] = useState<DBCorridor[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase.from("corridors").select("*").order("sort_order");
    if (error) toast.error(error.message);
    const rows = (data as DBCorridor[]) ?? [];
    setCorridors(rows);
    setActiveId((id) => id ?? rows[0]?.id ?? null);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const active = corridors.find((c) => c.id === activeId) ?? null;

  if (loading) return <p className="text-sm text-muted-foreground">Loading corridors…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div className="flex flex-wrap gap-2 lg:flex-col">
        {corridors.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveId(c.id)}
            className={`rounded-sm border px-4 py-2.5 text-left text-xs uppercase tracking-[0.15em] ${
              c.id === activeId ? "border-gold text-gold" : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
      {active && <CorridorEditor key={active.id} corridor={active} onSaved={load} />}
    </div>
  );
}

function CorridorEditor({ corridor, onSaved }: { corridor: DBCorridor; onSaved: () => void }) {
  const [tagline, setTagline] = useState(corridor.tagline ?? "");
  const [description, setDescription] = useState(corridor.description ?? "");
  const [published, setPublished] = useState(corridor.published);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<DBCorridorImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadImages = async () => {
    const { data } = await supabase
      .from("corridor_images").select("*").eq("corridor_id", corridor.id).order("sort_order");
    setImages((data as DBCorridorImage[]) ?? []);
  };
  useEffect(() => { loadImages(); }, [corridor.id]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("corridors")
      .update({ tagline: tagline || null, description: description || null, published })
      .eq("id", corridor.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Corridor updated");
    onSaved();
  };

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    let order = images.at(-1)?.sort_order ?? 0;
    for (const file of Array.from(files)) {
      const path = `corridors/${corridor.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("property-images").upload(path, file);
      if (upErr) { toast.error(upErr.message); continue; }
      order += 1;
      const { error: insErr } = await supabase
        .from("corridor_images").insert({ corridor_id: corridor.id, url: path, sort_order: order });
      if (insErr) toast.error(insErr.message);
    }
    await loadImages();
    setUploading(false);
  };

  const remove = async (img: DBCorridorImage) => {
    const { error } = await supabase.from("corridor_images").delete().eq("id", img.id);
    if (error) return toast.error(error.message);
    setImages((imgs) => imgs.filter((i) => i.id !== img.id));
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    for (const [i, img] of next.entries()) {
      const { error } = await supabase.from("corridor_images").update({ sort_order: i + 1 }).eq("id", img.id);
      if (error) toast.error(error.message);
    }
  };

  return (
    <div className="rounded-sm border border-border bg-card p-6">
      <h3 className="font-display text-2xl text-foreground">{corridor.name}</h3>
      <div className="mt-4 grid gap-4">
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Description</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published
        </label>
        <div>
          <button onClick={save} disabled={saving}
            className="rounded-sm bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-lg">Gallery Images</h4>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:border-gold hover:text-gold">
            <Upload size={14} /> {uploading ? "Uploading…" : "Upload"}
            <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => upload(e.target.files)} />
          </label>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.id} className="group relative overflow-hidden rounded-sm border border-border">
              <img src={resolveAssetUrl(img.url)} alt="" className="h-28 w-full object-cover" />
              <div className="absolute inset-0 hidden items-end justify-between gap-1 bg-black/60 p-2 group-hover:flex">
                <button onClick={() => move(i, -1)} aria-label="Move left" className="rounded-sm bg-background/80 px-2 py-1"><ArrowLeft size={12} /></button>
                <button onClick={() => move(i, 1)} aria-label="Move right" className="rounded-sm bg-background/80 px-2 py-1"><ArrowRight size={12} /></button>
                <button onClick={() => remove(img)} aria-label="Delete" className="rounded-sm bg-destructive/80 px-2 py-1 text-destructive-foreground"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {images.length === 0 && <p className="col-span-full text-sm text-muted-foreground">No images yet.</p>}
        </div>
      </div>
    </div>
  );
}
