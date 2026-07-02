import { Clock, Eye, Calendar, CalendarCheck } from 'lucide-react'

export default function EmailCard({ email, onViewEmail, onViewEvent }) {
  const initials = email.from.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const dateFormatted = new Date(email.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="bg-white rounded-2xl border border-brand-100/60 shadow-sm card-hover overflow-hidden flex flex-col relative group">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-600 to-brand-400 rounded-l-full opacity-70 group-hover:opacity-100 transition-opacity" />
      <div className="p-4 sm:p-5 pl-5 sm:pl-6 flex flex-col flex-grow">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{email.from.name}</p>
            <p className="text-xs text-gray-400 truncate">{email.from.email}</p>
          </div>
          {email.hasEvent && (
            <span className="flex-shrink-0 flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full border border-green-200">
              <CalendarCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Scheduled</span>
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 line-clamp-1">{email.subject}</h3>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 flex-grow">{email.summary}</p>
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{dateFormatted}</span>
        </div>
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-50">
          <button onClick={() => onViewEmail(email)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> View
          </button>
          {email.hasEvent && (
            <button onClick={() => onViewEvent(email)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-colors">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Event
            </button>
          )}
        </div>
      </div>
    </div>
  )
}