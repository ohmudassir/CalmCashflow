import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'

export const TransactionDetailModal = ({ transaction, isOpen, onClose, updateTransaction, deleteTransaction }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [incomeSourceDropdownOpen, setIncomeSourceDropdownOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category_id: null,
    transaction_date: new Date().toISOString().split('T')[0],
    currency: 'PKR',
    payment_method: 'cash',
    income_source: 'wallet'
  })

  // Update form data when transaction changes or when entering edit mode
  useEffect(() => {
    if (transaction && isEditing) {
      setFormData({
                    title: (transaction.title || '').charAt(0).toUpperCase() + (transaction.title || '').slice(1),
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || 'expense',
        category_id: transaction.category_id || null,
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
        currency: transaction.currency || 'PKR',
        payment_method: transaction.payment_method || 'cash',
        income_source: transaction.income_source || 'wallet'
      })
    }
  }, [transaction, isEditing])

  const { categories } = useCategories()
  // Remove this line since updateTransaction and deleteTransaction are now passed as props

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setCategoryDropdownOpen(false)
        setIncomeSourceDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔍 Updating transaction with ID:', transaction?.id)
      console.log('🔍 Transaction object:', transaction)
      console.log('🔍 Form data:', formData)
      
      if (!transaction?.id) {
        throw new Error('Transaction ID is missing or invalid')
      }
      
      await updateTransaction(transaction.id, {
        ...formData,
        amount: parseFloat(formData.amount)
      })
      
      setIsEditing(false)
      onClose()
    } catch (error) {
      console.error('Error updating transaction:', error)
      alert('Error updating transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return
    }

    setLoading(true)

    try {
      await deleteTransaction(transaction.id)
      onClose()
    } catch (error) {
      console.error('Error deleting transaction:', error)
      alert('Error deleting transaction. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !transaction) {
    console.log('❌ TransactionDetailModal: No transaction or modal not open')
    return null
  }
  
  console.log('✅ TransactionDetailModal: Transaction loaded:', transaction.id, transaction.title)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">
            {isEditing ? 'Edit Transaction' : 'Transaction Details'}
          </h2>
          {isEditing && (
            <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Pre-filled with current data
            </div>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formData.type === 'expense'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Expense</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formData.type === 'income'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Income</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-xs text-gray-500">(current: {transaction.title})</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter transaction title"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount <span className="text-xs text-gray-500">(current: Rs {parseFloat(transaction.amount).toLocaleString('en-PK')})</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Payment Method - Only for Expenses */}
            {formData.type === 'expense' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method <span className="text-xs text-gray-500">(current: {transaction.payment_method === 'cash' ? 'Cash' : 'Credit'})</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={formData.payment_method === 'cash'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Cash</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="payment_method"
                      value="credit"
                      checked={formData.payment_method === 'credit'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Credit</span>
                  </label>
                </div>
              </div>
            )}

            {/* Income Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'income' ? 'Income Source' : 'Spending Source'} <span className="text-xs text-gray-500">(current: {transaction.income_source === 'wallet' ? 'Wallet' :
                transaction.income_source === 'bank' ? 'Bank' :
                transaction.income_source === 'digital_wallet' ? 'Digital Wallet' : 'Source'})</span>
              </label>
              <div className="relative dropdown-container">
                <button 
                  type="button"
                  onClick={() => setIncomeSourceDropdownOpen(!incomeSourceDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center justify-between"
                >
                  <span>
                    {formData.income_source === 'wallet' ? 'Wallet' :
                     formData.income_source === 'bank' ? 'Bank' :
                     formData.income_source === 'digital_wallet' ? 'Digital Wallet' : 'Select Source'}
                  </span>
                  <span className="material-icons-outlined text-gray-500">expand_more</span>
                </button>

                {incomeSourceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      {['wallet', 'bank', 'digital_wallet'].map(source => (
                        <div 
                          key={source}
                          className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, income_source: source }))
                            setIncomeSourceDropdownOpen(false)
                          }}
                        >
                          <span>
                            {source === 'wallet' ? 'Wallet' :
                             source === 'bank' ? 'Bank' :
                             source === 'digital_wallet' ? 'Digital Wallet' : source}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-xs text-gray-500">(current: {transaction.categories?.name || 'Uncategorized'})</span>
              </label>
              <div className="relative dropdown-container">
                <button 
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center justify-between"
                >
                  <span>
                    {formData.category_id ? 
                      categories.find(cat => cat.id === formData.category_id)?.name || 'Select Category' : 
                      'Select Category'
                    }
                  </span>
                  <span className="material-icons-outlined text-gray-500">expand_more</span>
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-48 overflow-y-auto">
                    <div className="p-2">
                      {categories
                        .filter(cat => cat.type === formData.type || cat.type === 'both')
                        .map(category => (
                          <div 
                            key={category.id}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, category_id: category.id }))
                              setCategoryDropdownOpen(false)
                            }}
                          >
                            <span className="material-icons-outlined text-sm mr-2" style={{ color: category.color }}>
                              {category.icon}
                            </span>
                            <span>{category.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-xs text-gray-500">(current: {new Date(transaction.transaction_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })})</span>
              </label>
              <input
                type="date"
                name="transaction_date"
                value={formData.transaction_date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Add a description..."
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Transaction'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Transaction Header */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center" 
                   style={{ backgroundColor: `${transaction.categories?.color || '#6750A4'}20` }}>
                <span className="material-icons-outlined text-xl" 
                      style={{ color: transaction.categories?.color || '#6750A4' }}>
                  {transaction.categories?.icon || 'account_balance_wallet'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {transaction.title.charAt(0).toUpperCase() + transaction.title.slice(1)}
                </h3>
                <p className="text-sm text-gray-600">
                  {transaction.type === 'expense' && transaction.payment_method === 'transfer' ? 'Transfer' : 
                   transaction.categories?.name || 'Uncategorized'}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-medium ${transaction.type === 'income' ? 'text-purple-600' : 
                  (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? 'text-blue-600' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : 
                   (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? '↔' : '-'}
                  Rs {parseFloat(transaction.amount).toLocaleString('en-PK')}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {transaction.type === 'expense' && transaction.payment_method === 'transfer' ? 'transfer' : transaction.type}
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Date</span>
                <span className="text-sm text-gray-900">
                  {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Time</span>
                <span className="text-sm text-gray-900">
                  {new Date(transaction.created_at).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Category</span>
                <span className="text-sm text-gray-900">
                  {transaction.type === 'expense' && transaction.payment_method === 'transfer' ? 'Transfer' : 
                   transaction.categories?.name || 'Uncategorized'}
                </span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Currency</span>
                <span className="text-sm text-gray-900">{transaction.currency || 'PKR'}</span>
              </div>

              {transaction.type === 'expense' && transaction.payment_method !== 'transfer' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Payment Method</span>
                  <span className="text-sm text-gray-900">
                    {transaction.payment_method === 'cash' ? '💵 Cash' : '💳 Credit'}
                  </span>
                </div>
              )}

              {transaction.type === 'expense' && transaction.payment_method === 'transfer' && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Transfer Details</span>
                  <span className="text-sm text-gray-900">
                    {(() => {
                      const description = transaction.description || ''
                      if (description.includes('to Wallet')) return '👛 Wallet'
                      if (description.includes('to Bank')) return '🏦 Bank'
                      if (description.includes('to Digital Wallet')) return '📱 Digital Wallet'
                      return 'Destination'
                    })()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  {transaction.type === 'income' ? 'Income Source' : 
                   (transaction.type === 'expense' && transaction.payment_method === 'transfer') ? 'From Source' : 'Spending Source'}
                </span>
                <span className="text-sm text-gray-900">
                  {transaction.income_source === 'wallet' ? '👛 Wallet' :
                   transaction.income_source === 'bank' ? '🏦 Bank' :
                   transaction.income_source === 'digital_wallet' ? '📱 Digital Wallet' : '💼 Source'}
                </span>
              </div>

              {transaction.description && (
                <div className="py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600 block mb-1">Description</span>
                  <p className="text-sm text-gray-900">{transaction.description}</p>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Created</span>
                <span className="text-sm text-gray-900">
                  {new Date(transaction.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {transaction.updated_at !== transaction.created_at && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-sm font-medium text-gray-600">Last Updated</span>
                  <span className="text-sm text-gray-900">
                    {new Date(transaction.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <span className="material-icons-outlined text-sm mr-2">edit</span>
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
              >
                <span className="material-icons-outlined text-sm mr-2">delete</span>
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 