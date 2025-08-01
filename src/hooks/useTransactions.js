import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Debounce utility function
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      const newTransactions = data || []
      console.log('Fetched transactions:', newTransactions.length, 'transactions')
      console.log('Setting transactions state with:', newTransactions)
      
      // Prevent unnecessary state updates if data hasn't changed
      setTransactions(prev => {
        const hasChanged = JSON.stringify(prev) !== JSON.stringify(newTransactions)
        if (hasChanged) {
          console.log('Transactions updated - data changed')
          return newTransactions
        }
        console.log('Transactions unchanged - skipping update')
        return prev
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create debounced version of fetchTransactions
  const fetchTransactionsDebounced = useCallback(
    debounce(fetchTransactions, 300), // delay by 300ms
    []
  )

  // Setup real-time subscriptions
  useEffect(() => {
    console.log('Setting up real-time subscriptions for transactions')
    // Initial fetch
    fetchTransactions()

    // Setup real-time subscription for transactions
    const transactionsChannel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'transactions',
        },
        (payload) => {
          console.log('Transaction change detected:', payload)
          console.log('Re-fetching transactions due to change...')
          // Re-fetch data to update UI with debouncing
          fetchTransactionsDebounced()
        }
      )
      .subscribe()

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up real-time subscription')
      supabase.removeChannel(transactionsChannel)
    }
  }, [fetchTransactionsDebounced])

  // Add new transaction (direct insert for testing)
  const addTransaction = async (transactionData) => {
    try {
      // First, ensure the user exists
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id: transactionData.user_id,
          email: 'demo@example.com',
          full_name: 'Demo User'
        }, { onConflict: 'id' })

      if (userError) {
        console.error('Error creating user:', userError)
      }

      // Prepare transaction data with default values for new fields
      const transactionToInsert = {
        ...transactionData,
        payment_method: transactionData.payment_method || 'cash',
        income_source: transactionData.income_source || 'wallet'
      }

      // Then insert the transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionToInsert])
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(`Database error: ${error.message}`)
      }
      
      // The real-time subscription will handle the UI update
      console.log('Transaction added successfully:', data[0])
      return data[0]
    } catch (err) {
      console.error('Error in addTransaction:', err)
      setError(err.message)
      throw err
    }
  }

  // Update transaction
  const updateTransaction = async (id, updates) => {
    try {
      // Prepare update data with default values for new fields
      const updateData = {
        ...updates,
        payment_method: updates.payment_method || 'cash',
        income_source: updates.income_source || 'wallet'
      }

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          categories (
            id,
            name,
            icon,
            color
          )
        `)

      if (error) throw error
      
      // The real-time subscription will handle the UI update
      console.log('Transaction updated successfully:', data[0])
      return data[0]
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // The real-time subscription will handle the UI update
      console.log('Transaction deleted successfully:', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions
  }
} 