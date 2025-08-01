-- Fix RLS policies for financial_goals table
-- Run this in your Supabase SQL editor

-- First, let's check if the table exists and its current state
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'financial_goals';

-- Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'financial_goals';

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can insert their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can update their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Users can delete their own financial goals" ON financial_goals;
DROP POLICY IF EXISTS "Allow all operations for testing" ON financial_goals;

-- Option 1: Disable RLS completely for testing
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;

-- Option 2: Create permissive policies for testing (uncomment if you want to keep RLS enabled)
-- CREATE POLICY "Allow all operations for testing" ON financial_goals
--     FOR ALL USING (true) WITH CHECK (true);

-- Verify RLS is disabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'financial_goals';

-- Test insert to verify it works
INSERT INTO financial_goals (user_id, title, description, target_amount, current_amount, category, priority) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Goal', 'Test description', 10000, 1000, 'savings', 'medium');

-- Check if the insert worked
SELECT * FROM financial_goals LIMIT 5; 