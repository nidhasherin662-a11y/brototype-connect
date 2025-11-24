-- Drop existing function with CASCADE to remove dependent policies
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;

-- Create enum for admin roles
CREATE TYPE public.admin_role_type AS ENUM ('super_admin', 'moderator', 'admin');

-- Drop existing admin_roles table and recreate with new structure
DROP TABLE IF EXISTS public.admin_roles CASCADE;

CREATE TABLE public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role admin_role_type NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id UUID, _role admin_role_type)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Create function to check if user is any type of admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_roles
    WHERE user_id = _user_id
  );
$$;

-- RLS Policies for admin_roles
CREATE POLICY "Admins can view their own role"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all roles"
ON public.admin_roles
FOR SELECT
TO authenticated
USING (public.has_admin_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage roles"
ON public.admin_roles
FOR ALL
TO authenticated
USING (public.has_admin_role(auth.uid(), 'super_admin'));

-- Recreate RLS policies for complaints table
CREATE POLICY "Admins can view all complaints"
ON public.complaints
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update complaints"
ON public.complaints
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Recreate RLS policies for complaint_responses table
CREATE POLICY "Admins can create responses"
ON public.complaint_responses
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Users can view responses to their complaints"
ON public.complaint_responses
FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1
  FROM public.complaints
  WHERE complaints.id = complaint_responses.complaint_id
    AND (complaints.student_id = auth.uid() OR public.is_admin(auth.uid()))
));