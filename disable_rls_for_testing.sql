-- Temporarily disable RLS for testing
-- Run this in your Supabase SQL editor

-- Disable RLS temporarily for testing
ALTER TABLE financial_goals DISABLE ROW LEVEL SECURITY;

-- Or if you want to create a more permissive policy for testing:
-- DROP POLICY IF EXISTS "Users can view their own financial goals" ON financial_goals;
-- CREATE POLICY "Allow all operations for testing" ON financial_goals
--     FOR ALL USING (true);

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'financial_goals'; 