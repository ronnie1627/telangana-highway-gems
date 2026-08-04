REVOKE INSERT ON TABLE public.inquiries FROM anon, authenticated;
GRANT INSERT (name, phone, email, budget, requirement, message, property_id, property_title) ON TABLE public.inquiries TO anon, authenticated;
GRANT ALL ON TABLE public.inquiries TO service_role;