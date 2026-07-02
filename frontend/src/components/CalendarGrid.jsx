import { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Calendar } from 'lucide-react'

export default function CalendarGrid({ events, onViewEvent }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDayEvents, setSelectedDayEvents] = useState(null)

  const eventsByDate = events.reduce((acc, email) => {
    if (email.extractedEvent?.date) {
      const dateKey = email.extractedEvent.date
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(email)
    }
    return acc
  }, {})

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const totalDays = daysInMonth(currentYear, currentMonth)
  const startDay = firstDayOfMonth(currentYear, currentMonth)

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDayEvents(null)
  }
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDayEvents(null)
  }

  const isToday = (day) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-100/60 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center py-2 px-2 sm:px-4 border-b border-gray-100">
        {dayNames.map(d => (
          <div key={d} className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 p-2 sm:p-4 gap-1 sm:gap-2">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-xl" />
        ))}

        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayEvents = eventsByDate[dateStr] || []
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day}
              onClick={() => dayEvents.length > 0 && setSelectedDayEvents({ date: dateStr, events: dayEvents })}
              className={`aspect-square rounded-xl relative flex flex-col items-center justify-start p-1 sm:p-2 cursor-pointer transition-all border border-transparent hover:border-brand-200 hover:bg-brand-50/50 ${
                isCurrentDay ? 'bg-brand-50 border-brand-200' : ''
              }`}
            >
              <span className={`text-xs sm:text-sm font-medium ${
                isCurrentDay ? 'text-brand-700 bg-brand-100 w-7 h-7 rounded-full flex items-center justify-center' : 'text-gray-700'
              }`}>
                {day}
              </span>
              {dayEvents.length > 0 && (
                <div className="mt-1 w-full flex flex-col gap-0.5">
                  {dayEvents.slice(0, 2).map(evt => (
                    <div key={evt.id} className="bg-brand-100 text-brand-800 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-md truncate leading-tight" title={evt.extractedEvent?.title}>
                      {evt.extractedEvent?.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-brand-500 font-medium">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              )}
              {dayEvents.length > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500"></div>
              )}
            </div>
          )
        })}
      </div>

      {selectedDayEvents && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={() => setSelectedDayEvents(null)}>
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-2xl shadow-2xl border border-brand-100/50 w-full max-w-sm p-5 animate-scale-in z-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">
                {new Date(selectedDayEvents.date + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              <button onClick={() => setSelectedDayEvents(null)} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="space-y-3">
              {selectedDayEvents.events.map(evt => (
                <div key={evt.id} className="flex items-center gap-3 p-3 rounded-xl bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer" onClick={() => { setSelectedDayEvents(null); onViewEvent(evt); }}>
                  <div className="w-8 h-8 rounded-lg bg-brand-200 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-brand-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{evt.extractedEvent?.title}</p>
                    {evt.extractedEvent?.time && (
                      <p className="text-xs text-gray-500">
                        {(() => { const [h,m] = evt.extractedEvent.time.split(':'); const hour = parseInt(h); const ampm = hour>=12 ? 'PM' : 'AM'; const h12 = hour%12 || 12; return `${h12}:${m} ${ampm}` })()}
                        {evt.extractedEvent?.duration && ` · ${evt.extractedEvent.duration} min`}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}