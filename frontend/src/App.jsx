import { useState, useCallback } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/DashboardPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import { Menu } from 'lucide-react'

// ---------- Mock data (July 2026) ----------
const mockEmails = [
  {
    id: 1,
    from: { name: 'Sarah Johnson', email: 'sarah.j@techcorp.com' },
    subject: 'Q3 Strategy Meeting - Thursday at 2PM',
    body: `Hi team,\n\nLet's schedule our Q3 strategy meeting for Thursday.`,
    summary: 'Sarah wants to schedule a Q3 strategy meeting for Thursday.',
    date: '2026-07-01T09:15:00',
    hasEvent: false,
    extractedEvent: {
      title: 'Q3 Strategy Meeting',
      date: '2026-07-03',
      time: '14:00',
      duration: '90',
      location: 'Conference Room B',
      notes: 'Quarterly review',
    },
  },
  {
    id: 2,
    from: { name: 'Michael Chen', email: 'm.chen@designstudio.io' },
    subject: 'Design Review Feedback - Project Horizon',
    body: `Hey there,\n\nJust wrapped up the design review...`,
    summary: 'Michael provided design feedback for Project Horizon.',
    date: '2026-07-02T11:42:00',
    hasEvent: false,
    extractedEvent: {
      title: 'Design Review Sync',
      date: '2026-07-08',
      time: '11:00',
      duration: '30',
      location: 'Virtual',
      notes: 'Walk through Figma annotations.',
    },
  },
  {
    id: 3,
    from: { name: 'Emily Rodriguez', email: 'emily.r@startupinc.com' },
    subject: 'Contract Signed! 🎉 + Next Steps',
    body: `Amazing news everyone!...`,
    summary: 'Emily announces a major contract signed.',
    date: '2026-07-03T14:30:00',
    hasEvent: true,
    calendarEventId: 'evt-001',
    extractedEvent: {
      title: 'Client Kickoff Call',
      date: '2026-07-10',
      time: '10:00',
      duration: '60',
      location: 'Virtual / Zoom',
      notes: 'Initial kickoff with new client.',
    },
  },
  {
    id: 4,
    from: { name: 'David Park', email: 'david.p@globalfinance.com' },
    subject: 'Invoice #4521 Due - Payment Reminder',
    body: `Dear Accounts Team,\n\nThis is a friendly reminder...`,
    summary: 'Payment reminder for Invoice #4521.',
    date: '2026-07-05T16:00:00',
    hasEvent: false,
    extractedEvent: null,
  },
  {
    id: 5,
    from: { name: 'Lisa Thompson', email: 'lisa.t@marketingpro.com' },
    subject: 'Campaign Launch - Summer Sale Prep',
    body: `Hi all,\n\nSummer sale is around the corner...`,
    summary: 'Lisa proposes a 2‑hour campaign workshop.',
    date: '2026-07-06T08:20:00',
    hasEvent: false,
    extractedEvent: {
      title: 'Summer Sale Workshop',
      date: '2026-07-15',
      time: '13:00',
      duration: '120',
      location: 'Conference Room A',
      notes: 'Review campaign brief.',
    },
  },
  {
    id: 6,
    from: { name: 'Alex Rivera', email: 'alex.r@devteam.net' },
    subject: 'Sprint Retrospective - Important Learnings',
    body: `Team,\n\nGreat sprint everyone!...`,
    summary: 'Sprint retrospective shows 95% completion rate.',
    date: '2026-07-07T17:45:00',
    hasEvent: true,
    calendarEventId: 'evt-002',
    extractedEvent: {
      title: 'Sprint Planning',
      date: '2026-07-22',
      time: '09:30',
      duration: '90',
      location: 'Scrum Room',
      notes: 'Address retrospective feedback.',
    },
  },
  {
    id: 7,
    from: { name: 'John Smith', email: 'john.s@company.com' },
    subject: 'Lunch with client',
    body: 'Let’s meet for lunch.',
    summary: 'Lunch meeting scheduled.',
    date: '2026-07-07T12:00:00',
    hasEvent: true,
    calendarEventId: 'evt-003',
    extractedEvent: {
      title: 'Lunch with Client',
      date: '2026-07-09',
      time: '12:30',
      duration: '60',
      location: 'Downtown Bistro',
      notes: 'Discuss new proposal.',
    },
  },
]

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Persistent header with hamburger and user icon */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center md:hidden flex-shrink-0 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          {/* Spacer to push user icon to the right */}
          <div className="flex-1" />
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
            JD
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [emails, setEmails] = useState(mockEmails)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [calendarEmail, setCalendarEmail] = useState(null)
  const [calendarViewOnly, setCalendarViewOnly] = useState(false)
  const [toast, setToast] = useState(null)
  const [filterTab, setFilterTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const filteredEmails = emails.filter(email => {
    const matchesSearch =
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.summary.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false
    switch (filterTab) {
      case 'withEvents': return email.hasEvent
      case 'pending': return !email.hasEvent && email.extractedEvent
      case 'noEvent': return !email.hasEvent && !email.extractedEvent
      default: return true
    }
  })

  const handleGenerateEvent = (email) => {
    setCalendarEmail(email)
    setCalendarViewOnly(false)
  }

  const handleViewEvent = (email) => {
    setCalendarEmail(email)
    setCalendarViewOnly(true)
  }

  const handleConfirmEvent = (emailId, formData) => {
    setEmails(prev =>
      prev.map(e =>
        e.id === emailId
          ? {
              ...e,
              hasEvent: true,
              calendarEventId: `evt-${Date.now()}`,
              extractedEvent: { ...e.extractedEvent, ...formData },
            }
          : e
      )
    )
    showToast('✅ Calendar event created successfully!')
  }

  const contextValue = {
    emails,
    filteredEmails,
    filterTab,
    setFilterTab,
    searchQuery,
    setSearchQuery,
    selectedEmail,
    setSelectedEmail,
    calendarEmail,
    setCalendarEmail,
    calendarViewOnly,
    handleGenerateEvent,
    handleViewEvent,
    handleConfirmEvent,
    toast,
    setToast,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <Routes>
        <Route element={<Layout />}>
          <Route index  element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  )
}