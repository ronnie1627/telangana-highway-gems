
-- 1. Revoke EXECUTE on SECURITY DEFINER functions from public roles.
--    These functions are only invoked internally (RLS policies, triggers, admin server code).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin() FROM PUBLIC, anon, authenticated;

-- 2. Force inquiries.status to 'new' on insert (prevent status manipulation by submitters).
DROP POLICY IF EXISTS "Anyone can submit a valid inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit a valid inquiry"
  ON public.inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND length(btrim(name)) BETWEEN 1 AND 100
    AND length(btrim(phone)) BETWEEN 5 AND 30
    AND (email IS NULL OR length(email) <= 200)
    AND (budget IS NULL OR length(budget) <= 100)
    AND (requirement IS NULL OR length(requirement) <= 500)
    AND (message IS NULL OR length(message) <= 2000)
  );

-- 3. Restrict storage reads on property-images to files linked to Available properties.
DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Public read property images for available properties"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (
    bucket_id = 'property-images'
    AND (
      EXISTS (
        SELECT 1 FROM public.property_images pi
        JOIN public.properties p ON p.id = pi.property_id
        WHERE p.status IN ('Available', 'Coming Soon', 'Sold')
          AND (
            pi.url = storage.objects.name
            OR pi.url = 'properties/' || storage.objects.name
            OR pi.url = storage.objects.name
            OR storage.objects.name = replace(pi.url, 'properties/', '')
          )
      )
      OR EXISTS (
        SELECT 1 FROM public.properties p
        WHERE p.status IN ('Available', 'Coming Soon', 'Sold')
          AND (
            p.cover_image = storage.objects.name
            OR p.cover_image = 'properties/' || storage.objects.name
            OR storage.objects.name = replace(p.cover_image, 'properties/', '')
          )
      )
    )
  );

-- Admins retain read access via the existing admin policies; add explicit admin SELECT
-- so admin dashboard can list every file even for unpublished properties.
DROP POLICY IF EXISTS "Admins read all property images" ON storage.objects;
CREATE POLICY "Admins read all property images"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND public.has_role(auth.uid(), 'admin'::public.app_role)
  );
