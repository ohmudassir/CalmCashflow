-- Add auto-update columns to financial_goals table
-- Run this in your Supabase SQL editor

-- Add the missing columns
ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS auto_update BOOLEAN DEFAULT false;

ALTER TABLE financial_goals 
ADD COLUMN IF NOT EXISTS linked_category_id UUID REFERENCES categories(id);

-- Create index for linked_category_id for better performance
CREATE INDEX IF NOT EXISTS idx_financial_goals_linked_category ON financial_goals(linked_category_id);

-- Verify the columns were added
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'financial_goals' 
AND column_name IN ('auto_update', 'linked_category_id')
ORDER BY ordinal_position;

-- Show the complete table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'financial_goals' 
ORDER BY ordinal_position; 