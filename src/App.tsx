import { useState } from 'react'
import './App.css'

import Dashboard from './components/Dashboard'
import Items from './components/Items'
import Expenses from './components/Expenses'
import Bills from './components/Bills'

type Page = 'dashboard' | 'items' | 'expenses' | 'bills'

function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard')

  const [members, setMembers] = useState<string[]>(['Ganesh', 'Divya'])
  const [selectedMember, setSelectedMember] = useState('Ganesh')
  const [memberMenuOpen, setMemberMenuOpen] = useState(false)

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

  const addMember = () => {
    const name = window.prompt('नवीन सदस्याचे नाव लिहा')

    if (!name) return

    const trimmedName = name.trim()

    if (!trimmedName) return

    if (
      members.some(
        (member) => member.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      window.alert('हा सदस्य आधीच आहे.')
      return
    }

    setMembers((currentMembers) => [...currentMembers, trimmedName])
    setSelectedMember(trimmedName)
    setMemberMenuOpen(false)
  }

  const removeMember = () => {
    if (members.length <= 1) {
      window.alert('किमान एक सदस्य ठेवावा लागेल.')
      return
    }

    const confirmed = window.confirm(
      `${selectedMember} सदस्य काढायचा आहे का?`
    )

    if (!confirmed) return

    const updatedMembers = members.filter(
      (member) => member !== selectedMember
    )

    setMembers(updatedMembers)
    setSelectedMember(updatedMembers[0])
    setMemberMenuOpen(false)
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
            className={
              activePage === 'dashboard'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setActivePage('dashboard')}
          >
            <span>🏠</span>
            Dashboard
          </button>

          <button
            className={
              activePage === 'items'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setActivePage('items')}
          >
            <span>📦</span>
            वस्तू
          </button>

          <button
            className={
              activePage === 'expenses'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => setActivePage('expenses')}
          >
            <span>💰</span>
            खर्च
          </button>

          <button
            className={
              activePage === 'bills'
                ? 'nav-item active'
                : 'nav-item'
            }
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

          {/* Member Dropdown */}
          <div className="member-dropdown">

            <button
              className="user-info member-dropdown-trigger"
              onClick={() =>
                setMemberMenuOpen((open) => !open)
              }
            >
              <div className="user-avatar">
                {selectedMember.charAt(0).toUpperCase()}
              </div>

              <div className="user-details">
                <strong>{selectedMember}</strong>
                <span>घर सदस्य</span>
              </div>

              <span className="member-arrow">
                {memberMenuOpen ? '▲' : '▼'}
              </span>
            </button>

            {memberMenuOpen && (
              <div className="member-dropdown-menu">

                <div className="member-list">
                  {members.map((member) => (
                    <button
                      key={member}
                      className={
                        selectedMember === member
                          ? 'member-option selected'
                          : 'member-option'
                      }
                      onClick={() => {
                        setSelectedMember(member)
                        setMemberMenuOpen(false)
                      }}
                    >
                      <span className="member-option-avatar">
                        {member.charAt(0).toUpperCase()}
                      </span>

                      <span>{member}</span>
                    </button>
                  ))}
                </div>

                <div className="member-menu-divider" />

                <button
                  className="member-menu-action"
                  onClick={addMember}
                >
                  ＋ नवीन सदस्य जोडा
                </button>

                <button
                  className="member-menu-action remove"
                  onClick={removeMember}
                >
                  − सदस्य काढा
                </button>

              </div>
            )}

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