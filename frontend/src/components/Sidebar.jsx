import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Settings, Zap } from 'lucide-react'

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-brand-100 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-md shadow-brand-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Cmail</h1>
              <p className="text-xs text-gray-400 font-medium">AI Email Assistant</p>
            </div>
          </div>
        </div>
        <nav className="px-4 py-5 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-brand-50 text-brand-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-50">
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-4 border border-brand-100">
            <p className="text-xs font-semibold text-brand-700 mb-1">Pro Plan</p>
            <p className="text-xs text-gray-500 mb-2">Unlimited summaries & calendar events</p>
            <div className="w-full h-1.5 bg-brand-200 rounded-full overflow-hidden"><div className="h-full w-3/4 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full" /></div>
          </div>
        </div>
      </aside>
    </>
  )
}