import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import { useIncomeSources } from '../hooks/useIncomeSources'
import { ensureTestUser } from '../lib/supabase'

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    currency: 'PKR',
    payment_method: 'cash',
    income_source: 'wallet'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [incomeSourceDropdownOpen, setIncomeSourceDropdownOpen] = useState(false)

  const { categories } = useCategories()
  const { addTransaction } = useTransactions()
  const { incomeSources, getAvailableAmount } = useIncomeSources()

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ensure test user exists
      const userId = await ensureTestUser()
      if (!userId) {
        throw new Error('Failed to create test user')
      }

      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        user_id: userId
      })
      
      // Show success message
      setSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        type: 'expense',
        category_id: '',
        transaction_date: new Date().toISOString().split('T')[0],
        currency: 'PKR',
        payment_method: 'cash',
        income_source: 'wallet'
      })
      
      // Close modal after a short delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error adding transaction:', error)
      let errorMessage = 'Error adding transaction. Please try again.'
      
      if (error.message) {
        errorMessage = error.message
      } else if (error.error_description) {
        errorMessage = error.error_description
      } else if (error.details) {
        errorMessage = error.details
      }
      
      // Check if it's a database schema error
      if (errorMessage.includes('column') || errorMessage.includes('payment_method') || errorMessage.includes('income_source')) {
        errorMessage = 'Database schema needs to be updated. Please add payment_method and income_source columns to the transactions table.'
      }
      
      alert(`Error: ${errorMessage}\n\nPlease run the SQL script to disable RLS for testing.`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'title' ? value.charAt(0).toUpperCase() + value.slice(1) : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Title
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
              Amount
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
                Payment Method
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
              {formData.type === 'income' ? 'Income Source' : 'Spending Source'}
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
                  {formData.type === 'expense' && (
                    <span className="text-gray-500 ml-2">
                      (Rs {getAvailableAmount(formData.income_source).toLocaleString('en-PK')})
                    </span>
                  )}
                </span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {incomeSourceDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    <div 
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, income_source: 'wallet' }))
                        setIncomeSourceDropdownOpen(false)
                      }}
                    >
                      <span>Wallet</span>
                      <span className="text-sm text-gray-500">Rs {getAvailableAmount('wallet').toLocaleString('en-PK')}</span>
                    </div>
                    <div 
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, income_source: 'bank' }))
                        setIncomeSourceDropdownOpen(false)
                      }}
                    >
                      <span>Bank</span>
                      <span className="text-sm text-gray-500">Rs {getAvailableAmount('bank').toLocaleString('en-PK')}</span>
                    </div>
                    <div 
                      className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, income_source: 'digital_wallet' }))
                        setIncomeSourceDropdownOpen(false)
                      }}
                    >
                      <span>Digital Wallet</span>
                      <span className="text-sm text-gray-500">Rs {getAvailableAmount('digital_wallet').toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {formData.type === 'expense' && (
              <p className="text-xs text-gray-500 mt-1">
                Available: Rs {getAvailableAmount(formData.income_source).toLocaleString('en-PK')}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
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
              Date
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
              Description (Optional)
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Adding...' : success ? '✓ Added!' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 