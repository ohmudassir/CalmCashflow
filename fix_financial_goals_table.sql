-- Fix financial_goals table - Add missing columns
-- Run this in your Supabase SQL editor

-- Add missing columns if they don't exist
ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'savings';

ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium';

ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS target_date DATE;

ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add constraint for priority values
ALTER TABLE financial_goals 
DROP CONSTRAINT IF EXISTS financial_goals_priority_check;

ALTER TABLE financial_goals 
ADD CONSTRAINT financial_goals_priority_check 
CHECK (priority IN ('low', 'medium', 'high', 'urgent'));

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_financial_goals_category ON financial_goals(category);
CREATE INDEX IF NOT EXISTS idx_financial_goals_priority ON financial_goals(priority);

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'financial_goals' 
ORDER BY ordinal_position; 