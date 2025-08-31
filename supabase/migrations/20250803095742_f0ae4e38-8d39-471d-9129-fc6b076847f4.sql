-- Add payment status column to admission_forms table
ALTER TABLE admission_forms 
ADD COLUMN payment_status TEXT DEFAULT 'pending';

-- Add payment transaction ID for tracking
ALTER TABLE admission_forms 
ADD COLUMN payment_transaction_id TEXT;