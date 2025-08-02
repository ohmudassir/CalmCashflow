import { useState, useEffect } from 'react'

// Available Material Icons for categories
const availableIcons = [
  { name: 'account_balance_wallet', label: 'Wallet', category: 'money' },
  { name: 'work', label: 'Work', category: 'business' },
  { name: 'laptop', label: 'Laptop', category: 'technology' },
  { name: 'trending_up', label: 'Investment', category: 'finance' },
  { name: 'store', label: 'Store', category: 'business' },
  { name: 'home', label: 'Home', category: 'housing' },
  { name: 'percent', label: 'Commission', category: 'finance' },
  { name: 'card_giftcard', label: 'Gift', category: 'gift' },
  { name: 'assignment_return', label: 'Refund', category: 'finance' },
  { name: 'account_balance', label: 'Bank', category: 'finance' },
  { name: 'psychology', label: 'Side Hustle', category: 'business' },
  { name: 'support_agent', label: 'Consulting', category: 'business' },
  { name: 'public', label: 'Online', category: 'technology' },
  { name: 'school', label: 'Teaching', category: 'education' },
  { name: 'edit', label: 'Writing', category: 'creative' },
  { name: 'palette', label: 'Design', category: 'creative' },
  { name: 'code', label: 'Programming', category: 'technology' },
  { name: 'camera_alt', label: 'Photography', category: 'creative' },
  { name: 'directions_car', label: 'Transport', category: 'transport' },
  { name: 'apartment', label: 'Real Estate', category: 'housing' },
  { name: 'restaurant', label: 'Food', category: 'food' },
  { name: 'shopping_bag', label: 'Shopping', category: 'shopping' },
  { name: 'sports_esports', label: 'Entertainment', category: 'entertainment' },
  { name: 'local_hospital', label: 'Health', category: 'health' },
  { name: 'receipt', label: 'Bills', category: 'finance' },
  { name: 'security', label: 'Insurance', category: 'finance' },
  { name: 'credit_card', label: 'Card', category: 'finance' },
  { name: 'phone_android', label: 'Phone', category: 'technology' },
  { name: 'wifi', label: 'Internet', category: 'technology' },
  { name: 'card_membership', label: 'Subscription', category: 'finance' },
  { name: 'more_horiz', label: 'Other', category: 'general' }
]

export const IconSelector = ({ selectedIcon, onIconSelect, color = '#6B7280' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredIcons, setFilteredIcons] = useState(availableIcons)

  // Filter icons based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredIcons(availableIcons)
    } else {
      const filtered = availableIcons.filter(icon => 
        icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        icon.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredIcons(filtered)
    }
  }, [searchTerm])

  const handleIconSelect = (iconName) => {
    onIconSelect(iconName)
    setIsOpen(false)
    setSearchTerm('')
  }

  const selectedIconData = availableIcons.find(icon => icon.name === selectedIcon)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600"
      >
        <span 
          className="material-icons-outlined text-sm"
          style={{ color: color }}
        >
          {selectedIcon}
        </span>
        <span className="text-sm text-gray-700">
          {selectedIconData?.label || 'Select Icon'}
        </span>
        <span className="material-icons-outlined text-gray-500 text-sm">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-600"
              autoFocus
            />
          </div>
          
          <div className="p-2">
            {filteredIcons.map(icon => (
              <div
                key={icon.name}
                className="flex items-center px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => handleIconSelect(icon.name)}
              >
                <span 
                  className="material-icons-outlined text-sm mr-3"
                  style={{ color: color }}
                >
                  {icon.name}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{icon.label}</div>
                  <div className="text-xs text-gray-500">{icon.category}</div>
                </div>
                {selectedIcon === icon.name && (
                  <span className="material-icons-outlined text-purple-600 text-sm">
                    check
                  </span>
                )}
              </div>
            ))}
            
            {filteredIcons.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No icons found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 