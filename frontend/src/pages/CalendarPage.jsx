import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import CalendarGrid from '../components/CalendarGrid'
import CalendarEventModal from '../components/CalendarEventModal'

export default function CalendarPage() {
  const {
    emails,
    calendarEmail,
    setCalendarEmail,
    calendarViewOnly,
    handleViewEvent,
    handleConfirmEvent,
  } = useContext(AppContext)

  const scheduledEvents = emails.filter(e => e.hasEvent)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Calendar</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-1">Your scheduled events at a glance.</p>
      </div>
      <CalendarGrid events={scheduledEvents} onViewEvent={handleViewEvent} />
      {calendarEmail && (
        <CalendarEventModal
          email={calendarEmail}
          onClose={() => setCalendarEmail(null)}
          onConfirm={handleConfirmEvent}
          viewOnly={calendarViewOnly}
        />
      )}
    </div>
  )
}