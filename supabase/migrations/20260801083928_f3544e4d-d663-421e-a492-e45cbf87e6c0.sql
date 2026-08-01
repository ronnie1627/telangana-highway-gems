UPDATE public.property_images
SET url = regexp_replace(url, '^/?api/property-images/', '')
WHERE url ~ '^/?api/property-images/';

UPDATE public.properties
SET cover_image = regexp_replace(cover_image, '^/?api/property-images/', '')
WHERE cover_image ~ '^/?api/property-images/';

DROP POLICY IF EXISTS "Public read property images for available properties" ON storage.objects;

CREATE POLICY "Public read property images for available properties"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'property-images'
  AND (
    EXISTS (
      SELECT 1
      FROM public.property_images pi
      JOIN public.properties p ON p.id = pi.property_id
      WHERE p.status = ANY (ARRAY['Available','Coming Soon','Sold'])
        AND objects.name = regexp_replace(
              regexp_replace(pi.url, '^.*/object/(public|authenticated)/property-images/', ''),
              '^/?api/property-images/', ''
            )
    )
    OR EXISTS (
      SELECT 1
      FROM public.properties p
      WHERE p.status = ANY (ARRAY['Available','Coming Soon','Sold'])
        AND p.cover_image IS NOT NULL
        AND objects.name = regexp_replace(
              regexp_replace(p.cover_image, '^.*/object/(public|authenticated)/property-images/', ''),
              '^/?api/property-images/', ''
            )
    )
  )
);