import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ggargmldunrnskbnpiaa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnYXJnbWxkdW5ybnNrYm5waWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExODkzNDcsImV4cCI6MjA2Njc2NTM0N30.eYd4lVe9vMCSbJZJikpUamNO9P3vtvoct3sxM3ithbo'

// Create a single instance to avoid multiple GoTrueClient instances
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper function to ensure test user exists
export const ensureTestUser = async () => {
  try {
    // Try to get the test user
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', '00000000-0000-0000-0000-000000000000')
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      // User doesn't exist, create it
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: '00000000-0000-0000-0000-000000000000',
          email: 'demo@example.com',
          full_name: 'Demo User'
        })

      if (insertError) {
        console.error('Error creating test user:', insertError)
        return null
      }
    }

    return '00000000-0000-0000-0000-000000000000'
  } catch (error) {
    console.error('Error ensuring test user:', error)
    return null
  }
} 