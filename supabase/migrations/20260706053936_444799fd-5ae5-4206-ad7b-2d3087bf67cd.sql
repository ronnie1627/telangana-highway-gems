
-- Public read tables (anon + authenticated)
GRANT SELECT ON public.properties TO anon, authenticated;
GRANT SELECT ON public.property_images TO anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;

-- Admin write tables
GRANT INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.property_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;

-- Inquiries: anyone can insert, admins can read/update/delete
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;

-- User roles: authenticated can read (has_role is security definer anyway)
GRANT SELECT ON public.user_roles TO authenticated;

-- Service role full access on everything
GRANT ALL ON public.properties TO service_role;
GRANT ALL ON public.property_images TO service_role;
GRANT ALL ON public.site_settings TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.user_roles TO service_role;
