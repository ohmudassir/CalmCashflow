import { useState, useMemo, useEffect } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { useCategories } from './hooks/useCategories'
import { useIncomeSources } from './hooks/useIncomeSources'
import { useSavingsGoals } from './hooks/useSavingsGoals'
import { useAutoProgress } from './hooks/useAutoProgress'
import { AddTransactionModal } from './components/AddTransactionModal'
import { TransactionDetailModal } from './components/TransactionDetailModal'
import { TransferModal } from './components/TransferModal'
import { SavingsGoalModal } from './components/SavingsGoalModal'
import { UpdateProgressModal } from './components/UpdateProgressModal'


function App() {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTypes, setSelectedTypes] = useState(['All'])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false)
  const [showUpdateProgressModal, setShowUpdateProgressModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isEditingGoal, setIsEditingGoal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)


  // Use custom hooks for data
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions
  } = useTransactions()
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  // Memoize transactions to prevent unnecessary re-triggers
  const memoizedTransactions = useMemo(() => transactions, [transactions])

  const { 
    incomeSources, 
    loading: incomeSourcesLoading, 
    error: incomeSourcesError 
  } = useIncomeSources(memoizedTransactions)

  const {
    savingsGoals,
    loading: savingsGoalsLoading,
    error: savingsGoalsError,
    fetchSavingsGoals,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    calculateProgress,
    getTotalSavings,
    getTotalTarget
  } = useSavingsGoals()

  // Auto progress calculation
  const {
    autoProgressGoals,
    goalsNeedingUpdate,
    totalAutoContributions
  } = useAutoProgress(savingsGoals, transactions)



  // Removed automatic initialization to prevent duplicate categories
  // Categories can be added manually through the Category Manager

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true)
    console.log('Manual refresh triggered')
    try {
      await Promise.all([
        fetchTransactions(),
        fetchSavingsGoals()
      ])
      console.log('Manual refresh completed')
    } catch (error) {
      console.error('Manual refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  // Calculate summary directly from transactions
  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const expense = transactions
      .filter(t => t.type === 'expense' && t.payment_method !== 'transfer')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const balance = income - expense
    
    const summaryData = {
      income,
      expense,
      balance
    }
    
    console.log('Summary calculated:', summaryData)
    return summaryData
  }, [transactions])

  // Filter transactions based on selected categories and types
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(transaction.categories?.name)
      
      const typeMatch = selectedTypes.includes('All') || 
        selectedTypes.includes(transaction.type === 'income' ? 'Income' : 
                             (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? 'Transfer' : 'Expense')
      
      return categoryMatch && typeMatch
    })
  }, [transactions, selectedCategories, selectedTypes])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    console.log('🔄 Recalculating grouped transactions with:', filteredTransactions.length, 'transactions')
    const groups = {}
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.transaction_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(transaction)
    })
    console.log('📅 Grouped transactions:', Object.keys(groups))
    return groups
  }, [filteredTransactions])

  // Loading state
  if (transactionsLoading || categoriesLoading || incomeSourcesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (transactionsError || categoriesError || incomeSourcesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <span className="material-icons-outlined text-4xl">error</span>
          </div>
          <p className="text-gray-600">Error loading data. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-50 to-white pt-4">
            {/* Top Navigation Bar */}
      <nav className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-lg mx-6 sm:mx-8 md:mx-16 lg:mx-20 xl:mx-24 mt-0 mb-6 sm:mb-8 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border border-white/30">
        <div className="flex items-center justify-center">
          {/* Centered Heading with Emoji */}
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900">Calm Cashflow 💰</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8">
        {/* Summary Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900">Summary</h1>
            {/* Add Button - Top aligned with summary */}
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                     <button
                       onClick={() => setShowAddModal(true)}
                       className="bg-purple-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-xs sm:text-base"
                     >
                       <span className="material-icons-outlined mr-1 sm:mr-2 text-base sm:text-lg">add</span>
                       Add Transaction
                     </button>

                     <button
                       onClick={handleRefresh}
                       disabled={isRefreshing}
                       className="text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 hover:border-gray-400"
                       title={isRefreshing ? 'Refreshing...' : 'Refresh'}
                     >
                       <span className={`material-icons-outlined text-lg ${isRefreshing ? 'animate-spin' : ''}`}>
                         refresh
                       </span>
                     </button>
                   </div>
          </div>
          
          {/* Net Total */}
          <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-1">Net Total</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900">
               {summary.balance > 0 ? 
                 `Rs ${summary.balance.toLocaleString('en-PK')}` : 'Rs 0.00'
               }
             </div>
             <div className="text-sm text-purple-600">
               {summary.income > 0 ? 
                 `${Math.round((summary.balance / summary.income) * 100)}% of income` : 
                 'No income data'
               }
             </div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="flex h-full">
                  {summary.expense > 0 && (
                    <div className="bg-red-500 h-full" style={{ 
                      width: `${(summary.expense / (summary.income + summary.expense)) * 100}%` 
                    }}></div>
                  )}
                  {summary.income > 0 && (
                    <div className="bg-purple-600 h-full" style={{ 
                      width: `${(summary.income / (summary.income + summary.expense)) * 100}%` 
                    }}></div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{new Date().getFullYear()}</span>
                <span className="material-icons-outlined text-sm text-gray-600">expand_more</span>
              </div>
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            <div className="md-card p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">
                  Income 
                  <span className="text-xs">
                    {summary.income > 0 ? ` ${Math.round((summary.income / (summary.income + summary.expense)) * 100)}%` : ''}
                  </span>
                </span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
                                            <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                 {summary.income > 0 ? 
                   `Rs ${summary.income.toLocaleString('en-PK')}` : 'Rs 0.00'
                 }
               </div>
               <div className="text-xs text-purple-600">
                 {summary.income > 0 ? 
                   `${Math.round((summary.income / (summary.income + summary.expense)) * 100)}% of total` : 
                   'No income data'
                 }
               </div>
            </div>

            <div className="md-card p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-500">
                  Expenses 
                  <span className="text-xs">
                    {summary.income > 0 ? ` ${Math.round((summary.expense / summary.income) * 100)}%` : ''}
                  </span>
                </span>
                <span className="material-icons-outlined text-red-500">trending_down</span>
              </div>
                                            <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                 {summary.expense > 0 ? 
                   `Rs ${summary.expense.toLocaleString('en-PK')}` : 'Rs 0.00'
                 }
               </div>
               <div className="text-xs text-purple-600">
                 {summary.income > 0 ? 
                   `${Math.round((summary.expense / summary.income) * 100)}% of income` : 
                   'No expense data'
                 }
               </div>
            </div>

            <div className="md-card p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">Investment</span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
                             <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                 {summary.income > 0 ? 
                   `Rs ${(summary.income * 0.2).toLocaleString('en-PK')}` : 'Rs 0.00'
                 }
               </div>
              <div className="text-xs text-purple-600">20% of income</div>
            </div>

            <div className="md-card p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-500">Savings Goals</span>
                <button
                  onClick={() => {
                    setSelectedGoal(null)
                    setIsEditingGoal(false)
                    setShowSavingsGoalModal(true)
                  }}
                  className="text-purple-600 hover:text-purple-700"
                >
                  <span className="material-icons-outlined text-sm">add</span>
                </button>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                Rs {autoProgressGoals.reduce((total, goal) => {
                  const currentAmount = goal.should_auto_update ? 
                    goal.auto_calculated_amount : 
                    (goal.current_amount || 0)
                  return total + currentAmount
                }, 0).toLocaleString('en-PK')}
              </div>
              <div className="text-xs text-purple-600">
                {(() => {
                  const totalSaved = autoProgressGoals.reduce((total, goal) => {
                    const currentAmount = goal.should_auto_update ? 
                      goal.auto_calculated_amount : 
                      (goal.current_amount || 0)
                    return total + currentAmount
                  }, 0)
                  
                  const totalTarget = autoProgressGoals.reduce((total, goal) => 
                    total + (goal.target_amount || 0), 0
                  )
                  
                  const progressPercentage = totalTarget > 0 ? 
                    ((totalSaved / totalTarget) * 100).toFixed(1) : 0
                  
                  return `${progressPercentage}% of target (Rs ${totalTarget.toLocaleString('en-PK')})`
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Account Balances Summary */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900">Account Balances</h2>
            <button 
              onClick={() => setShowTransferModal(true)}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm"
            >
              <span className="material-icons-outlined mr-1 text-sm">swap_horiz</span>
              Transfer
            </button>
          </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="md-card p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-600">👛 Wallet</span>
                  <span className="material-icons-outlined text-purple-600">account_balance_wallet</span>
                </div>
                <div className="text-lg sm:text-xl font-medium text-gray-900">
                  Rs {incomeSources.wallet.toLocaleString('en-PK')}
                </div>
                <div className="text-xs text-gray-500">Remaining balance</div>
              </div>

              <div className="md-card p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">🏦 Bank</span>
                  <span className="material-icons-outlined text-blue-600">account_balance</span>
                </div>
                <div className="text-lg sm:text-xl font-medium text-gray-900">
                  Rs {incomeSources.bank.toLocaleString('en-PK')}
                </div>
                <div className="text-xs text-gray-500">Remaining balance</div>
              </div>

              <div className="md-card p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">📱 Digital Wallet</span>
                  <span className="material-icons-outlined text-green-600">smartphone</span>
                </div>
                <div className="text-lg sm:text-xl font-medium text-gray-900">
                  Rs {incomeSources.digital_wallet.toLocaleString('en-PK')}
                </div>
                <div className="text-xs text-gray-500">Remaining balance</div>
              </div>
            </div>
        </div>

        {/* Savings Goals Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-medium text-gray-900">Savings Goals</h2>
            <button 
              onClick={() => {
                setSelectedGoal(null)
                setIsEditingGoal(false)
                setShowSavingsGoalModal(true)
              }}
              className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center text-sm"
            >
              <span className="material-icons-outlined mr-1 text-sm">add</span>
              Add Goal
            </button>
          </div>

          {savingsGoalsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading savings goals...</p>
            </div>
          ) : savingsGoalsError ? (
            <div className="text-center py-8">
              <span className="material-icons-outlined text-4xl text-red-500">error</span>
              <p className="text-red-600 mt-2">Error loading savings goals</p>
            </div>
          ) : savingsGoals.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-icons-outlined text-6xl text-gray-300">savings</span>
              <p className="text-gray-600 mt-2">No savings goals yet</p>
              <p className="text-gray-500 text-sm">Create your first savings goal to start tracking your progress</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {autoProgressGoals.map((goal) => {
                // Use auto-calculated amount if available, otherwise use manual amount
                const currentAmount = goal.should_auto_update ? 
                  goal.auto_calculated_amount : 
                  (goal.current_amount || 0)
                
                const progress = calculateProgress(goal, currentAmount)
                const remaining = (goal.target_amount || 0) - currentAmount
                
                return (
                  <div key={goal.id} className="md-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        )}
                        <div className="flex items-center space-x-2 text-xs">
                          <span className={`px-2 py-1 rounded-full ${
                            goal.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            goal.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {goal.priority}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                            {goal.category}
                          </span>
                          {goal.should_auto_update && (
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center">
                              <span className="material-icons-outlined text-xs mr-1">sync</span>
                              Auto
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            // Find the auto-calculated version of this goal
                            const autoGoal = autoProgressGoals.find(g => g.id === goal.id) || goal
                            setSelectedGoal(autoGoal)
                            setShowUpdateProgressModal(true)
                          }}
                          className="text-gray-400 hover:text-blue-600"
                          title="Update Progress"
                        >
                          <span className="material-icons-outlined text-sm">trending_up</span>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedGoal(goal)
                            setIsEditingGoal(true)
                            setShowSavingsGoalModal(true)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                          title="Edit Goal"
                        >
                          <span className="material-icons-outlined text-sm">edit</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this goal?')) {
                              deleteSavingsGoal(goal.id)
                            }
                          }}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Goal"
                        >
                          <span className="material-icons-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900 font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress >= 100 ? 'bg-green-500' :
                            progress >= 75 ? 'bg-blue-500' :
                            progress >= 50 ? 'bg-yellow-500' :
                            progress >= 25 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Current:</span>
                        <span className="text-gray-900 font-medium">
                          Rs {currentAmount.toLocaleString('en-PK')}
                          {goal.should_auto_update && goal.auto_calculated_amount > 0 && (
                            <span className="text-blue-600 text-xs ml-1">(Auto)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Target:</span>
                        <span className="text-gray-900 font-medium">
                          Rs {(goal.target_amount || 0).toLocaleString('en-PK')}
                        </span>
                      </div>
                      {remaining > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Remaining:</span>
                          <span className="text-red-600 font-medium">
                            Rs {remaining.toLocaleString('en-PK')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Target Date */}
                    {goal.target_date && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Target Date:</span>
                          <span className="text-gray-900">
                            {new Date(goal.target_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}


        </div>

        {/* Transactions Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">Transactions</h2>
          <p className="text-gray-600 mb-4 sm:mb-6">
            You had {transactions.filter(t => t.type === 'income').length} incomes, {transactions.filter(t => t.type === 'expense' && t.payment_method !== 'transfer').length} expenses, and {transactions.filter(t => t.type === 'expense' && t.payment_method === 'transfer').length} transfers this month
          </p>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative">
              <button 
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="bg-white border border-gray-300 rounded-md px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-base text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
              >
                <span>Type</span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {typeDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes('All')}
                          onChange={() => toggleType('All')}
                          className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm">All</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes('Income')}
                          onChange={() => toggleType('Income')}
                          className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm">Income</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes('Expense')}
                          onChange={() => toggleType('Expense')}
                          className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm">Expense</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          checked={selectedTypes.includes('Transfer')}
                          onChange={() => toggleType('Transfer')}
                          className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                        />
                        <span className="text-sm">Transfer</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="bg-white border border-gray-300 rounded-md px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-base text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
              >
                <span>Category</span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-white border border-gray-300 rounded-md px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 w-full mb-4"
                    />
                    
                    <div className="space-y-4">
                      {categories.map(category => (
                        <label key={category.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            checked={selectedCategories.includes(category.name)}
                            onChange={() => toggleCategory(category.name)}
                            className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                      <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">View all categories</a>
                      <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">Add new category</a>
                    </div>
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Transaction List */}
          <div className="md-card">
            {Object.keys(groupedTransactions).length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <span className="material-icons-outlined text-6xl">receipt_long</span>
                </div>
                <p className="text-gray-600">No transactions found</p>
                <p className="text-sm text-gray-500">Add your first transaction to get started</p>
              </div>
            ) : (
              <>
                {Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
                  <div key={date}>
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">{date}</h3>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {dateTransactions.map(transaction => (
                        <div key={transaction.id} className="transaction-item p-4">
                          <button 
                            onClick={() => {
                              setSelectedTransaction(transaction)
                              setShowDetailModal(true)
                            }}
                            className="w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                                   style={{ backgroundColor: `${transaction.categories?.color || '#6750A4'}20` }}>
                                <span className="material-icons-outlined" 
                                      style={{ color: transaction.categories?.color || '#6750A4' }}>
                                  {transaction.categories?.icon || 'account_balance_wallet'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="text-lg font-medium text-gray-900">
                                  {transaction.title.charAt(0).toUpperCase() + transaction.title.slice(1)}
                                </div>
                                                              <div className="flex items-center space-x-2">
                                {transaction.type === 'expense' && transaction.payment_method === 'transfer' ? (
                                  <span className="md-chip bg-purple-100 text-purple-800">Transfer</span>
                                ) : (
                                  <span className="md-chip">{transaction.categories?.name || 'Uncategorized'}</span>
                                )}
                                {/* Desktop version - show chips for larger screens */}
                                <div className="hidden sm:flex items-center space-x-2">
                                  {transaction.type === 'expense' && transaction.payment_method !== 'transfer' && (
                                    <>
                                      <span className="md-chip text-xs bg-blue-100 text-blue-800">
                                        {transaction.payment_method === 'cash' ? '💵 Cash' : '💳 Credit'}
                                      </span>
                                      <span className="md-chip text-xs bg-green-100 text-green-800">
                                        {transaction.income_source === 'wallet' ? '👛 Wallet' :
                                         transaction.income_source === 'bank' ? '🏦 Bank' :
                                         transaction.income_source === 'digital_wallet' ? '📱 Digital Wallet' : '💼 Source'}
                                      </span>
                                    </>
                                  )}
                                  {transaction.type === 'expense' && transaction.payment_method === 'transfer' && (
                                    <span className="md-chip text-xs bg-purple-100 text-purple-800">
                                      🔄 {transaction.income_source === 'wallet' ? '👛' :
                                          transaction.income_source === 'bank' ? '🏦' :
                                          transaction.income_source === 'digital_wallet' ? '📱' : '💼'} 
                                      → {(() => {
                                          const description = transaction.description || ''
                                          if (description.includes('to Wallet')) return '👛'
                                          if (description.includes('to Bank')) return '🏦'
                                          if (description.includes('to Digital Wallet')) return '📱'
                                          return '💼'
                                        })()}
                                    </span>
                                  )}
                                </div>
                              </div>
                                {/* Mobile-friendly payment method and income source display */}
                                <div className="mt-1 text-xs text-gray-500 space-y-1 sm:hidden">
                                  {transaction.type === 'expense' && transaction.payment_method !== 'transfer' && (
                                    <>
                                      <div className="flex items-center">
                                        <span className="material-icons-outlined text-xs mr-1">payment</span>
                                        <span>{transaction.payment_method === 'cash' ? 'Cash Payment' : 'Credit Payment'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="material-icons-outlined text-xs mr-1">account_balance_wallet</span>
                                        <span>
                                          {transaction.income_source === 'wallet' ? 'Wallet' :
                                           transaction.income_source === 'bank' ? 'Bank' :
                                           transaction.income_source === 'digital_wallet' ? 'Digital Wallet' : 'Source'}
                                        </span>
                                      </div>
                                    </>
                                  )}
                                  {transaction.type === 'expense' && transaction.payment_method === 'transfer' && (
                                    <div className="flex items-center">
                                      <span className="material-icons-outlined text-xs mr-1">swap_horiz</span>
                                      <span>
                                        {transaction.income_source === 'wallet' ? 'Wallet' :
                                         transaction.income_source === 'bank' ? 'Bank' :
                                         transaction.income_source === 'digital_wallet' ? 'Digital Wallet' : 'Source'} 
                                        → 
                                        {(() => {
                                          const description = transaction.description || ''
                                          if (description.includes('to Wallet')) return 'Wallet'
                                          if (description.includes('to Bank')) return 'Bank'
                                          if (description.includes('to Digital Wallet')) return 'Digital Wallet'
                                          return 'Destination'
                                        })()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                                            <span className={`text-lg font-medium ${transaction.type === 'income' ? 'text-purple-600' : (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? 'text-blue-600' : 'text-red-500'}`}>
                              {transaction.type === 'income' ? '+' : (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? '↔' : '-'}
                              Rs {parseFloat(transaction.amount).toLocaleString('en-PK')}
                            </span>
                              </div>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="p-4 text-center">
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">Load More</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        transactions={transactions}
        addTransaction={addTransaction}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal 
        transaction={selectedTransaction}
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false)
          setSelectedTransaction(null)
        }}
        updateTransaction={updateTransaction}
        deleteTransaction={deleteTransaction}
      />

      {/* Transfer Modal */}
      <TransferModal 
        isOpen={showTransferModal} 
        onClose={() => setShowTransferModal(false)}
        transactions={transactions}
      />

      {/* Savings Goal Modal */}
      <SavingsGoalModal 
        isOpen={showSavingsGoalModal} 
        onClose={() => {
          setShowSavingsGoalModal(false)
          setSelectedGoal(null)
          setIsEditingGoal(false)
        }}
        addSavingsGoal={addSavingsGoal}
        updateSavingsGoal={updateSavingsGoal}
        goal={selectedGoal}
        isEditing={isEditingGoal}
        categories={categories}
      />

      {/* Update Progress Modal */}
      <UpdateProgressModal 
        isOpen={showUpdateProgressModal} 
        onClose={() => {
          setShowUpdateProgressModal(false)
          setSelectedGoal(null)
        }}
        goal={selectedGoal}
        updateSavingsGoal={updateSavingsGoal}
      />


    </div>
  )
}

export default App
