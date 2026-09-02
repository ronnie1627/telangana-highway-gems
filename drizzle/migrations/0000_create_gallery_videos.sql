CREATE TABLE public.gallery_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  duration TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gallery_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_videos TO authenticated;
GRANT ALL ON public.gallery_videos TO service_role;

ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos"
  ON public.gallery_videos FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admins manage gallery videos"
  ON public.gallery_videos FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE TRIGGER gallery_videos_updated_at
  BEFORE UPDATE ON public.gallery_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX gallery_videos_sort_idx ON public.gallery_videos (sort_order, created_at);