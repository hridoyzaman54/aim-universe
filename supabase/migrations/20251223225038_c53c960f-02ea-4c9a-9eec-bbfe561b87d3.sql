-- Add unique student ID to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;

-- Create function to generate unique student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_id := 'STU' || LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE student_id = new_id) INTO exists_check;
    IF NOT exists_check THEN
      RETURN new_id;
    END IF;
  END LOOP;
END;
$$;

-- Update handle_new_user to generate student_id for students
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  new_student_id TEXT;
BEGIN
  user_role := COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'student');
  
  -- Generate student ID only for students
  IF user_role = 'student' THEN
    new_student_id := public.generate_student_id();
  END IF;
  
  INSERT INTO public.profiles (user_id, full_name, student_id)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name', new_student_id);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$$;

-- Create mood_logs table for mood tracking
CREATE TABLE public.mood_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('happy', 'calm', 'anxious', 'sad', 'stressed', 'excited')),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own mood logs"
ON public.mood_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood logs"
ON public.mood_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('student', 'parent')),
  student_id TEXT, -- Required for parents
  student_name TEXT, -- For parent appointments
  service_type TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('video', 'phone', 'chat')),
  counsellor_name TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all appointments"
ON public.appointments FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Create parent_student_links table for linking parents to students
CREATE TABLE public.parent_student_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_user_id UUID NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their own links"
ON public.parent_student_links FOR SELECT
USING (auth.uid() = parent_user_id);

CREATE POLICY "Parents can create links"
ON public.parent_student_links FOR INSERT
WITH CHECK (auth.uid() = parent_user_id);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'appointment', 'progress')),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Create trigger for appointments updated_at
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_mood_logs_user_id ON public.mood_logs(user_id);
CREATE INDEX idx_mood_logs_created_at ON public.mood_logs(created_at DESC);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_parent_student_links_parent ON public.parent_student_links(parent_user_id);
CREATE INDEX idx_parent_student_links_student ON public.parent_student_links(student_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);