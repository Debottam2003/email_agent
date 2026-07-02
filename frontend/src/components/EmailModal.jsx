import { useEffect } from 'react'
import { X, Clock, Sparkles, CalendarCheck, CalendarPlus, CalendarX } from 'lucide-react'

export default function EmailModal({ email, onClose, onGenerateEvent, onViewEvent }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const initials = email.from.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  const dateFormatted = new Date(email.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-brand-100/50">
        <div className="sticky top-0 bg-white z-10 px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{initials}</div>
            <div>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{email.from.name}</p>
              <p className="text-xs text-gray-400">{email.from.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="px-5 sm:px-7 py-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{email.subject}</h2>
          <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm mb-5"><Clock className="w-4 h-4" /><span>{dateFormatted}</span></div>
          <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-4 sm:p-5 mb-5 border border-brand-100/60">
            <div className="flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4 text-brand-600" /><span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">AI Summary</span></div>
            <p className="text-sm text-gray-700 leading-relaxed">{email.summary}</p>
          </div>
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Email</p>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">{email.body}</div>
          </div>
          {email.hasEvent ? (
            <div className="bg-green-50 rounded-2xl p-4 sm:p-5 border border-green-200">
              <div className="flex items-center gap-2 mb-3"><CalendarCheck className="w-5 h-5 text-green-600" /><span className="font-semibold text-green-800">Calendar Event Created</span></div>
              <button onClick={() => { onClose(); onViewEvent(email); }} className="text-sm font-medium text-green-600 hover:text-green-700 underline">View Event Details →</button>
            </div>
          ) : email.extractedEvent ? (
            <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3"><CalendarPlus className="w-5 h-5 text-amber-600" /><span className="font-semibold text-amber-800">Event Detected</span></div>
              <p className="text-sm text-amber-700 mb-3">We found a potential calendar event in this email.</p>
              <button onClick={() => { onClose(); onGenerateEvent(email); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm font-medium rounded-xl hover:from-brand-700 hover:to-brand-600 transition-all shadow-sm shadow-brand-200"><Sparkles className="w-4 h-4" /> Generate Calendar Event</button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 text-center">
              <CalendarX className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No calendar event detected in this email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}