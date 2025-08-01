# 💰 Calm Cashflow - Personal Finance Tracker

A modern, responsive personal finance tracker built with React, Material Design 3, and Supabase. Track your income, expenses, and savings with real-time updates and a beautiful, intuitive interface.

## ✨ Features

- **📊 Real-time Financial Tracking** - Monitor income, expenses, and savings with instant updates
- **🎨 Material Design 3** - Modern, expressive theming with glass morphism effects
- **📱 Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **💾 Supabase Backend** - Secure, real-time database with PostgreSQL
- **🔄 CRUD Operations** - Create, read, update, and delete transactions
- **📈 Dynamic Analytics** - Real-time calculations and balance tracking
- **🎯 Category Management** - Organize transactions by categories
- **💰 PKR Currency Support** - Pakistani Rupee formatting
- **⚡ Fast Performance** - Built with Vite for lightning-fast development
- **🔄 Real-time Updates** - UI updates instantly when data changes

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Material Design 3, Glass Morphism
- **Icons**: Material Icons
- **State Management**: React Hooks with custom hooks
- **Build Tool**: Vite
- **Real-time**: Supabase Realtime subscriptions

## 🎨 Design Features

- **Material Design 3** - Expressive theming with custom color palettes
- **Glass Morphism** - Beautiful blurred, floating elements
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Dark/Light Theme Ready** - Built with theme tokens
- **Custom Components** - Tailored for financial applications

## 📱 Mobile Optimized

- **Touch-friendly** - Large touch targets and intuitive gestures
- **Responsive Layout** - Adapts perfectly to all screen sizes
- **Fast Loading** - Optimized for mobile networks
- **PWA Ready** - Can be installed as a mobile app

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ohmudassir/calm-cashflow.git
   cd calm-cashflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project
   - Add your Supabase URL and API key to environment variables
   - Run the database schema setup

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Database Schema

The app uses PostgreSQL with the following main tables:
- **users** - User authentication and profiles
- **categories** - Transaction categories (income/expense)
- **transactions** - Financial transactions with amounts, dates, payment methods, and income sources
- **budgets** - Budget planning and tracking
- **financial_goals** - Savings and investment goals

## 🎯 Key Features

### Financial Tracking
- **Income Management** - Track all sources of income with real-time updates
- **Expense Tracking** - Monitor spending by categories with instant balance updates
- **Balance Calculation** - Real-time net worth updates
- **Percentage Analytics** - Visual breakdown of finances
- **Payment Methods** - Track cash, card, and transfer payments
- **Income Sources** - Categorize income by source (wallet, bank, etc.)

### User Experience
- **Intuitive Interface** - Clean, modern design with Material Design 3
- **Quick Actions** - Add transactions with one click
- **Smart Filtering** - Filter by type and category
- **Real-time Updates** - Instant data synchronization across all devices
- **Transaction Details** - View and edit transaction details in modals
- **Transfer Tracking** - Special handling for transfer transactions

### Data Management
- **CRUD Operations** - Full transaction management with real-time updates
- **Category System** - Organized financial tracking with custom categories
- **Date Grouping** - Transactions grouped by date
- **Search & Filter** - Find transactions quickly
- **Real-time Subscriptions** - Automatic UI updates when data changes

## 🔄 Real-time Features

### Automatic Updates
- ✅ When you add a transaction → UI updates immediately
- ✅ When you update a transaction → UI updates immediately
- ✅ When you delete a transaction → UI updates immediately
- ✅ When categories change → UI updates immediately
- ✅ When balances change → UI updates immediately

### Real-time Flow
```
1. User adds transaction → Database updated
2. Supabase real-time detects change
3. Hook receives notification
4. Hook re-fetches/re-calculates data
5. UI updates immediately
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
1. Import project to Vercel
2. Configure environment variables
3. Deploy with automatic CI/CD

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Mudassir Nadeem**

- 🌐 **Portfolio**: [ohmudassir.netlify.app](https://ohmudassir.netlify.app)
- 💼 **LinkedIn**: [linkedin.com/in/ohmudassir](https://linkedin.com/in/ohmudassir)
- 🐙 **GitHub**: [github.com/ohmudassir](https://github.com/ohmudassir)

A passionate front-end developer focused on creating seamless user experiences with modern web technologies.

## 🙏 Acknowledgments

- **Material Design 3** - For the beautiful design system
- **Supabase** - For the powerful backend infrastructure and real-time features
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For the amazing frontend library
- **Vite** - For the lightning-fast build tool

---

**Made with ❤️ by Mudassir Nadeem**
