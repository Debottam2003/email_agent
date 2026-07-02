import { useState, useEffect } from 'react'
import { X, Sparkles, CalendarPlus, CalendarCheck, FileText, Calendar, Clock, Hourglass, MapPin, StickyNote } from 'lucide-react'

export default function CalendarEventModal({ email, onClose, onConfirm, viewOnly = false }) {
  const event = email.extractedEvent
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date || '',
    time: event?.time || '',
    duration: event?.duration || '60',
    location: event?.location || '',
    notes: event?.notes || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      onConfirm(email.id, formData)
      setIsSubmitting(false)
      onClose()
    }, 800)
  }

  if (viewOnly) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
        <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl animate-scale-in border border-brand-100/50 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><CalendarCheck className="w-5 h-5 text-green-600" /></div>
              <div><p className="font-semibold text-gray-800">Calendar Event</p><p className="text-xs text-green-600 font-medium">Scheduled</p></div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Title', value: formData.title, icon: FileText },
              { label: 'Date', value: formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '', icon: Calendar },
              { label: 'Time', value: formData.time ? (() => { const [h,m] = formData.time.split(':'); const hour = parseInt(h); const ampm = hour>=12 ? 'PM' : 'AM'; const h12 = hour%12 || 12; return `${h12}:${m} ${ampm}` })() : '', icon: Clock },
              { label: 'Duration', value: formData.duration ? `${formData.duration} minutes` : '', icon: Hourglass },
              { label: 'Location', value: formData.location, icon: MapPin },
            ].map((item, idx) => item.value && (
              <div key={idx} className="flex items-start gap-3">
                <item.icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div><p className="text-xs text-gray-400 uppercase">{item.label}</p><p className="text-sm font-medium text-gray-700">{item.value}</p></div>
              </div>
            ))}
            {formData.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                <StickyNote className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div><p className="text-xs text-gray-400 uppercase">Notes</p><p className="text-sm text-gray-600">{formData.notes}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" />
      <div onClick={e => e.stopPropagation()} className="relative bg-white rounded-2xl sm:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-brand-100/50">
        <div className="sticky top-0 bg-white z-10 px-5 sm:px-7 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between rounded-t-2xl sm:rounded-t-3xl">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <div><p className="font-semibold text-gray-800 text-sm sm:text-base">Generate Calendar Event</p><p className="text-xs text-gray-400">AI‑extracted from email</p></div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="px-5 sm:px-7 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Event Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Time</label>
              <input type="time" value={formData.time} onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Duration (minutes)</label>
            <select value={formData.duration} onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all bg-white">
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Location</label>
            <input type="text" value={formData.location} onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g. Conference Room B, Zoom link..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Notes</label>
            <textarea value={formData.notes} onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows="3" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none transition-all resize-none" />
          </div>
          <div className="bg-brand-50/50 rounded-xl p-3 border border-brand-100">
            <p className="text-xs text-gray-500 mb-1">Source Email:</p>
            <p className="text-sm font-medium text-gray-700">{email.subject}</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSubmit} disabled={isSubmitting || !formData.title || !formData.date} className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 rounded-xl transition-all shadow-sm shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" /> Add to Calendar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}