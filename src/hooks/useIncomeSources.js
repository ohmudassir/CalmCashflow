import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export const useIncomeSources = () => {
  const [incomeSources, setIncomeSources] = useState({
    wallet: 0,
    bank: 0,
    digital_wallet: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(0)

  // Calculate net balance (income - expenses) for each source
  const calculateIncomeSources = useCallback(async () => {
    try {
      setLoading(true)
      
      // Use a more efficient query with aggregation
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .select('amount, income_source')
        .eq('type', 'income')

      if (incomeError) throw incomeError

      const { data: expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('amount, income_source')
        .eq('type', 'expense')

      if (expenseError) throw expenseError

      // Get transfer transactions (expenses with payment_method = 'transfer')
      const { data: transferData, error: transferError } = await supabase
        .from('transactions')
        .select('amount, income_source, description')
        .eq('type', 'expense')
        .eq('payment_method', 'transfer')

      if (transferError) throw transferError

      // Calculate net balance for each source
      const sources = {
        wallet: 0,
        bank: 0,
        digital_wallet: 0
      }

      // Add income amounts
      incomeData?.forEach(transaction => {
        const source = transaction.income_source || 'wallet'
        if (sources.hasOwnProperty(source)) {
          sources[source] += parseFloat(transaction.amount) || 0
        }
      })

      // Subtract expense amounts (excluding transfers)
      expenseData?.forEach(transaction => {
        const source = transaction.income_source || 'wallet'
        if (sources.hasOwnProperty(source)) {
          sources[source] -= parseFloat(transaction.amount) || 0
        }
      })

      // Handle transfer amounts - parse destination from description
      transferData?.forEach(transaction => {
        const fromSource = transaction.income_source || 'wallet'
        const amount = parseFloat(transaction.amount) || 0
        
        // Parse destination from description: "Transfer from Wallet to Bank"
        const description = transaction.description || ''
        let toSource = null
        
        if (description.includes('to Wallet')) {
          toSource = 'wallet'
        } else if (description.includes('to Bank')) {
          toSource = 'bank'
        } else if (description.includes('to Digital Wallet')) {
          toSource = 'digital_wallet'
        }
        
        if (sources.hasOwnProperty(fromSource)) {
          sources[fromSource] -= amount
        }
        if (toSource && sources.hasOwnProperty(toSource)) {
          sources[toSource] += amount
        }
      })

      setIncomeSources(sources)
      setLastUpdate(Date.now())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update income source amount
  const updateIncomeSource = useCallback((source, amount) => {
    setIncomeSources(prev => ({
      ...prev,
      [source]: (prev[source] || 0) + amount
    }))
  }, [])

  // Update balances immediately when a transaction is added
  const updateBalancesForTransaction = useCallback((transaction) => {
    setIncomeSources(prev => {
      const newBalances = { ...prev }
      const amount = parseFloat(transaction.amount) || 0
      const source = transaction.income_source || 'wallet'

      if (transaction.type === 'income') {
        newBalances[source] = (newBalances[source] || 0) + amount
      } else if (transaction.type === 'expense') {
        newBalances[source] = (newBalances[source] || 0) - amount
      } else if (transaction.type === 'transfer') {
        const toSource = transaction.transfer_to_source
        newBalances[source] = (newBalances[source] || 0) - amount
        if (toSource && newBalances.hasOwnProperty(toSource)) {
          newBalances[toSource] = (newBalances[toSource] || 0) + amount
        }
      }

      return newBalances
    })
  }, [])

  // Get available amount for a source
  const getAvailableAmount = useCallback((source) => {
    return incomeSources[source] || 0
  }, [incomeSources])

  // Check if source has enough funds
  const hasEnoughFunds = useCallback((source, amount) => {
    return (incomeSources[source] || 0) >= amount
  }, [incomeSources])

  useEffect(() => {
    calculateIncomeSources()
  }, [calculateIncomeSources])

  return {
    incomeSources,
    loading,
    error,
    updateIncomeSource,
    updateBalancesForTransaction,
    getAvailableAmount,
    hasEnoughFunds,
    calculateIncomeSources
  }
} 