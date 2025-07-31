import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useTransactions = (onTransactionsUpdate) => {
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
      setTransactions(data || [])
      if (onTransactionsUpdate) onTransactionsUpdate(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
      
      // Update local state immediately
      if (data && data[0]) {
        console.log('Adding new transaction to state:', data[0]) // Debug log
        setTransactions(prev => {
          const newState = [data[0], ...prev]
          console.log('New transactions state:', newState) // Debug log
          console.log('Previous state length:', prev.length, 'New state length:', newState.length)
          if (onTransactionsUpdate) onTransactionsUpdate(newState)
          return newState
        })
      }
      
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
      
      // Update local state immediately
      if (data && data[0]) {
        setTransactions(prev => {
          const newState = prev.map(t => t.id === id ? data[0] : t)
          if (onTransactionsUpdate) onTransactionsUpdate(newState)
          return newState
        })
      }
      
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
      
      // Update local state immediately
      setTransactions(prev => {
        const newState = prev.filter(t => t.id !== id)
        if (onTransactionsUpdate) onTransactionsUpdate(newState)
        return newState
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

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