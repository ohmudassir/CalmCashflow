import { useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from '../lib/supabase'

export const useIncomeSources = (transactions = []) => {
  const [incomeSources, setIncomeSources] = useState({
    wallet: 0,
    bank: 0,
    digital_wallet: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Calculate balances from transactions
  const calculateFromTransactions = (transactionList) => {
    console.log('Calculating income sources from transactions:', transactionList.length)
    const sources = {
      wallet: 0,
      bank: 0,
      digital_wallet: 0
    }

    // Add income amounts
    transactionList
      .filter(t => t.type === 'income')
      .forEach(transaction => {
        const source = transaction.income_source || 'wallet'
        if (sources.hasOwnProperty(source)) {
          sources[source] += parseFloat(transaction.amount) || 0
        }
      })

    // Subtract expense amounts (transfers are handled separately)
    transactionList
      .filter(t => t.type === 'expense' && t.payment_method !== 'transfer')
      .forEach(transaction => {
        const source = transaction.income_source || 'wallet'
        if (sources.hasOwnProperty(source)) {
          sources[source] -= parseFloat(transaction.amount) || 0
        }
      })

    // Handle transfer amounts - parse destination from description
    transactionList
      .filter(t => t.type === 'expense' && t.payment_method === 'transfer')
      .forEach(transaction => {
        const fromSource = transaction.income_source || 'wallet'
        const amount = parseFloat(transaction.amount) || 0
        
        // Parse destination from description: "Transfer from Wallet to Bank" or "Transfer from Digital Wallet to Wallet"
        const description = transaction.description || ''
        let toSource = null
        
        console.log('Processing transfer transaction:', {
          description,
          fromSource,
          amount
        })
        
        // Check for "to [Source]" pattern
        if (description.includes('to Wallet')) {
          toSource = 'wallet'
        } else if (description.includes('to Bank')) {
          toSource = 'bank'
        } else if (description.includes('to Digital Wallet')) {
          toSource = 'digital_wallet'
        }
        
        // Also check for the arrow format "→ Wallet" or "→ Bank" or "→ Digital Wallet"
        if (!toSource) {
          if (description.includes('→ Wallet')) {
            toSource = 'wallet'
          } else if (description.includes('→ Bank')) {
            toSource = 'bank'
          } else if (description.includes('→ Digital Wallet')) {
            toSource = 'digital_wallet'
          }
        }
        
        console.log('Transfer destination detected:', toSource)
        
        if (sources.hasOwnProperty(fromSource)) {
          sources[fromSource] -= amount
          console.log(`Subtracted ${amount} from ${fromSource}`)
        }
        if (toSource && sources.hasOwnProperty(toSource)) {
          sources[toSource] += amount
          console.log(`Added ${amount} to ${toSource}`)
        }
      })

    console.log('Calculated income sources:', sources)
    return sources
  }

  // Memoize the calculated income sources
  const newIncomeSources = useMemo(() => {
    console.log('useIncomeSources: Recalculating with', transactions.length, 'transactions')
    if (transactions.length === 0) {
      return { wallet: 0, bank: 0, digital_wallet: 0 }
    }
    return calculateFromTransactions(transactions)
  }, [transactions])

  // Update income sources when calculated values change
  useEffect(() => {
    console.log('Income sources: Calculated values changed, updating state')
    setIncomeSources(prev => {
      const hasChanged = JSON.stringify(prev) !== JSON.stringify(newIncomeSources)
      if (hasChanged) {
        console.log('Income sources updated:', newIncomeSources)
        return newIncomeSources
      }
      return prev
    })
    setLoading(false)
  }, [newIncomeSources])

  // Get available amount for a source
  const getAvailableAmount = useCallback((source) => {
    return incomeSources[source] || 0
  }, [incomeSources])

  // Check if source has enough funds
  const hasEnoughFunds = useCallback((source, amount) => {
    return (incomeSources[source] || 0) >= amount
  }, [incomeSources])

  return {
    incomeSources,
    loading,
    error,
    getAvailableAmount,
    hasEnoughFunds
  }
} 