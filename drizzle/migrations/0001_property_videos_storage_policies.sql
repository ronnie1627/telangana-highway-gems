CREATE POLICY "Public read property videos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'property-videos');

CREATE POLICY "Admins upload property videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins update property videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

CREATE POLICY "Admins delete property videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-videos' AND EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));