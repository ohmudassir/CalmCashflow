import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { IconSelector } from './IconSelector'

export const CategoryEditModal = ({ category, isOpen, onClose, onCategoryChange }) => {
  const { updateCategory, deleteCategory, categories } = useCategories()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    icon: 'more_horiz',
    color: '#6B7280'
  })

  // Function to get appropriate icon based on category name
  const getIconForCategory = (categoryName) => {
    const name = categoryName.toLowerCase().trim()
    
    // Income category icons - check more specific matches first
    if (name.includes('pocket money')) return 'account_balance_wallet'
    if (name.includes('pocket')) return 'account_balance_wallet'
    if (name.includes('salary') || name.includes('wage') || name.includes('pay')) return 'work'
    if (name.includes('freelance') || name.includes('contract')) return 'laptop'
    if (name.includes('investment') || name.includes('dividend') || name.includes('stock')) return 'trending_up'
    if (name.includes('business') || name.includes('entrepreneur')) return 'store'
    if (name.includes('rental') || name.includes('rent')) return 'home'
    if (name.includes('commission') || name.includes('bonus')) return 'percent'
    if (name.includes('gift') || name.includes('present')) return 'card_giftcard'
    if (name.includes('refund') || name.includes('return')) return 'assignment_return'
    if (name.includes('interest') || name.includes('savings')) return 'account_balance'
    if (name.includes('side') || name.includes('hustle')) return 'psychology'
    if (name.includes('consulting') || name.includes('advisor')) return 'support_agent'
    if (name.includes('online') || name.includes('digital')) return 'public'
    if (name.includes('teaching') || name.includes('tutor')) return 'school'
    if (name.includes('writing') || name.includes('content')) return 'edit'
    if (name.includes('design') || name.includes('graphic')) return 'palette'
    if (name.includes('programming') || name.includes('coding') || name.includes('development')) return 'code'
    if (name.includes('photography') || name.includes('photo')) return 'camera_alt'
    if (name.includes('transport') || name.includes('delivery') || name.includes('uber')) return 'directions_car'
    if (name.includes('real estate') || name.includes('property')) return 'apartment'
    if (name.includes('cash')) return 'account_balance_wallet'
    
    // Expense category icons
    if (name.includes('food') || name.includes('meal') || name.includes('restaurant')) return 'restaurant'
    if (name.includes('transport') || name.includes('gas') || name.includes('fuel')) return 'directions_car'
    if (name.includes('shopping') || name.includes('clothes') || name.includes('fashion')) return 'shopping_bag'
    if (name.includes('entertainment') || name.includes('movie') || name.includes('game')) return 'sports_esports'
    if (name.includes('health') || name.includes('medical') || name.includes('doctor')) return 'local_hospital'
    if (name.includes('education') || name.includes('course') || name.includes('book')) return 'school'
    if (name.includes('bills') || name.includes('utility') || name.includes('electric')) return 'receipt'
    if (name.includes('rent') || name.includes('mortgage') || name.includes('housing')) return 'home'
    if (name.includes('insurance') || name.includes('policy')) return 'security'
    if (name.includes('tax') || name.includes('taxes')) return 'account_balance'
    
    // Default icons for common words
    if (name.includes('money')) return 'account_balance_wallet'
    if (name.includes('card') || name.includes('credit')) return 'credit_card'
    if (name.includes('bank') || name.includes('account')) return 'account_balance'
    if (name.includes('wallet') || name.includes('purse')) return 'account_balance_wallet'
    if (name.includes('phone') || name.includes('mobile')) return 'phone_android'
    if (name.includes('internet') || name.includes('wifi')) return 'wifi'
    if (name.includes('subscription') || name.includes('membership')) return 'card_membership'
    
    // Default fallback
    return 'more_horiz'
  }

  // Function to get appropriate color based on category name
  const getColorForCategory = (categoryName) => {
    const name = categoryName.toLowerCase().trim()
    
    // Income category colors (green/blue tones)
    if (name.includes('salary') || name.includes('wage') || name.includes('pay')) return '#10B981' // Green
    if (name.includes('freelance') || name.includes('contract')) return '#3B82F6' // Blue
    if (name.includes('investment') || name.includes('dividend') || name.includes('stock')) return '#059669' // Emerald
    if (name.includes('business') || name.includes('entrepreneur')) return '#7C3AED' // Purple
    if (name.includes('rental') || name.includes('rent')) return '#0EA5E9' // Sky
    if (name.includes('commission') || name.includes('bonus')) return '#F59E0B' // Amber
    if (name.includes('gift') || name.includes('present')) return '#EC4899' // Pink
    if (name.includes('refund') || name.includes('return')) return '#10B981' // Green
    if (name.includes('interest') || name.includes('savings')) return '#06B6D4' // Cyan
    if (name.includes('side') || name.includes('hustle')) return '#8B5CF6' // Violet
    if (name.includes('consulting') || name.includes('advisor')) return '#6366F1' // Indigo
    if (name.includes('online') || name.includes('digital')) return '#3B82F6' // Blue
    if (name.includes('teaching') || name.includes('tutor')) return '#EF4444' // Red
    if (name.includes('writing') || name.includes('content')) return '#F97316' // Orange
    if (name.includes('design') || name.includes('graphic')) return '#EC4899' // Pink
    if (name.includes('programming') || name.includes('coding') || name.includes('development')) return '#6366F1' // Indigo
    if (name.includes('photography') || name.includes('photo')) return '#8B5CF6' // Violet
    if (name.includes('transport') || name.includes('delivery') || name.includes('uber')) return '#F59E0B' // Amber
    if (name.includes('real estate') || name.includes('property')) return '#059669' // Emerald
    if (name.includes('cash') || name.includes('money') || name.includes('pocket')) return '#10B981' // Green
    
    // Expense category colors (red/orange tones)
    if (name.includes('food') || name.includes('meal') || name.includes('restaurant')) return '#EF4444' // Red
    if (name.includes('shopping') || name.includes('clothes') || name.includes('fashion')) return '#EC4899' // Pink
    if (name.includes('entertainment') || name.includes('movie') || name.includes('game')) return '#F97316' // Orange
    if (name.includes('health') || name.includes('medical') || name.includes('doctor')) return '#DC2626' // Red
    if (name.includes('education') || name.includes('course') || name.includes('book')) return '#7C3AED' // Purple
    if (name.includes('bills') || name.includes('utility') || name.includes('electric')) return '#F59E0B' // Amber
    if (name.includes('insurance') || name.includes('policy')) return '#6366F1' // Indigo
    if (name.includes('tax') || name.includes('taxes')) return '#DC2626' // Red
    
    // Default colors based on transaction type
    if (category?.type === 'income') return '#10B981' // Green for income
    if (category?.type === 'expense') return '#EF4444' // Red for expense
    
    // Default fallback
    return '#6B7280' // Gray
  }

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  // Initialize form data when category changes
  useEffect(() => {
    if (category) {
      console.log('CategoryEditModal: Category changed:', category)
      setFormData({
        name: category.name,
        icon: category.icon,
        color: category.color
      })
    }
  }, [category])

  // Debug: Log when categories change
  useEffect(() => {
    console.log('CategoryEditModal: Categories updated:', categories.length)
  }, [categories])

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setSuccess(false)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) return

    setLoading(true)
    setSuccess(false)

    try {
      const updatedData = {
        name: capitalizeFirstLetter(formData.name.trim()),
        icon: formData.icon,
        color: formData.color
      }

      console.log('CategoryEditModal: Updating category:', category.id, updatedData)
      const result = await updateCategory(category.id, updatedData)
      console.log('CategoryEditModal: Update result:', result)
      setSuccess(true)
      
      // Notify parent of the change
      if (onCategoryChange) {
        onCategoryChange('updated', result)
      }
      
      // Keep modal open briefly to show the dynamic update, then close
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Failed to update category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!category) return

    if (!confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return
    }

    setLoading(true)

    try {
      console.log('CategoryEditModal: Deleting category:', category.id)
      await deleteCategory(category.id)
      console.log('CategoryEditModal: Category deleted successfully')
      
      // Notify parent of the change
      if (onCategoryChange) {
        onCategoryChange('deleted', category)
      }
      
      // Keep modal open briefly to show the dynamic update, then close
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(`Failed to delete category "${category.name}". It may be in use by existing transactions.`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      // Auto-detect icon and color when name changes
      if (name === 'name') {
        updated.icon = getIconForCategory(value)
        updated.color = getColorForCategory(value)
      }
      
      return updated
    })
  }

  console.log('CategoryEditModal: Render with props:', { isOpen, category })
  if (!isOpen || !category) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span 
                  className="material-icons-outlined text-2xl" 
                  style={{ color: formData.color }}
                >
                  {formData.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">{formData.name || 'Category Name'}</h3>
                  <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                placeholder="Enter category name"
              />
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <IconSelector
                selectedIcon={formData.icon}
                onIconSelect={(icon) => setFormData(prev => ({ ...prev, icon }))}
                color={formData.color}
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
            </div>

            {/* Type Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-md">
                <span className="text-sm text-gray-700 capitalize">{category.type}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Category type cannot be changed</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Deleting...' : 'Delete Category'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Updating...' : success ? '✓ Updated!' : 'Update Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 