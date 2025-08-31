-- Add new fields to admission_forms table for the expanded form
ALTER TABLE admission_forms 
ADD COLUMN student_full_name TEXT,
ADD COLUMN student_nationality TEXT,
ADD COLUMN parent_passport_id TEXT,
ADD COLUMN student_home_number TEXT,
ADD COLUMN student_email TEXT,
ADD COLUMN father_education TEXT,
ADD COLUMN father_occupation TEXT,
ADD COLUMN father_work_address TEXT,
ADD COLUMN father_mobile TEXT,
ADD COLUMN father_religion TEXT,
ADD COLUMN father_address TEXT,
ADD COLUMN mother_education TEXT,
ADD COLUMN mother_occupation TEXT,
ADD COLUMN mother_mobile TEXT,
ADD COLUMN mother_religion TEXT,
ADD COLUMN mother_address TEXT,
ADD COLUMN siblings_info JSONB DEFAULT '[]'::jsonb;