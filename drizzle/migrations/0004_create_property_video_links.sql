ALTER TABLE public.properties ADD COLUMN youtube_url text;

ALTER TABLE public.gallery_videos ADD COLUMN property_id uuid REFERENCES public.properties(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.properties.youtube_url IS 'Optional YouTube link for this property, embedded on the property page and listed on the gallery video-links page';
COMMENT ON COLUMN public.gallery_videos.property_id IS 'Optional link tying an uploaded video to a single property';