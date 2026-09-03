import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

type AdminVideo = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  duration: string | null;
  sort_order: number;
  published: boolean;
};

type VideoForm = {
  title: string;
  description: string;
  duration: string;
  published: boolean;
};

const emptyForm: VideoForm = { title: "", description: "", duration: "", published: true };
const inputCls = "mt-2 w-full rounded-sm border border-border bg-input/30 px-3 py-2.5 text-sm outline-none focus:border-gold";

function storagePath(value: string | null) {
  if (!value) return null;
  const marker = "/property-videos/";
  const index = value.indexOf(marker);
  return index >= 0 ? decodeURIComponent(value.slice(index + marker.length)) : value;
}

function previewUrl(value: string | null) {
  if (!value) return "";
  if (/^(https?:|data:|blob:|\/)/.test(value)) return value;
  return `/api/property-videos/${value.split("/").map(encodeURIComponent).join("/")}`;
}

async function uploadFile(file: File, folder: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("property-videos").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export function VideosTab() {
  const [items, setItems] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<AdminVideo | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const reload = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("gallery_videos").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as AdminVideo[]) ?? []);
    setLoading(false);
  };
  useEffect(() => { reload(); }, []);

  const openNew = () => {
    setShowEditor(true);
    setEditing(null);
    setForm(emptyForm);
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const openEdit = (video: AdminVideo) => {
    setShowEditor(true);
    setEditing(video);
    setForm({ title: video.title, description: video.description ?? "", duration: video.duration ?? "", published: video.published });
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditing(null);
    setForm(emptyForm);
    setVideoFile(null);
    setThumbnailFile(null);
  };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Video title is required");
    if (!editing && !videoFile) return toast.error("Choose a video file to upload");
    if (!editing && !thumbnailFile) return toast.error("Choose a thumbnail image to upload");
    setSaving(true);
    try {
      let videoUrl = editing?.video_url ?? "";
      let thumbnailUrl = editing?.thumbnail_url ?? null;
      if (videoFile) videoUrl = await uploadFile(videoFile, "videos");
      if (thumbnailFile) thumbnailUrl = await uploadFile(thumbnailFile, "thumbnails");
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        duration: form.duration.trim() || null,
        published: form.published,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
      };
      const result = editing
        ? await supabase.from("gallery_videos").update(payload).eq("id", editing.id)
        : await supabase.from("gallery_videos").insert({ ...payload, sort_order: items.length });
      if (result.error) throw result.error;
      toast.success(editing ? "Video updated" : "Video added");
      closeEditor();
      await reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save video");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (video: AdminVideo) => {
    if (!confirm(`Delete “${video.title}”? This cannot be undone.`)) return;
    const { error } = await supabase.from("gallery_videos").delete().eq("id", video.id);
    if (error) return toast.error(error.message);
    const paths = [storagePath(video.video_url), storagePath(video.thumbnail_url)].filter((path): path is string => !!path);
    if (paths.length) await supabase.storage.from("property-videos").remove(paths);
    toast.success("Video deleted");
    reload();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const otherIndex = index + direction;
    if (otherIndex < 0 || otherIndex >= items.length) return;
    const current = items[index];
    const other = items[otherIndex];
    const { error } = await Promise.all([
      supabase.from("gallery_videos").update({ sort_order: other.sort_order }).eq("id", current.id),
      supabase.from("gallery_videos").update({ sort_order: current.sort_order }).eq("id", other.id),
    ]).then((results) => ({ error: results.find((result) => result.error)?.error ?? null }));
    if (error) return toast.error(error.message);
    reload();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-foreground">Video Gallery</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload property tours and control their public order.</p>
        </div>
        {!showEditor && (
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold">
            <Plus size={14} /> Add Video
          </button>
        )}
      </div>

      {showEditor ? (
        <section className="mt-6 rounded-sm border border-border bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl">{editing ? "Edit Video" : "Add Video"}</h3>
            <button onClick={closeEditor} className="grid h-8 w-8 place-items-center rounded-sm border border-border text-muted-foreground hover:border-gold hover:text-gold" aria-label="Close video editor"><X size={16} /></button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Title
              <input value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} className={inputCls} placeholder="e.g. Green Homes — Future City" />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Duration
              <input value={form.duration} onChange={(event) => setForm((value) => ({ ...value, duration: event.target.value }))} className={inputCls} placeholder="0:22" />
            </label>
            <label className="flex items-end gap-3 pb-2 text-sm text-foreground"><input type="checkbox" checked={form.published} onChange={(event) => setForm((value) => ({ ...value, published: event.target.checked }))} className="h-4 w-4 accent-gold" /> Show in public gallery</label>
            <label className="sm:col-span-2 block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Description
              <textarea rows={3} value={form.description} onChange={(event) => setForm((value) => ({ ...value, description: event.target.value }))} className={inputCls} placeholder="A short note about the location or tour" />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Video file {editing && <span className="normal-case tracking-normal">(optional replacement)</span>}
              <input type="file" accept="video/*" onChange={(event) => setVideoFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:text-foreground" />
            </label>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Thumbnail image {editing && <span className="normal-case tracking-normal">(optional replacement)</span>}
              <input type="file" accept="image/*" onChange={(event) => setThumbnailFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-xs text-muted-foreground file:mr-3 file:rounded-sm file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:text-foreground" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={closeEditor} className="rounded-sm border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em]">Cancel</button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-sm bg-gradient-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-gold disabled:opacity-60"><Upload size={14} /> {saving ? "Uploading…" : editing ? "Save Changes" : "Upload Video"}</button>
          </div>
        </section>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/30 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"><tr><th className="p-3 text-left">Video</th><th className="p-3 text-left">Duration</th><th className="p-3 text-left">Status</th><th className="p-3 text-right">Order / Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Loading…</td></tr> : items.length === 0 ? <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No videos yet.</td></tr> : items.map((video, index) => (
              <tr key={video.id} className="border-t border-border">
                <td className="p-3"><div className="flex items-center gap-3"><div className="h-14 w-24 overflow-hidden rounded-sm bg-muted">{video.thumbnail_url && <img src={previewUrl(video.thumbnail_url)} alt="" className="h-full w-full object-cover" />}</div><div><p className="font-medium text-foreground">{video.title}</p>{video.description && <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">{video.description}</p>}</div></div></td>
                <td className="p-3 text-muted-foreground">{video.duration ?? "—"}</td>
                <td className="p-3"><button onClick={async () => { const { error } = await supabase.from("gallery_videos").update({ published: !video.published }).eq("id", video.id); if (error) toast.error(error.message); else reload(); }} className={`rounded-sm border px-2 py-1 text-[10px] uppercase tracking-wider ${video.published ? "border-emerald-500/50 text-emerald-500" : "border-border text-muted-foreground"}`}>{video.published ? "Published" : "Hidden"}</button></td>
                <td className="p-3"><div className="flex justify-end gap-1"><button onClick={() => move(index, -1)} disabled={index === 0} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-gold hover:text-gold disabled:opacity-30" aria-label="Move video up"><ArrowUp size={14} /></button><button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-gold hover:text-gold disabled:opacity-30" aria-label="Move video down"><ArrowDown size={14} /></button><button onClick={() => openEdit(video)} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-gold hover:text-gold" aria-label={`Edit ${video.title}`}><Pencil size={14} /></button><button onClick={() => remove(video)} className="grid h-8 w-8 place-items-center rounded-sm border border-border hover:border-destructive hover:text-destructive" aria-label={`Delete ${video.title}`}><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
