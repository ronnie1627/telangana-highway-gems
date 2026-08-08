CREATE POLICY "Public read site branding assets"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'property-images' AND name = 'properties/kk-realtors-logo.png');