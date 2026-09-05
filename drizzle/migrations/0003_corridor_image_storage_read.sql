CREATE POLICY "Public read corridor gallery images" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'property-images'
    AND EXISTS (
      SELECT 1
      FROM public.corridor_images ci
      JOIN public.corridors c ON c.id = ci.corridor_id
      WHERE c.published = true
        AND objects.name = regexp_replace(regexp_replace(ci.url, '^.*/object/(public|authenticated)/property-images/', ''), '^/?api/property-images/', '')
    )
  );