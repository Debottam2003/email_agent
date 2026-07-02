import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-400 text-sm sm:text-base mt-1">Manage your preferences.</p>
      </div>
      <div className="bg-white rounded-2xl border border-brand-100/60 shadow-sm p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-brand-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Settings Panel</h3>
        <p className="text-gray-400">This is where your account and app settings will go.</p>
      </div>
    </div>
  )
}