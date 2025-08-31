
-- Create a table for admission forms, connected to Supabase Auth user id
CREATE TABLE public.admission_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_first_name TEXT,
  student_last_name TEXT,
  student_name_ar TEXT,
  dob DATE,
  religion TEXT,
  citizenship TEXT,
  second_lang TEXT,
  address TEXT,
  gender TEXT,
  school TEXT,
  grade TEXT,
  prev_school TEXT,
  scholar_notes TEXT,
  father_name TEXT,
  father_dob DATE,
  father_phone TEXT,
  father_email TEXT,
  father_degree TEXT,
  father_work TEXT,
  father_business TEXT,
  mother_name TEXT,
  mother_dob DATE,
  mother_phone TEXT,
  mother_email TEXT,
  mother_degree TEXT,
  mother_work TEXT,
  mother_business TEXT,
  -- test booking
  test_date DATE,
  test_time TEXT,
  test_result TEXT,
  status TEXT DEFAULT 'Awaiting Test Slot',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS so each user only sees their own form
ALTER TABLE public.admission_forms ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own form
CREATE POLICY "Parents can view their own form"
  ON public.admission_forms
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to create their own form
CREATE POLICY "Parents can create their own form"
  ON public.admission_forms
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own form (for test slot etc)
CREATE POLICY "Parents can update their own form"
  ON public.admission_forms
  FOR UPDATE
  USING (auth.uid() = user_id);
