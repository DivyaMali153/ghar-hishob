import { useState } from 'react'
import './App.css'

import Dashboard from './components/Dashboard'
import Items from './components/Items'
import Expenses from './components/Expenses'
import Bills from './components/Bills'

type Page = 'dashboard' | 'items' | 'expenses' | 'bills'

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (activePage) {
      case 'items':
        return <Items />

      case 'expenses':
        return <Expenses />

      case 'bills':
        return <Bills />

      default:
        return <Dashboard />
    }
  }

  return (
    <div className="app-layout">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">🏠</div>

          <div>
            <h1>घरहिशोब</h1>
            <span>Home Expense Manager</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <button
            className={activePage === 'dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('dashboard')}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className={activePage === 'items' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('items')}
          >
            <span>📦</span>
            वस्तू
          </button>

          <button
            className={activePage === 'expenses' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('expenses')}
          >
            <span>💰</span>
            खर्च
          </button>

          <button
            className={activePage === 'bills' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActivePage('bills')}
          >
            <span>🧾</span>
            बिले
          </button>

        </nav>

        <div className="sidebar-footer">
          <p>घराचा संपूर्ण हिशोब</p>
          <span>Version 1.0</span>
        </div>

      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="topbar">

          <div>
            <span className="topbar-title">
              {activePage === 'dashboard' && 'Dashboard'}
              {activePage === 'items' && 'वस्तू'}
              {activePage === 'expenses' && 'खर्च'}
              {activePage === 'bills' && 'बिले'}
            </span>
          </div>

          <div className="user-info">
            <div className="user-avatar">
              G
            </div>

            <div>
              <strong>Ganesh</strong>
              <span>घर सदस्य</span>
            </div>
          </div>

        </div>

        <div className="page-content">
          {renderPage()}
        </div>

      </main>

    </div>
  )
}

export default App