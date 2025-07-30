import { useState, useMemo, useEffect } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { useCategories } from './hooks/useCategories'
import { AddTransactionModal } from './components/AddTransactionModal'
import { TransactionDetailModal } from './components/TransactionDetailModal'

function App() {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedTypes, setSelectedTypes] = useState(['All'])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Use custom hooks for data
  const { 
    transactions, 
    loading: transactionsLoading, 
    error: transactionsError
  } = useTransactions((updatedTransactions) => {
    console.log('Transactions updated via callback:', updatedTransactions)
    // Update local state immediately
    setCurrentTransactions(updatedTransactions)
    // Force immediate re-render
    setUpdateTrigger(prev => prev + 1)
    // Also update a timestamp to force re-render
    setLastUpdate(Date.now())
  })
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useCategories()

  // Debug: Log when transactions change
  useEffect(() => {
    console.log('Transactions changed:', transactions)
  }, [transactions])

  // Force re-render when transactions change
  const [updateTrigger, setUpdateTrigger] = useState(0)
  const [transactionCount, setTransactionCount] = useState(0)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [currentTransactions, setCurrentTransactions] = useState([])
  
  useEffect(() => {
    console.log('Transactions length changed from', transactionCount, 'to', transactions.length)
    setTransactionCount(transactions.length)
    setUpdateTrigger(prev => prev + 1)
  }, [transactions, transactionCount])

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
    // Use currentTransactions if available, otherwise use transactions from hook
    const transactionData = currentTransactions.length > 0 ? currentTransactions : transactions
    console.log('Recalculating summary with transactions:', transactionData)
    
    const income = transactionData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const expense = transactionData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    
    const balance = income - expense
    
    const summaryData = {
      income,
      expense,
      balance
    }
    
    console.log('Summary calculated:', summaryData)
    return summaryData
  }, [transactions, currentTransactions, updateTrigger, lastUpdate])

  // Filter transactions based on selected categories and types
  const filteredTransactions = useMemo(() => {
    const transactionData = currentTransactions.length > 0 ? currentTransactions : transactions
    return transactionData.filter(transaction => {
      const categoryMatch = selectedCategories.length === 0 || 
        selectedCategories.includes(transaction.categories?.name)
      
      const typeMatch = selectedTypes.includes('All') || 
        selectedTypes.includes(transaction.type === 'income' ? 'Income' : 'Expense')
      
      return categoryMatch && typeMatch
    })
  }, [transactions, currentTransactions, selectedCategories, selectedTypes, updateTrigger, lastUpdate])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
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
    return groups
  }, [filteredTransactions, updateTrigger, lastUpdate])

  // Loading state
  if (transactionsLoading || categoriesLoading) {
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
  if (transactionsError || categoriesError) {
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
    <div key={updateTrigger} className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-50 to-white pt-4">
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
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-purple-700 active:bg-purple-500 shadow-sm hover:shadow-md transition-all duration-200 font-medium flex items-center mt-2 sm:mt-0 text-xs sm:text-base"
            >
              <span className="material-icons-outlined mr-1 sm:mr-2 text-base sm:text-lg">add</span>
              Add Transaction
            </button>
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
                <span className="material-icons-outlined text-purple-600">trending_up</span>
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
                <span className="text-sm font-medium text-pink-500">Savings</span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
                             <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900">
                 {summary.balance > 0 ? 
                   `Rs ${summary.balance.toLocaleString('en-PK')}` : 'Rs 0.00'
                 }
               </div>
              <div className="text-xs text-purple-600">Net balance</div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div>
          <h2 className="text-xl sm:text-2xl font-medium text-gray-900 mb-2">Transactions</h2>
          <p className="text-gray-600 mb-4 sm:mb-6">
            You had {transactions.filter(t => t.type === 'income').length} incomes and {transactions.filter(t => t.type === 'expense').length} expenses this month
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
                        <div key={transaction.id} className="transaction-item">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center" 
                                 style={{ backgroundColor: `${transaction.categories?.color || '#6750A4'}20` }}>
                              <span className="material-icons-outlined" 
                                    style={{ color: transaction.categories?.color || '#6750A4' }}>
                                {transaction.categories?.icon || 'account_balance_wallet'}
                              </span>
                            </div>
                            <div>
                              <div className="text-lg font-medium text-gray-900">
                  {transaction.title.charAt(0).toUpperCase() + transaction.title.slice(1)}
                </div>
                              <div className="flex items-center space-x-2">
                                <span className="md-chip">{transaction.categories?.name || 'Uncategorized'}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                                                         <span className={`text-lg font-medium ${transaction.type === 'income' ? 'text-purple-600' : 'text-red-500'}`}>
                               {transaction.type === 'income' ? '+' : '-'}
                               Rs {parseFloat(transaction.amount).toLocaleString('en-PK')}
                             </span>
                                                         <button 
                               onClick={() => {
                                 setSelectedTransaction(transaction)
                                 setShowDetailModal(true)
                               }}
                               className="text-gray-500 hover:text-gray-700 transition-colors"
                             >
                               <span className="material-icons-outlined">more_vert</span>
                             </button>
                          </div>
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
        onClose={() => {
          setShowAddModal(false)
          // Force immediate update when modal closes
          setLastUpdate(Date.now())
          setUpdateTrigger(prev => prev + 1)
        }} 
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal 
        transaction={selectedTransaction}
        isOpen={showDetailModal} 
        onClose={() => {
          setShowDetailModal(false)
          setSelectedTransaction(null)
          // Force immediate update when modal closes
          setLastUpdate(Date.now())
          setUpdateTrigger(prev => prev + 1)
        }} 
      />
    </div>
  )
}

export default App
