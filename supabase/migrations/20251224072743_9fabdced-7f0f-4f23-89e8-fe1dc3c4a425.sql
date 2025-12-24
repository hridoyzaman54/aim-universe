-- Create announcements table
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_by UUID NOT NULL,
  target_roles TEXT[] DEFAULT ARRAY['student', 'parent'],
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_courses table for admin-managed courses
CREATE TABLE public.admin_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  class TEXT NOT NULL,
  subject TEXT NOT NULL,
  instructor TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  duration TEXT,
  price TEXT NOT NULL DEFAULT 'FREE',
  is_free BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course_materials table for admin-uploaded materials
CREATE TABLE public.course_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;

-- Announcements policies
CREATE POLICY "Anyone can view active announcements"
ON public.announcements
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage announcements"
ON public.announcements
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Admin courses policies
CREATE POLICY "Anyone can view published courses"
ON public.admin_courses
FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage courses"
ON public.admin_courses
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Course materials policies
CREATE POLICY "Anyone can view course materials"
ON public.course_materials
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage course materials"
ON public.course_materials
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX idx_announcements_active ON public.announcements(is_active, created_at DESC);
CREATE INDEX idx_admin_courses_published ON public.admin_courses(is_published);
CREATE INDEX idx_course_materials_course ON public.course_materials(course_id);

-- Add update trigger for announcements
CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add update trigger for admin_courses
CREATE TRIGGER update_admin_courses_updated_at
BEFORE UPDATE ON public.admin_courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();