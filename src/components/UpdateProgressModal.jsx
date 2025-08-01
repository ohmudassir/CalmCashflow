import { useState, useEffect } from 'react'

export const UpdateProgressModal = ({ 
  isOpen, 
  onClose, 
  goal, 
  updateSavingsGoal 
}) => {
  const [currentAmount, setCurrentAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Initialize with current goal amount (auto-calculated or manual)
  useEffect(() => {
    if (goal) {
      // If auto-update is enabled, use the auto-calculated amount
      if (goal.auto_update && goal.auto_calculated_amount !== undefined) {
        setCurrentAmount(goal.auto_calculated_amount.toString())
      } else {
        // Otherwise use the manual current amount
        setCurrentAmount(goal.current_amount?.toString() || '0')
      }
    }
  }, [goal])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newAmount = parseFloat(currentAmount) || 0
      
      await updateSavingsGoal(goal.id, {
        current_amount: newAmount
      })
      
      // Show success message
      setSuccess(true)
      
      // Close modal after a short delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (error) {
      console.error('Error updating progress:', error)
      alert(`Error: ${error.message || 'Failed to update progress. Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = () => {
    if (!goal || goal.target_amount <= 0) return 0
    const progress = (parseFloat(currentAmount) / goal.target_amount) * 100
    return Math.min(progress, 100)
  }

  const getRemaining = () => {
    return Math.max(goal.target_amount - parseFloat(currentAmount), 0)
  }

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-900">
            Update Progress: {goal.title}
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
            Progress updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Progress Display */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Current Progress</span>
              <span className="text-gray-900 font-medium">{calculateProgress().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  calculateProgress() >= 100 ? 'bg-green-500' :
                  calculateProgress() >= 75 ? 'bg-blue-500' :
                  calculateProgress() >= 50 ? 'bg-yellow-500' :
                  calculateProgress() >= 25 ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Target:</span>
                <div className="font-medium">Rs {goal.target_amount?.toLocaleString('en-PK')}</div>
              </div>
              <div>
                <span className="text-gray-600">Remaining:</span>
                <div className="font-medium text-red-600">Rs {getRemaining().toLocaleString('en-PK')}</div>
              </div>
            </div>
          </div>

          {/* Current Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Amount (PKR) *
            </label>
            <input
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              required
              min="0"
              max={goal.target_amount}
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              {goal.auto_update ? 
                'Auto-calculated from linked transactions. You can manually adjust if needed.' :
                'Enter how much you\'ve saved so far'
              }
            </p>
            {goal.auto_update && goal.auto_calculated_amount > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                💡 Auto-calculated from your transactions
              </p>
            )}
          </div>

          {/* Progress Preview */}
          {currentAmount && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-sm text-purple-800">
                <div className="flex justify-between mb-1">
                  <span>New Progress:</span>
                  <span className="font-medium">{calculateProgress().toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Remaining:</span>
                  <span className="font-medium">Rs {getRemaining().toLocaleString('en-PK')}</span>
                </div>
              </div>
            </div>
          )}

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
              {loading ? 'Updating...' : 'Update Progress'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 