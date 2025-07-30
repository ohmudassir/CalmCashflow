import { useState } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import { ensureTestUser } from '../lib/supabase'

export const AddTransactionModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    currency: 'PKR'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { categories } = useCategories()
  const { addTransaction } = useTransactions()

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
        currency: 'PKR'
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

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories
                .filter(cat => cat.type === formData.type || cat.type === 'both')
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
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