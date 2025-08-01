import { useState, useEffect } from 'react'
import { ensureTestUser } from '../lib/supabase'

export const SavingsGoalModal = ({ 
  isOpen, 
  onClose, 
  addSavingsGoal, 
  updateSavingsGoal, 
  goal = null, 
  isEditing = false,
  categories = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '',
    target_date: '',
    category: 'savings',
    priority: 'medium',
    linked_category_id: '', // New field for transaction category linking
    auto_update: false // New field to enable/disable automatic updates
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Initialize form with goal data if editing
  useEffect(() => {
    if (goal && isEditing) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        target_amount: goal.target_amount?.toString() || '',
        current_amount: goal.current_amount?.toString() || '',
        target_date: goal.target_date || '',
        category: goal.category || 'savings',
        priority: goal.priority || 'medium',
        linked_category_id: goal.linked_category_id || '',
        auto_update: goal.auto_update || false
      })
    } else {
      setFormData({
        title: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        category: 'savings',
        priority: 'medium',
        linked_category_id: '',
        auto_update: false
      })
    }
  }, [goal, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Ensure test user exists
      const userId = await ensureTestUser()
      if (!userId) {
        throw new Error('Failed to create test user')
      }

      const goalData = {
        ...formData,
        target_amount: parseFloat(formData.target_amount) || 0,
        current_amount: parseFloat(formData.current_amount) || 0,
        user_id: userId
      }

      if (isEditing && goal) {
        await updateSavingsGoal(goal.id, goalData)
      } else {
        await addSavingsGoal(goalData)
      }
      
      // Show success message
      setSuccess(true)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        target_amount: '',
        current_amount: '',
        target_date: '',
        category: 'savings',
        priority: 'medium',
        linked_category_id: '',
        auto_update: false
      })
      
      // Close modal after a short delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error saving goal:', error)
      alert(`Error: ${error.message || 'Failed to save goal. Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Get available categories for linking
  const getAvailableCategories = () => {
    return categories.filter(cat => cat.type === 'income' || cat.type === 'both')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">
            {isEditing ? 'Edit Savings Goal' : 'Add Savings Goal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {isEditing ? 'Goal updated successfully!' : 'Goal added successfully!'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="e.g., Emergency Fund, Vacation, House Down Payment"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Describe your savings goal..."
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Amount (PKR) *
            </label>
            <input
              type="number"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Amount (PKR)
            </label>
            <input
              type="number"
              name="current_amount"
              value={formData.current_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Date
            </label>
            <input
              type="date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="savings">Savings</option>
              <option value="emergency">Emergency Fund</option>
              <option value="investment">Investment</option>
              <option value="vacation">Vacation</option>
              <option value="education">Education</option>
              <option value="vehicle">Vehicle</option>
              <option value="property">Property</option>
              <option value="wedding">Wedding</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Auto Update Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Automatic Progress Updates
              </label>
              <input
                type="checkbox"
                name="auto_update"
                checked={formData.auto_update}
                onChange={handleChange}
                className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
              />
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Enable to automatically update progress from linked transaction categories
            </p>

            {formData.auto_update && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link to Transaction Category
                </label>
                <select
                  name="linked_category_id"
                  value={formData.linked_category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                >
                  <option value="">Select a category (optional)</option>
                  {getAvailableCategories().map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.type})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Transactions in this category will automatically contribute to your goal
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Goal' : 'Add Goal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 