-- Add new columns to transactions table
-- Run this in your Supabase SQL editor

-- Add payment_method column
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'cash';

-- Add income_source column  
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS income_source VARCHAR(50) DEFAULT 'wallet';

-- Update existing records to have default values
UPDATE transactions 
SET payment_method = 'cash' 
WHERE payment_method IS NULL;

UPDATE transactions 
SET income_source = 'wallet' 
WHERE income_source IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
AND column_name IN ('payment_method', 'income_source'); 