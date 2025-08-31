
-- First, let's drop the existing admin policies that might be causing conflicts
DROP POLICY IF EXISTS "Admins can view all admission forms" ON public.admission_forms;
DROP POLICY IF EXISTS "Admins can update all admission forms" ON public.admission_forms;

-- Enable Row Level Security on admission_forms table (this might already be enabled)
ALTER TABLE public.admission_forms ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to view their own admission forms
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admission_forms' 
        AND policyname = 'Users can view their own admission forms'
    ) THEN
        CREATE POLICY "Users can view their own admission forms" 
        ON public.admission_forms 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create policy that allows users to insert their own admission forms
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admission_forms' 
        AND policyname = 'Users can create their own admission forms'
    ) THEN
        CREATE POLICY "Users can create their own admission forms" 
        ON public.admission_forms 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- Create policy that allows users to update their own admission forms
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'admission_forms' 
        AND policyname = 'Users can update their own admission forms'
    ) THEN
        CREATE POLICY "Users can update their own admission forms" 
        ON public.admission_forms 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create a security definer function to check admin status to avoid recursive RLS issues
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE id = check_user_id
  );
$$;

-- Create policy that allows admins to view all admission forms using the security definer function
CREATE POLICY "Admins can view all admission forms" 
  ON public.admission_forms 
  FOR SELECT 
  USING (public.is_admin());

-- Create policy that allows admins to update all admission forms using the security definer function
CREATE POLICY "Admins can update all admission forms" 
  ON public.admission_forms 
  FOR UPDATE 
  USING (public.is_admin());
