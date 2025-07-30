import { useState } from 'react'
import './App.css'

function App() {
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(['Rent'])

  const toggleCategory = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Heading */}
          <div className="flex items-center">
            <h1 className="text-3xl font-medium text-gray-900">Calm Cashflow</h1>
          </div>

          {/* Right side - Navigation links */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors">
                <span className="material-icons-outlined text-lg">home</span>
                <span className="text-lg font-medium">Home</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span className="material-icons-outlined text-lg">account_balance_wallet</span>
                <span className="text-lg font-medium">Cashflow</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span className="material-icons-outlined text-lg">bar_chart</span>
                <span className="text-lg font-medium">Net Worth</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-6">Summary</h1>
          
          {/* Net Total */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-1">Net Total</div>
            <div className="text-4xl font-medium text-gray-900">218.493,21 €</div>
            <div className="text-sm text-purple-600">+1.3% from last year</div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-red-500 h-full" style={{ width: '73%' }}></div>
                  <div className="bg-purple-600 h-full" style={{ width: '21%' }}></div>
                  <div className="bg-pink-500 h-full" style={{ width: '6%' }}></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">2023</span>
                <span className="material-icons-outlined text-sm text-gray-600">expand_more</span>
              </div>
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="md-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">Income</span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
              <div className="text-2xl font-medium text-gray-900">135.780,47 €</div>
              <div className="text-xs text-purple-600">13% vs last year</div>
            </div>

            <div className="md-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-500">Expenses <span className="text-xs">73%</span></span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
              <div className="text-2xl font-medium text-gray-900">87.600,34 €</div>
              <div className="text-xs text-purple-600">+4% vs last year</div>
            </div>

            <div className="md-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-600">Investment <span className="text-xs">21%</span></span>
                <span className="material-icons-outlined text-red-500">trending_down</span>
              </div>
              <div className="text-2xl font-medium text-gray-900">48.500,00 €</div>
              <div className="text-xs text-red-500">-8% vs last year</div>
            </div>

            <div className="md-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-pink-500">Savings <span className="text-xs">6%</span></span>
                <span className="material-icons-outlined text-purple-600">trending_up</span>
              </div>
              <div className="text-2xl font-medium text-gray-900">23.435,00 €</div>
              <div className="text-xs text-purple-600">3% vs last year</div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">Transactions</h2>
          <p className="text-gray-600 mb-6">You had 2 incomes and 23 expenses this month</p>

          {/* Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <select className="md-text-field appearance-none pr-8 text-sm">
                <option>Type</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
              <span className="material-icons-outlined absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">expand_more</span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="md-text-field flex items-center space-x-2 text-sm"
              >
                <span>Category</span>
                <span className="material-icons-outlined text-gray-500">expand_more</span>
              </button>

              {categoryDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="p-4">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="md-text-field w-full mb-4"
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">HOME:</div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Rent')}
                              onChange={() => toggleCategory('Rent')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Rent</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Groceries')}
                              onChange={() => toggleCategory('Groceries')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Groceries</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-2">LEISURE:</div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Streaming')}
                              onChange={() => toggleCategory('Streaming')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Streaming</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Restaurant')}
                              onChange={() => toggleCategory('Restaurant')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Restaurant</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Coffee')}
                              onChange={() => toggleCategory('Coffee')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Coffee</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Travel')}
                              onChange={() => toggleCategory('Travel')}
                              className="rounded border-gray-400 text-purple-600 focus:ring-purple-600"
                            />
                            <span className="text-sm">Travel</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                      <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">View all categories</a>
                      <a href="#" className="block text-sm text-purple-600 hover:text-purple-700">Add new category</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="md-button-primary">
              <span className="material-icons-outlined mr-2">add</span>
              Add
            </button>
          </div>

          {/* Transaction List */}
          <div className="md-card">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Today</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-red-500">movie</span>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Netflix</div>
                    <div className="flex items-center space-x-2">
                      <span className="md-chip">Streaming</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-red-500">-17,99€</span>
                  <span className="material-icons-outlined text-gray-500">more_vert</span>
                </div>
              </div>

              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-purple-500">account_balance_wallet</span>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Salary</div>
                    <div className="flex items-center space-x-2">
                      <span className="md-chip">Salary</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-purple-600">+10.548,12€</span>
                  <span className="material-icons-outlined text-gray-500">more_vert</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Yesterday</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-gray-600">directions_car</span>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Car payment</div>
                    <div className="flex items-center space-x-2">
                      <span className="md-chip">Car</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-red-500">-347,50€</span>
                  <span className="material-icons-outlined text-gray-500">more_vert</span>
                </div>
              </div>

              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="material-icons-outlined text-pink-500">restaurant</span>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-gray-900">Food</div>
                    <div className="flex items-center space-x-2">
                      <span className="md-chip">Groceries</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-red-500">-27,19€</span>
                  <span className="material-icons-outlined text-gray-500">more_vert</span>
                </div>
              </div>
            </div>

            <div className="p-4 text-center">
              <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">Load More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
