DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit a valid inquiry" ON public.inquiries
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 100
  AND length(btrim(phone)) BETWEEN 5 AND 30
  AND (email IS NULL OR length(email) <= 200)
  AND (budget IS NULL OR length(budget) <= 100)
  AND (requirement IS NULL OR length(requirement) <= 500)
  AND (message IS NULL OR length(message) <= 2000)
);