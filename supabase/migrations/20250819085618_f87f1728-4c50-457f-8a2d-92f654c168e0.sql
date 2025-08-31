BEGIN;

CREATE OR REPLACE FUNCTION public.admin_update_admission_form(
  p_admin_email text,
  p_admin_password text,
  p_id uuid,
  p_test_result text,
  p_status text,
  p_admin_notes text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_record RECORD;
BEGIN
  SELECT a.id, a.email, a.password_hash
  INTO admin_record
  FROM public.admin_users a
  WHERE a.email = p_admin_email;

  IF admin_record.password_hash IS NOT NULL AND admin_record.password_hash = p_admin_password THEN
    UPDATE public.admission_forms
    SET test_result = p_test_result,
        status = p_status,
        admin_notes = p_admin_notes
    WHERE id = p_id;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$;

COMMIT;