import { useState, useEffect } from 'react'
import { useIncomeSources } from '../hooks/useIncomeSources'
import { ensureTestUser } from '../lib/supabase'

export const TransferModal = ({ isOpen, onClose, transactions = [], addTransaction }) => {
  const [formData, setFormData] = useState({
    from_source: 'wallet',
    to_source: 'bank',
    amount: '',
    description: '',
    transfer_date: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false)
  const [toDropdownOpen, setToDropdownOpen] = useState(false)

  const { incomeSources, getAvailableAmount, loading: balancesLoading } = useIncomeSources(transactions)
  

  // Use the addTransaction function passed from parent component

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setFromDropdownOpen(false)
        setToDropdownOpen(false)
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

      const amount = parseFloat(formData.amount)
      
      // Check if source has enough funds
      if (amount > getAvailableAmount(formData.from_source)) {
        throw new Error(`Insufficient funds in ${formData.from_source}. Available: Rs ${getAvailableAmount(formData.from_source).toLocaleString('en-PK')}`)
      }

      // Create one transfer transaction (use 'expense' type since database doesn't support 'transfer')
      const transferTransaction = {
        title: `Transfer: ${getSourceDisplayName(formData.from_source)} → ${getSourceDisplayName(formData.to_source)}`,
        description: formData.description 
          ? `${formData.description} (Transfer from ${getSourceDisplayName(formData.from_source)} to ${getSourceDisplayName(formData.to_source)})`
          : `Transfer from ${getSourceDisplayName(formData.from_source)} to ${getSourceDisplayName(formData.to_source)}`,
        amount: amount,
        type: 'expense', // Use 'expense' type since database constraint doesn't allow 'transfer'
        category_id: null, // We'll need a transfer category
        transaction_date: formData.transfer_date,
        currency: 'PKR',
        payment_method: 'transfer',
        income_source: formData.from_source,
        // Store transfer destination in description for now since transfer_to_source column doesn't exist
        // transfer_to_source: formData.to_source,
        user_id: userId
      }

      // Add the transfer transaction
      const newTransaction = await addTransaction(transferTransaction)
      
      // Update balances immediately for faster UI response
      if (newTransaction) {
        // This will be handled by the useIncomeSources hook
        console.log('Transfer transaction added:', newTransaction)
        console.log('Transfer description:', transferTransaction.description)
        console.log('From source:', formData.from_source)
        console.log('To source:', formData.to_source)
      }
      
      // Show success message
      setSuccess(true)
      
      // Reset form
      setFormData({
        from_source: 'wallet',
        to_source: 'bank',
        amount: '',
        description: '',
        transfer_date: new Date().toISOString().split('T')[0]
      })
      
      // Close modal after a short delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error making transfer:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getSourceDisplayName = (source) => {
    switch (source) {
      case 'wallet': return 'Wallet'
      case 'bank': return 'Bank'
      case 'digital_wallet': return 'Digital Wallet'
      default: return source
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">Transfer Money</h2>
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
          {/* From Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <div className="relative dropdown-container">
              <button 
                type="button"
                onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                disabled={balancesLoading}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center justify-between disabled:opacity-50"
              >
                                  <span>
                    {getSourceDisplayName(formData.from_source)}
                    <span className="text-gray-500 ml-2">
                      {balancesLoading ? 'Loading...' : `(Rs ${getAvailableAmount(formData.from_source).toLocaleString('en-PK')})`}
                    </span>
                  </span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {fromDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    {['wallet', 'bank', 'digital_wallet'].map(source => (
                      <div 
                        key={source}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, from_source: source }))
                          setFromDropdownOpen(false)
                        }}
                      >
                        <span>{getSourceDisplayName(source)}</span>
                        <span className="text-sm text-gray-500">
                          {balancesLoading ? 'Loading...' : `Rs ${getAvailableAmount(source).toLocaleString('en-PK')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transfer Icon */}
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="material-icons-outlined text-purple-600 text-sm">swap_vert</span>
            </div>
          </div>

          {/* To Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <div className="relative dropdown-container">
              <button 
                type="button"
                onClick={() => setToDropdownOpen(!toDropdownOpen)}
                disabled={balancesLoading}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-left text-gray-900 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition-all duration-200 flex items-center justify-between disabled:opacity-50"
              >
                                  <span>
                    {getSourceDisplayName(formData.to_source)}
                    <span className="text-gray-500 ml-2">
                      {balancesLoading ? 'Loading...' : `(Rs ${getAvailableAmount(formData.to_source).toLocaleString('en-PK')})`}
                    </span>
                  </span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {toDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    {['wallet', 'bank', 'digital_wallet'].map(source => (
                      <div 
                        key={source}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, to_source: source }))
                          setToDropdownOpen(false)
                        }}
                      >
                        <span>{getSourceDisplayName(source)}</span>
                        <span className="text-sm text-gray-500">
                          {balancesLoading ? 'Loading...' : `Rs ${getAvailableAmount(source).toLocaleString('en-PK')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            {formData.amount && parseFloat(formData.amount) > getAvailableAmount(formData.from_source) && (
              <p className="text-xs text-red-500 mt-1">
                Insufficient funds. Available: Rs {getAvailableAmount(formData.from_source).toLocaleString('en-PK')}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              name="transfer_date"
              value={formData.transfer_date}
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
              placeholder="Add a description for this transfer..."
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
              disabled={loading || !formData.amount || parseFloat(formData.amount) > getAvailableAmount(formData.from_source)}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Transferring...' : success ? '✓ Transferred!' : 'Transfer'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
} 