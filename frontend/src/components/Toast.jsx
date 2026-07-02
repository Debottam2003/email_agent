import { useEffect } from 'react'
import { CircleCheck, CircleAlert, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-800'
  const Icon = type === 'success' ? CircleCheck : CircleAlert

  return (
    <div className={`fixed top-6 right-6 z-[100] animate-slide-up flex items-center gap-3 px-5 py-4 rounded-xl border shadow-lg ${bgColor}`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose}><X className="w-4 h-4" /></button>
    </div>
  )
}