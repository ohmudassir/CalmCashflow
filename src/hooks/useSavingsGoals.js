import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useSavingsGoals = () => {
  const [savingsGoals, setSavingsGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all savings goals
  const fetchSavingsGoals = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('financial_goals')
        .select(`
          *,
          categories (
            id,
            name,
            type
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Add category name to each goal for easier reference
      const goalsWithCategoryNames = (data || []).map(goal => ({
        ...goal,
        linked_category_name: goal.categories?.name || ''
      }))
      
      setSavingsGoals(goalsWithCategoryNames)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Setup real-time subscription
  useEffect(() => {
    // Initial fetch
    fetchSavingsGoals()

    // Setup real-time subscription for savings goals
    const savingsGoalsChannel = supabase
      .channel('public:financial_goals')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'financial_goals',
        },
        (payload) => {
          console.log('Savings goal change detected:', payload)
          // Re-fetch data to update UI
          fetchSavingsGoals()
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(savingsGoalsChannel)
    }
  }, [])

  // Add new savings goal
  const addSavingsGoal = async (goalData) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([goalData])
        .select()

      if (error) throw error
      
      console.log('Savings goal added successfully:', data[0])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Update savings goal
  const updateSavingsGoal = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) throw error
      
      console.log('Savings goal updated successfully:', data[0])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete savings goal
  const deleteSavingsGoal = async (id) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      console.log('Savings goal deleted successfully')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Calculate progress for a goal
  const calculateProgress = useCallback((goal, currentSavings) => {
    if (!goal || goal.target_amount <= 0) return 0
    const progress = (currentSavings / goal.target_amount) * 100
    return Math.min(progress, 100) // Cap at 100%
  }, [])

  // Get total savings from all goals
  const getTotalSavings = useCallback(() => {
    return savingsGoals.reduce((total, goal) => total + (goal.current_amount || 0), 0)
  }, [savingsGoals])

  // Get total target from all goals
  const getTotalTarget = useCallback(() => {
    return savingsGoals.reduce((total, goal) => total + (goal.target_amount || 0), 0)
  }, [savingsGoals])

  return {
    savingsGoals,
    loading,
    error,
    fetchSavingsGoals, // Add the fetch function
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateProgress,
    getTotalSavings,
    getTotalTarget
  }
} 