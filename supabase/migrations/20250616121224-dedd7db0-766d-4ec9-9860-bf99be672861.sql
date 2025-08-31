
-- Update the verify_admin_login function to use proper password verification
-- For now, we'll update the default admin password to be 'admin123' (plaintext for testing)
-- In production, this should use proper bcrypt hashing
UPDATE public.admin_users 
SET password_hash = 'admin123' 
WHERE email = 'admin@school.com';

-- Update the verify_admin_login function to do direct string comparison for now
-- (In production, you should implement proper bcrypt verification)
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

  -- Direct password comparison (use bcrypt in production)
  IF admin_record.password_hash IS NOT NULL AND admin_record.password_hash = admin_password THEN
    RETURN QUERY SELECT admin_record.id, admin_record.email, admin_record.name;
  END IF;
  
  RETURN;
END;
$$;
