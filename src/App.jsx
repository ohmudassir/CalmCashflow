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
            <h1 className="text-2xl font-bold text-black">Calm Cashflow</h1>
          </div>

          {/* Right side - Navigation links */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-6">
              <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span>Home</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-500 hover:text-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span>Cashflow</span>
              </a>
              <a href="#" className="flex items-center space-x-2 text-gray-500 hover:text-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <span>Net Worth</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-6">Summary</h1>
          
          {/* Net Total */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-1">Net Total</div>
            <div className="text-4xl font-bold text-black">218.493,21 €</div>
            <div className="text-sm text-income-green">+1.3% from last year</div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-expense-red h-full" style={{ width: '73%' }}></div>
                  <div className="bg-investment-blue h-full" style={{ width: '21%' }}></div>
                  <div className="bg-savings-yellow h-full" style={{ width: '6%' }}></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">2023</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Financial Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-income-green">Income</span>
                <svg className="w-4 h-4 text-income-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-bold text-black">135.780,47 €</div>
              <div className="text-xs text-income-green">13% vs last year</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-expense-red">Expenses <span className="text-xs">73%</span></span>
                <svg className="w-4 h-4 text-income-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-bold text-black">87.600,34 €</div>
              <div className="text-xs text-income-green">+4% vs last year</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-investment-blue">Investment <span className="text-xs">21%</span></span>
                <svg className="w-4 h-4 text-expense-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-bold text-black">48.500,00 €</div>
              <div className="text-xs text-expense-red">-8% vs last year</div>
            </div>

            <div className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-savings-yellow">Savings <span className="text-xs">6%</span></span>
                <svg className="w-4 h-4 text-income-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xl font-bold text-black">23.435,00 €</div>
              <div className="text-xs text-income-green">3% vs last year</div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">Transactions</h2>
          <p className="text-gray-600 mb-6">You had 2 incomes and 23 expenses this month</p>

          {/* Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm">
                <option>Type</option>
                <option>Income</option>
                <option>Expense</option>
              </select>
              <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            <div className="relative">
              <button 
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
              >
                <span>Category</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {categoryDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="p-4">
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-4"
                    />
                    
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold text-xs text-gray-500 mb-2">HOME:</div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Rent')}
                              onChange={() => toggleCategory('Rent')}
                              className="rounded"
                            />
                            <span className="text-sm">Rent</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Groceries')}
                              onChange={() => toggleCategory('Groceries')}
                              className="rounded"
                            />
                            <span className="text-sm">Groceries</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-xs text-gray-500 mb-2">LEISURE:</div>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Streaming')}
                              onChange={() => toggleCategory('Streaming')}
                              className="rounded"
                            />
                            <span className="text-sm">Streaming</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Restaurant')}
                              onChange={() => toggleCategory('Restaurant')}
                              className="rounded"
                            />
                            <span className="text-sm">Restaurant</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Coffee')}
                              onChange={() => toggleCategory('Coffee')}
                              className="rounded"
                            />
                            <span className="text-sm">Coffee</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              checked={selectedCategories.includes('Travel')}
                              onChange={() => toggleCategory('Travel')}
                              className="rounded"
                            />
                            <span className="text-sm">Travel</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">View all categories</a>
                      <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">Add new category</a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="btn-primary">+ Add</button>
          </div>

          {/* Transaction List */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-black">Today</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">N</span>
                  </div>
                  <div>
                    <div className="font-medium text-black">Netflix</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Streaming</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-expense-red font-medium">-17,99€</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>

              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-black">Salary</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Salary</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-income-green font-medium">+10.548,12€</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-black">Yesterday</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-black">Car payment</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Car</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-expense-red font-medium">-347,50€</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>

              <div className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-black">Food</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Groceries</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-expense-red font-medium">-27,19€</span>
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4 text-center">
              <button className="text-gray-600 hover:text-black font-medium">Load More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
