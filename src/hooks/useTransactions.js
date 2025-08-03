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
          
          // Handle real-time updates directly instead of re-fetching
          if (payload.eventType === 'INSERT') {
            // Check if transaction already exists to prevent duplicates
            setTransactions(prev => {
              const exists = prev.some(t => t.id === payload.new.id)
              if (!exists) {
                return [payload.new, ...prev]
              }
              return prev
            })
          } else if (payload.eventType === 'UPDATE') {
            setTransactions(prev => {
              const updated = prev.map(t => 
                t.id === payload.new.id ? payload.new : t
              )
              return updated
            })
          } else if (payload.eventType === 'DELETE') {
            setTransactions(prev => {
              const filtered = prev.filter(t => t.id !== payload.old.id)
              return filtered
            })
          }
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
      
      // Update local state immediately for dynamic UI
      const newTransaction = data[0]
      console.log('🎯 Database insert successful:', newTransaction)
      setTransactions(prev => {
        // Add the new transaction at the beginning (most recent first)
        const updatedTransactions = [newTransaction, ...prev]
        console.log('✅ Transaction added to state immediately:', newTransaction.title)
        console.log('📊 Total transactions now:', updatedTransactions.length)
        return updatedTransactions
      })
      
      console.log('Transaction added successfully:', newTransaction)
      return newTransaction
    } catch (err) {
      console.error('Error in addTransaction:', err)
      setError(err.message)
      throw err
    }
  }

  // Update transaction
  const updateTransaction = async (id, updates) => {
    try {
      console.log('✏️ Attempting to update transaction:', id, updates)
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
      
      // Update local state immediately for dynamic UI
      const updatedTransaction = data[0]
      setTransactions(prev => {
        const updatedTransactions = prev.map(transaction => 
          transaction.id === id ? updatedTransaction : transaction
        )
        console.log('✅ Transaction updated in state immediately:', updatedTransaction.title)
        return updatedTransactions
      })
      
      console.log('Transaction updated successfully:', updatedTransaction)
      return updatedTransaction
    } catch (err) {
      console.error('❌ Error updating transaction:', err)
      setError(err.message)
      throw err
    }
  }

  // Delete transaction
  const deleteTransaction = async (id) => {
    try {
      console.log('🗑️ Attempting to delete transaction:', id)
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Update local state immediately for dynamic UI
      setTransactions(prev => {
        const updatedTransactions = prev.filter(transaction => transaction.id !== id)
        console.log('✅ Transaction removed from state immediately:', id)
        console.log('📊 Total transactions now:', updatedTransactions.length)
        return updatedTransactions
      })
      
      console.log('Transaction deleted successfully:', id)
    } catch (err) {
      console.error('❌ Error deleting transaction:', err)
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