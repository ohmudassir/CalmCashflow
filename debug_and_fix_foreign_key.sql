-- Debug and fix foreign key constraint issue
-- Run this in your Supabase SQL editor

-- First, let's see what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if users table exists and its structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Check the foreign key constraint details
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'financial_goals';

-- Drop the foreign key constraint temporarily
ALTER TABLE financial_goals DROP CONSTRAINT IF EXISTS financial_goals_user_id_fkey;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Insert the test user
INSERT INTO users (id, email, full_name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'demo@example.com', 'Demo User')
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- Verify user was created
SELECT * FROM users;

-- Now try to insert a financial goal
INSERT INTO financial_goals (user_id, title, description, target_amount, current_amount, category, priority) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Goal', 'Test description', 10000, 1000, 'savings', 'medium')
ON CONFLICT DO NOTHING;

-- Verify financial goal was created
SELECT * FROM financial_goals;

-- Re-add the foreign key constraint
ALTER TABLE financial_goals 
ADD CONSTRAINT financial_goals_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Test that the foreign key works now
INSERT INTO financial_goals (user_id, title, description, target_amount, current_amount, category, priority) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Another Test Goal', 'Another test description', 5000, 500, 'emergency', 'high')
ON CONFLICT DO NOTHING;

-- Final verification
SELECT 
    fg.id,
    fg.title,
    fg.target_amount,
    u.email,
    u.full_name
FROM financial_goals fg
JOIN users u ON fg.user_id = u.id; 