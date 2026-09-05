CREATE TABLE public.corridors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  cover_image TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.corridors TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corridors TO authenticated;
GRANT ALL ON public.corridors TO service_role;

ALTER TABLE public.corridors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published corridors" ON public.corridors
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY "Admins manage corridors" ON public.corridors
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE TRIGGER corridors_set_updated_at BEFORE UPDATE ON public.corridors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.corridor_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  corridor_id UUID NOT NULL REFERENCES public.corridors(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX corridor_images_corridor_idx ON public.corridor_images (corridor_id, sort_order);

GRANT SELECT ON public.corridor_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.corridor_images TO authenticated;
GRANT ALL ON public.corridor_images TO service_role;

ALTER TABLE public.corridor_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view images of published corridors" ON public.corridor_images
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.corridors c WHERE c.id = corridor_images.corridor_id AND c.published = true));

CREATE POLICY "Admins manage corridor images" ON public.corridor_images
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

INSERT INTO public.corridors (slug, name, tagline, description, sort_order) VALUES
  ('mumbai-highway', 'Mumbai Highway', 'Budhera · Zaheerabad', 'The NH-65 Mumbai Highway corridor is one of Telangana''s most affordable entry points for open plots, backed by steady industrial growth and wide six-lane road access.', 1),
  ('bangalore-highway', 'Bangalore Highway', 'Shadnagar · Kothur', 'Anchored by Shadnagar, Kothur and the airport influence zone, the Bangalore Highway corridor combines HMDA approved layouts with fast-moving infrastructure.', 2),
  ('vijayawada-highway', 'Vijayawada Highway', 'HMDA Villa Communities', 'Gated villa communities and premium plotted developments define the Vijayawada Highway corridor, with excellent connectivity to eastern Hyderabad.', 3),
  ('srisailam-highway', 'Srisailam Highway', 'Premium Plots & Farms', 'From Amangal open plots to Dindi farmlands, the Srisailam Highway corridor offers a mix of nature-friendly farm projects and DTCP/RERA approved gated layouts.', 4),
  ('warangal-highway', 'Warangal Highway', 'Emerging Growth Corridor', 'Keesaragutta and Bibinagar lead growth along the Warangal Highway, supported by AIIMS, education hubs and rapid HMDA layout approvals.', 5);