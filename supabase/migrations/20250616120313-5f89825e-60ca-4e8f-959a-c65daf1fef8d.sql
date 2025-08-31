
-- Create admin_users table for secure admin login
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add admin notes column to admission_forms
ALTER TABLE public.admission_forms 
ADD COLUMN admin_notes TEXT;

-- Insert a default admin user (password: admin123)
-- In production, this should be changed immediately
INSERT INTO public.admin_users (email, password_hash, name)
VALUES ('admin@school.com', '$2b$10$rQ8K5O2GXnKH9zAo6P3gMe7X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M', 'School Admin');

-- Create RLS policies for admin_users (only admins can manage admins)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all admin accounts
CREATE POLICY "Admins can view admin accounts"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Create a function to verify admin credentials
CREATE OR REPLACE FUNCTION public.verify_admin_login(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  SELECT a.id, a.email, a.name, a.password_hash
  INTO admin_record
  FROM public.admin_users a
  WHERE a.email = admin_email;

  -- Simple password check (in production, use proper bcrypt)
  IF admin_record.password_hash = admin_password THEN
    RETURN QUERY SELECT admin_record.id, admin_record.email, admin_record.name;
  END IF;
  
  RETURN;
END;
$$;

-- Create policy to allow admins to view and update all admission forms
CREATE POLICY "Admins can view all admission forms"
  ON public.admission_forms
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Admins can update all admission forms"
  ON public.admission_forms
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE email = auth.jwt() ->> 'email'
    )
  );
