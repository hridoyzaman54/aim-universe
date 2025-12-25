-- Create website_versions table to store snapshots of the website
CREATE TABLE public.website_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_number INTEGER NOT NULL,
  version_name TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_current BOOLEAN DEFAULT false,
  content_snapshot JSONB NOT NULL, -- Stores the entire page configuration
  thumbnail_url TEXT, -- Optional screenshot
  tags TEXT[], -- For categorization (e.g., ['major', 'ui-update', 'content-change'])
  UNIQUE (version_number)
);

-- Create website_pages table to track individual page versions
CREATE TABLE public.website_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.website_versions(id) ON DELETE CASCADE NOT NULL,
  page_name TEXT NOT NULL, -- e.g., 'home', 'courses', 'about'
  page_route TEXT NOT NULL, -- e.g., '/', '/courses', '/about'
  page_content JSONB NOT NULL, -- Stores component configuration and content
  page_styles JSONB, -- Stores custom styles
  meta_data JSONB, -- SEO and meta information
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create version_changes table to track what changed between versions
CREATE TABLE public.version_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.website_versions(id) ON DELETE CASCADE NOT NULL,
  change_type TEXT NOT NULL, -- 'content', 'style', 'layout', 'component'
  page_affected TEXT NOT NULL,
  change_description TEXT NOT NULL,
  diff_data JSONB, -- Stores the actual differences
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create version_previews table for tracking preview sessions
CREATE TABLE public.version_previews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version_id UUID REFERENCES public.website_versions(id) ON DELETE CASCADE NOT NULL,
  previewed_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preview_duration INTEGER, -- in seconds
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.website_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.version_previews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for website_versions
CREATE POLICY "Anyone can view website versions"
ON public.website_versions
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert website versions"
ON public.website_versions
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update website versions"
ON public.website_versions
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete website versions"
ON public.website_versions
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for website_pages
CREATE POLICY "Anyone can view website pages"
ON public.website_pages
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage website pages"
ON public.website_pages
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for version_changes
CREATE POLICY "Anyone can view version changes"
ON public.version_changes
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage version changes"
ON public.version_changes
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for version_previews
CREATE POLICY "Users can view their own previews"
ON public.version_previews
FOR SELECT
USING (auth.uid() = previewed_by);

CREATE POLICY "Users can insert their own previews"
ON public.version_previews
FOR INSERT
WITH CHECK (auth.uid() = previewed_by);

CREATE POLICY "Admins can view all previews"
ON public.version_previews
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Function to create a new version snapshot
CREATE OR REPLACE FUNCTION public.create_website_version(
  p_version_name TEXT,
  p_description TEXT,
  p_content_snapshot JSONB,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_version_number INTEGER;
  v_version_id UUID;
BEGIN
  -- Get the next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO v_version_number
  FROM public.website_versions;
  
  -- Insert new version
  INSERT INTO public.website_versions (
    version_number,
    version_name,
    description,
    created_by,
    content_snapshot,
    tags
  ) VALUES (
    v_version_number,
    p_version_name,
    p_description,
    auth.uid(),
    p_content_snapshot,
    p_tags
  )
  RETURNING id INTO v_version_id;
  
  RETURN v_version_id;
END;
$$;

-- Function to restore a version (make it current)
CREATE OR REPLACE FUNCTION public.restore_website_version(p_version_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can restore versions';
  END IF;
  
  -- Unmark all versions as current
  UPDATE public.website_versions SET is_current = false WHERE is_current = true;
  
  -- Mark the selected version as current
  UPDATE public.website_versions SET is_current = true WHERE id = p_version_id;
  
  RETURN true;
END;
$$;

-- Function to get current version
CREATE OR REPLACE FUNCTION public.get_current_version()
RETURNS TABLE (
  id UUID,
  version_number INTEGER,
  version_name TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  content_snapshot JSONB
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, version_number, version_name, description, created_at, content_snapshot
  FROM public.website_versions
  WHERE is_current = true
  LIMIT 1;
$$;

-- Function to track version preview
CREATE OR REPLACE FUNCTION public.track_version_preview(
  p_version_id UUID,
  p_preview_duration INTEGER DEFAULT NULL,
  p_feedback TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_preview_id UUID;
BEGIN
  INSERT INTO public.version_previews (
    version_id,
    previewed_by,
    preview_duration,
    feedback
  ) VALUES (
    p_version_id,
    auth.uid(),
    p_preview_duration,
    p_feedback
  )
  RETURNING id INTO v_preview_id;
  
  RETURN v_preview_id;
END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_website_versions_current ON public.website_versions(is_current) WHERE is_current = true;
CREATE INDEX idx_website_versions_created_at ON public.website_versions(created_at DESC);
CREATE INDEX idx_website_pages_version_id ON public.website_pages(version_id);
CREATE INDEX idx_version_changes_version_id ON public.version_changes(version_id);
CREATE INDEX idx_version_previews_version_id ON public.version_previews(version_id);

-- Insert initial version with current website state
INSERT INTO public.website_versions (
  version_number,
  version_name,
  description,
  is_current,
  content_snapshot,
  tags
) VALUES (
  1,
  'Initial Version',
  'Initial snapshot of the AIM Centre website',
  true,
  '{
    "pages": {
      "home": {
        "components": ["HeroSection", "FeaturesSection", "CourseCategoriesSection", "TinyExplorersPreview", "TestimonialsSection", "CTASection"],
        "theme": "default"
      },
      "courses": {
        "components": ["CourseList", "CourseFilters"],
        "theme": "default"
      },
      "dashboard": {
        "components": ["ProgressTracker", "VideoPlayer", "QuizModule", "AIChatbot"],
        "theme": "default"
      }
    },
    "globalSettings": {
      "theme": "default",
      "language": "en"
    }
  }'::jsonb,
  ARRAY['initial', 'baseline']
);
