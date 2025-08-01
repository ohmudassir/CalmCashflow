import { useMemo } from 'react'

export const useAutoProgress = (savingsGoals, transactions) => {
  // Calculate automatic progress for goals with linked categories
  const autoProgressGoals = useMemo(() => {
    return savingsGoals.map(goal => {
      // If goal has auto-update enabled and linked category
      if (goal.auto_update && goal.linked_category_id) {
        // Find the linked category to get its name
        const linkedCategory = goal.linked_category_name || 'Unknown'
        
        // Calculate net amount from the income source
        // For salary goals, we track salary income minus all expenses
        let totalFromTransactions = 0
        
        if (linkedCategory.toLowerCase().includes('salary')) {
          // For salary: total salary income minus all expenses
          const salaryIncome = transactions
            .filter(t => t.type === 'income' && t.category_id === goal.linked_category_id)
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
          
          const allExpenses = transactions
            .filter(t => t.type === 'expense' && t.payment_method !== 'transfer')
            .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
          
          totalFromTransactions = salaryIncome - allExpenses
        } else {
          // For other categories: income minus expenses from that category
          const linkedTransactions = transactions.filter(transaction => 
            transaction.category_id === goal.linked_category_id
          )
          
          totalFromTransactions = linkedTransactions.reduce((sum, transaction) => {
            const amount = parseFloat(transaction.amount || 0)
            return transaction.type === 'income' ? sum + amount : sum - amount
          }, 0)
        }
        
        // Return goal with auto-calculated current amount (never negative)
        return {
          ...goal,
          auto_calculated_amount: Math.max(totalFromTransactions, 0),
          should_auto_update: true
        }
      }
      
      // Return goal without auto-calculation
      return {
        ...goal,
        auto_calculated_amount: 0,
        should_auto_update: false
      }
    })
  }, [savingsGoals, transactions])

  // Get goals that need auto-updates
  const goalsNeedingUpdate = useMemo(() => {
    return autoProgressGoals.filter(goal => 
      goal.should_auto_update && 
      goal.auto_calculated_amount !== goal.current_amount
    )
  }, [autoProgressGoals])

  // Calculate total auto-contributions
  const totalAutoContributions = useMemo(() => {
    return autoProgressGoals.reduce((total, goal) => 
      total + (goal.auto_calculated_amount || 0), 0
    )
  }, [autoProgressGoals])

  return {
    autoProgressGoals,
    goalsNeedingUpdate,
    totalAutoContributions
  }
} 