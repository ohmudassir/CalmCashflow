# Expense Tracker Dashboard

A modern, responsive expense tracking dashboard built with React, Vite, and Tailwind CSS. This application provides a clean and intuitive interface for managing personal finances with real-time financial metrics and transaction tracking.

## Features

- **Modern Dashboard Design**: Clean, minimalist interface with macOS-inspired window controls
- **Financial Summary**: Comprehensive overview with net total, income, expenses, investments, and savings
- **Interactive Charts**: Visual representation of financial distribution with color-coded segments
- **Transaction Management**: Detailed transaction list with filtering and categorization
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices
- **Category Filtering**: Advanced filtering system with dropdown menus and checkboxes
- **Real-time Updates**: Dynamic state management for interactive elements

## Tech Stack

- **React 18**: Modern React with hooks for state management
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **PostCSS**: CSS processing with autoprefixer
- **Inter Font**: Clean, modern typography

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ExpenseTracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
ExpenseTracker/
├── public/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Custom styles
│   ├── index.css        # Tailwind CSS imports and base styles
│   └── main.jsx         # Application entry point
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## Key Components

### Navigation Bar
- macOS-style window controls (red, yellow, green circles)
- Logo placeholder
- Navigation links (Home, Cashflow, Net Worth)
- User profile avatar

### Summary Section
- Net total display with year-over-year comparison
- Horizontal bar chart showing financial distribution
- Four metric cards for Income, Expenses, Investment, and Savings
- Color-coded indicators for positive/negative changes

### Transactions Section
- Transaction list grouped by date
- Filter dropdowns for Type and Category
- Interactive category dropdown with checkboxes
- Add transaction button
- Load more functionality

## Styling

The application uses Tailwind CSS with custom color palette:

- **Expense Red**: `#EF4444`
- **Income Green**: `#10B981`
- **Investment Blue**: `#3B82F6`
- **Savings Yellow**: `#F59E0B`

## Customization

### Adding New Categories
To add new transaction categories, modify the category dropdown in `App.jsx`:

```jsx
<div className="space-y-2">
  <label className="flex items-center space-x-2">
    <input 
      type="checkbox" 
      checked={selectedCategories.includes('NewCategory')}
      onChange={() => toggleCategory('NewCategory')}
      className="rounded"
    />
    <span className="text-sm">New Category</span>
  </label>
</div>
```

### Modifying Colors
Update the custom colors in `tailwind.config.js`:

```javascript
colors: {
  'expense-red': '#EF4444',
  'income-green': '#10B981',
  'investment-blue': '#3B82F6',
  'savings-yellow': '#F59E0B',
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern financial dashboard interfaces
- Icons from Heroicons
- Typography by Inter font family
