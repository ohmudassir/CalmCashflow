-- Create financial_goals table from scratch
-- Run this in your Supabase SQL editor

-- Drop the table if it exists (be careful with this in production!)
DROP TABLE IF EXISTS financial_goals CASCADE;

-- Create the financial_goals table with all required columns
CREATE TABLE financial_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    current_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    target_date DATE,
    category VARCHAR(50) DEFAULT 'savings',
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_financial_goals_category ON financial_goals(category);
CREATE INDEX idx_financial_goals_priority ON financial_goals(priority);
CREATE INDEX idx_financial_goals_created_at ON financial_goals(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can insert their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can update their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can delete their own financial goals" ON financial_goals;

-- Create RLS policies
-- Policy for users to see only their own goals
CREATE POLICY "Users can view their own financial goals" ON financial_goals
    FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own goals
CREATE POLICY "Users can insert their own financial goals" ON financial_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own goals
CREATE POLICY "Users can update their own financial goals" ON financial_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own goals
CREATE POLICY "Users can delete their own financial goals" ON financial_goals
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_financial_goals_updated_at ON financial_goals;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_financial_goals_updated_at 
    BEFORE UPDATE ON financial_goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created correctly
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'financial_goals' 
ORDER BY ordinal_position;

-- Test insert (optional - remove this after testing)
-- INSERT INTO financial_goals (user_id, title, description, target_amount, current_amount, target_date, category, priority) VALUES
-- ('00000000-0000-0000-0000-000000000000', 'Test Goal', 'Test description', 10000, 1000, '2024-12-31', 'savings', 'medium'); 