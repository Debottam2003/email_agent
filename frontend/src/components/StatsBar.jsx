import { Mail, CalendarCheck, Clock, Inbox } from 'lucide-react'

export default function StatsBar({ emails }) {
  const total = emails.length
  const created = emails.filter(e => e.hasEvent).length
  const pending = emails.filter(e => !e.hasEvent && e.extractedEvent).length
  const today = new Date().toDateString()
  const todayCount = emails.filter(e => new Date(e.date).toDateString() === today).length

  const stats = [
    { label: 'Total Emails', value: total, icon: Mail, color: 'bg-brand-100 text-brand-700' },
    { label: 'Events Created', value: created, icon: CalendarCheck, color: 'bg-green-100 text-green-600' },
    { label: 'Ready to Schedule', value: pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
    { label: "Today's Emails", value: todayCount, icon: Inbox, color: 'bg-brand-100 text-brand-700' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {stats.map((s, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-100/60 shadow-sm card-hover flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${s.color} flex items-center justify-center flex-shrink-0`}>
            <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}