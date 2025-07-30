import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'

export const TransactionDetailModal = ({ transaction, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    currency: 'PKR'
  })

  // Update form data when transaction changes or when entering edit mode
  useEffect(() => {
    if (transaction && isEditing) {
      setFormData({
                    title: (transaction.title || '').charAt(0).toUpperCase() + (transaction.title || '').slice(1),
        description: transaction.description || '',
        amount: transaction.amount || '',
        type: transaction.type || 'expense',
        category_id: transaction.category_id || '',
        transaction_date: transaction.transaction_date || new Date().toISOString().split('T')[0],
        currency: transaction.currency || 'PKR'
      })
    }
  }, [transaction, isEditing])

  const { categories } = useCategories()
  const { updateTransaction, deleteTransaction } = useTransactions()

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

  if (!isOpen || !transaction) return null

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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-xs text-gray-500">(current: {transaction.categories?.name || 'Uncategorized'})</span>
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
                <p className="text-sm text-gray-600">{transaction.categories?.name || 'Uncategorized'}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-medium ${transaction.type === 'income' ? 'text-purple-600' : 'text-red-500'}`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  Rs {parseFloat(transaction.amount).toLocaleString('en-PK')}
                </div>
                <div className="text-xs text-gray-500 capitalize">{transaction.type}</div>
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
                <span className="text-sm text-gray-900">{transaction.categories?.name || 'Uncategorized'}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">Currency</span>
                <span className="text-sm text-gray-900">{transaction.currency || 'PKR'}</span>
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