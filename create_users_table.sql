-- Create users table and test user
-- Run this in your Supabase SQL editor

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on users table for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Insert the test user that the app uses
INSERT INTO users (id, email, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- Verify the user was created
SELECT * FROM users WHERE id = '00000000-0000-0000-0000-000000000000';

-- Now try to insert a test financial goal
INSERT INTO financial_goals (user_id, title, description, target_amount, current_amount, category, priority) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Goal', 'Test description', 10000, 1000, 'savings', 'medium')
ON CONFLICT DO NOTHING;

-- Verify the financial goal was created
SELECT * FROM financial_goals;

-- Check both tables exist and have data
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'financial_goals' as table_name, COUNT(*) as row_count FROM financial_goals; 