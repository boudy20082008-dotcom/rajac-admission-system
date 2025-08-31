-- Make user_id nullable and add primary_email field to admission_forms
ALTER TABLE public.admission_forms 
ALTER COLUMN user_id DROP NOT NULL;

-- Add primary email field to capture the main contact email
ALTER TABLE public.admission_forms 
ADD COLUMN primary_email TEXT;

-- Update RLS policies to allow public access for form submission
DROP POLICY IF EXISTS "Parents can create their own form" ON public.admission_forms;
DROP POLICY IF EXISTS "Parents can update their own form" ON public.admission_forms;
DROP POLICY IF EXISTS "Parents can view their own form" ON public.admission_forms;
DROP POLICY IF EXISTS "Users can create their own admission forms" ON public.admission_forms;
DROP POLICY IF EXISTS "Users can update their own admission forms" ON public.admission_forms;
DROP POLICY IF EXISTS "Users can view their own admission forms" ON public.admission_forms;

-- Create new policies for public form submission
CREATE POLICY "Anyone can create admission forms" 
ON public.admission_forms 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view forms by email for their own submissions
CREATE POLICY "Users can view forms by email" 
ON public.admission_forms 
FOR SELECT 
USING (
  auth.uid() IS NULL OR 
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  primary_email = (auth.jwt() ->> 'email'::text)
);

-- Allow users to update forms by email
CREATE POLICY "Users can update forms by email" 
ON public.admission_forms 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  primary_email = (auth.jwt() ->> 'email'::text)
);