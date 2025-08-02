import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'
import { useTransactions } from '../hooks/useTransactions'
import { useIncomeSources } from '../hooks/useIncomeSources'
import { ensureTestUser } from '../lib/supabase'
import { IconSelector } from './IconSelector'

export const AddTransactionModal = ({ isOpen, onClose, transactions = [] }) => {
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
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
      setNewCategory({
        name: '',
        icon: 'more_horiz',
        color: getColorForCategory('')
      })
      setShowAddCategoryForm(false)
    }
  }, [isOpen])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [incomeSourceDropdownOpen, setIncomeSourceDropdownOpen] = useState(false)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategory, setNewCategory] = useState({
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
    if (formData.type === 'income') return '#10B981' // Green for income
    if (formData.type === 'expense') return '#EF4444' // Red for expense
    
    // Default fallback
    return '#6B7280' // Gray
  }

  // Function to capitalize first letter
  const capitalizeFirstLetter = (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useCategories()
  
  // Debug: Log when categories change
  useEffect(() => {
    console.log('AddTransactionModal: Categories updated:', categories.length, categories.map(c => ({ id: c.id, name: c.name, type: c.type })))
  }, [categories])
  const { addTransaction } = useTransactions()
  const { incomeSources, getAvailableAmount } = useIncomeSources(transactions)

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
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: name === 'title' ? value.charAt(0).toUpperCase() + value.slice(1) : value
      }
      
      // If transaction type changed, clear category selection if it doesn't match new type
      if (name === 'type' && prev.category_id) {
        const selectedCategory = categories.find(cat => cat.id === prev.category_id)
                          if (selectedCategory && selectedCategory.type !== value && selectedCategory.type !== 'both') {
                    updated.category_id = ''
                  }
      }
      
      return updated
    })
  }

  const handleAddCategory = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    }
    if (!newCategory.name.trim()) return

    try {
      // Check if category already exists
      const existingCategory = categories.find(cat => 
        cat.name.toLowerCase().trim() === newCategory.name.toLowerCase().trim() &&
        (cat.type === formData.type || cat.type === 'both')
      )

      if (existingCategory) {
        // If category exists, just select it
        setFormData(prev => ({ ...prev, category_id: existingCategory.id }))
        setShowAddCategoryForm(false)
        setNewCategory({
          name: '',
          icon: 'more_horiz',
          color: '#6B7280'
        })
        return
      }

      // Ensure we have the correct icon
      const finalIcon = newCategory.icon || getIconForCategory(newCategory.name.trim())
      
      const categoryData = {
        name: capitalizeFirstLetter(newCategory.name.trim()),
        type: formData.type,
        icon: finalIcon,
        color: newCategory.color
      }

      const addedCategory = await addCategory(categoryData)
      
      // Set the new category as selected only if it matches the current transaction type
      // This ensures it's only selected for the current income/expense type
      if (addedCategory.type === formData.type || addedCategory.type === 'both') {
        setFormData(prev => ({ ...prev, category_id: addedCategory.id }))
      }
      
      // Reset the form
      setNewCategory({
        name: '',
        icon: 'more_horiz',
        color: getColorForCategory('')
      })
      setShowAddCategoryForm(false)
      
      // Keep the dropdown open so user can see the new category immediately
      // Don't close the category dropdown - let user see the new category
    } catch (error) {
      console.error('Error adding category:', error)
      alert('Failed to add category. Please try again.')
    }
  }



  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategory({
      name: category.name,
      icon: category.icon,
      color: category.color
    })
    setShowAddCategoryForm(true)
  }

  const handleUpdateCategory = async (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
    }
    
    if (!newCategory.name.trim() || !editingCategory) return

    try {
      // Ensure we have the correct icon
      const finalIcon = newCategory.icon || getIconForCategory(newCategory.name.trim())
      
      const categoryData = {
        name: capitalizeFirstLetter(newCategory.name.trim()),
        icon: finalIcon,
        color: newCategory.color
      }

      await updateCategory(editingCategory.id, categoryData)
      
      // Reset the form
      setNewCategory({
        name: '',
        icon: 'more_horiz',
        color: getColorForCategory('')
      })
      setEditingCategory(null)
      setShowAddCategoryForm(false)
      
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Failed to update category. Please try again.')
    }
  }

  const handleCancelEdit = () => {
    setEditingCategory(null)
    setNewCategory({
      name: '',
      icon: 'more_horiz',
      color: getColorForCategory('')
    })
    setShowAddCategoryForm(false)
  }

  const handleDeleteCategory = async (categoryId, categoryName) => {
    // Check if category is currently selected
    if (formData.category_id === categoryId) {
      setFormData(prev => ({ ...prev, category_id: '' }))
    }

    try {
      await deleteCategory(categoryId)
      // Category will be removed from the list automatically via real-time updates
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(`Failed to delete category "${categoryName}". It may be in use by existing transactions.`)
    }
  }



  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
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
                      {/* Existing Categories */}
                      {categories
                        .filter(cat => cat.type === formData.type || cat.type === 'both')
                        .map(category => (
                          <div 
                            key={category.id}
                            className={`flex items-center px-3 py-2 hover:bg-gray-50 rounded ${
                              formData.category_id === category.id ? 'bg-purple-50 border border-purple-200' : ''
                            }`}
                          >
                            <div 
                              className="flex items-center flex-1 cursor-pointer"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, category_id: category.id }))
                                setCategoryDropdownOpen(false)
                              }}
                            >
                              <span className="material-icons-outlined text-sm mr-2" style={{ color: category.color }}>
                                {category.icon}
                              </span>
                              <span className={formData.category_id === category.id ? 'font-medium text-purple-700' : ''}>
                                {category.name}
                              </span>
                              {formData.category_id === category.id && (
                                <span className="material-icons-outlined text-purple-600 text-sm ml-2">
                                  check
                                </span>
                              )}
                            </div>
                            <div className="flex items-center ml-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditCategory(category)
                                }}
                                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                title={`Edit ${category.name}`}
                              >
                                <span className="material-icons-outlined text-xs">edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
                                    handleDeleteCategory(category.id, category.name)
                                  }
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title={`Delete ${category.name}`}
                              >
                                <span className="material-icons-outlined text-xs">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      
                      {/* Divider */}
                      {categories.filter(cat => cat.type === formData.type || cat.type === 'both').length > 0 && (
                        <div className="border-t border-gray-200 my-2"></div>
                      )}
                      
                                            {/* Add/Edit Category Option */}
                      {!showAddCategoryForm ? (
                        <div 
                          className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer text-purple-600"
                          onClick={() => setShowAddCategoryForm(true)}
                        >
                          <span className="material-icons-outlined text-sm mr-2">add</span>
                          <span className="text-sm font-medium">
                            {editingCategory ? `Edit ${editingCategory.name}` : 'Add New Category'}
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 border border-gray-200 rounded-lg bg-gray-50" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={newCategory.name}
                                onChange={(e) => {
                                  const name = e.target.value
                                  const icon = getIconForCategory(name)
                                  const color = getColorForCategory(name)
                                  
                                  // Force update the icon and color in state
                                  setNewCategory(prev => {
                                    const updated = { 
                                      ...prev, 
                                      name: name,
                                      icon: icon,
                                      color: color
                                    }
                                    return updated
                                  })
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    e.stopPropagation()
                                  }
                                }}
                                placeholder="Category name"
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-600"
                                autoFocus
                              />
                            
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-600">Icon:</span>
                                <IconSelector
                                  selectedIcon={newCategory.icon}
                                  onIconSelect={(icon) => {
                                    setNewCategory(prev => ({ ...prev, icon }))
                                  }}
                                  color={newCategory.color}
                                />
                                <span className="text-xs text-gray-600">Color:</span>
                                <input
                                  type="color"
                                  value={newCategory.color}
                                  onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                                  className="w-8 h-6 border border-gray-300 rounded"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                disabled={!newCategory.name.trim()}
                                className="flex-1 px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  e.nativeEvent.stopImmediatePropagation()
                                  if (editingCategory) {
                                    handleUpdateCategory(e)
                                  } else {
                                    handleAddCategory(e)
                                  }
                                }}
                              >
                                {editingCategory ? 'Update' : 'Add'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (editingCategory) {
                                    handleCancelEdit()
                                  } else {
                                    setShowAddCategoryForm(false)
                                    setNewCategory({
                                      name: '',
                                      icon: 'more_horiz',
                                      color: getColorForCategory('')
                                    })
                                  }
                                }}
                                className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
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
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="p-6 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
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
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Adding...' : success ? '✓ Added!' : 'Add Transaction'}
            </button>
          </div>
        </div>
      </div>


    </div>
  )
} 