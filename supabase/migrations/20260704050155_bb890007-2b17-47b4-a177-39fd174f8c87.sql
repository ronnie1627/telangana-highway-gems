CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site settings"
  ON public.site_settings FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('hero', jsonb_build_object(
    'eyebrow', 'Open Plots At Low Budget · Limited Inventory',
    'title_lead', 'Affordable Open Plots, Villas &',
    'title_highlight', 'Farm Lands',
    'title_trail', 'across Telangana''s prime highways.',
    'subtitle', 'Invest today in Telangana''s fastest-growing real estate corridors. HMDA, DTCP, LRS, Farms and agricultural lands approved properties across Hyderabad & Telangana with bank loan support and verified documentation.',
    'stat1_value', '1200+', 'stat1_label', 'Plots Sold',
    'stat2_value', '70+',  'stat2_label', 'Locations Covered',
    'stat3_value', '100%', 'stat3_label', 'Verified Title'
  )),
  ('cta', jsonb_build_object(
    'eyebrow', 'Talk To Us',
    'title', 'Tell us what you''re looking for. We''ll find the right property.',
    'subtitle', 'Share your requirement and one of our advisors will reach out within 24 hours with shortlisted options, transparent pricing and site visit availability.'
  ));