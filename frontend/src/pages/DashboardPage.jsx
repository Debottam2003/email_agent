import { useContext } from 'react'
import { AppContext } from '../context/AppContext' 
import StatsBar from '../components/StatsBar'
import EmailCard from '../components/EmailCard'
import EmailModal from '../components/EmailModal'
import CalendarEventModal from '../components/CalendarEventModal'
import Toast from '../components/Toast'
import { MailSearch } from 'lucide-react'

export default function DashboardPage() {
  const {
    emails,
    filteredEmails,
    filterTab,
    setFilterTab,
    setSelectedEmail,
    selectedEmail,
    calendarEmail,
    setCalendarEmail,
    calendarViewOnly,
    handleGenerateEvent,
    handleViewEvent,
    handleConfirmEvent,
    toast,
    setToast,
    searchQuery,
    setSearchQuery,
  } = useContext(AppContext)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Dashboard header */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Good morning, John</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-1">Here's your email digest with AI‑powered summaries.</p>
      </div>

      {/* Search bar (dashboard only) */}
      <div className="relative max-w-md mb-5">
        <MailSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all bg-gray-50"
        />
      </div>

      <StatsBar emails={emails} />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {[
          { id: 'all', label: 'All Emails' },
          { id: 'pending', label: 'Ready to Schedule' },
          { id: 'withEvents', label: 'Scheduled' },
          { id: 'noEvent', label: 'No Events' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              filterTab === tab.id
                ? 'bg-brand-100 text-brand-700 shadow-sm'
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab.label}
            {filterTab === tab.id && tab.id === 'pending' && (
              <span className="ml-1.5 bg-brand-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {emails.filter(e => !e.hasEvent && e.extractedEvent).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Email grid */}
      {filteredEmails.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <MailSearch className="w-8 h-8 text-brand-500" />
          </div>
          <p className="text-gray-400 font-medium">No emails found</p>
          <p className="text-gray-300 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredEmails.map(email => (
            <EmailCard
              key={email.id}
              email={email}
              onViewEmail={setSelectedEmail}
              onViewEvent={handleViewEvent}
            />
          ))}
        </div>
      )}

      {/* Modals and Toast (still using context) */}
      {selectedEmail && (
        <EmailModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onGenerateEvent={handleGenerateEvent}
          onViewEvent={handleViewEvent}
        />
      )}
      {calendarEmail && (
        <CalendarEventModal
          email={calendarEmail}
          onClose={() => setCalendarEmail(null)}
          onConfirm={handleConfirmEvent}
          viewOnly={calendarViewOnly}
        />
      )}
      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}