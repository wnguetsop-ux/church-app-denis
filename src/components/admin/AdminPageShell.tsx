import { Plus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Props {
  title: string
  description: string
  icon: LucideIcon
  collection: string
  fields: string[]
  children?: React.ReactNode
}

export default function AdminPageShell({ title, description, icon: Icon, collection, fields, children }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Schema info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <p className="text-xs font-mono text-cifm-blue-600 mb-2">
          Firestore → <span className="font-bold">{collection}</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {fields.map(f => (
            <span key={f} className="bg-white text-gray-600 border border-gray-200 rounded-md px-2 py-0.5 text-xs font-mono">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Content or empty state */}
      {children || (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Icon className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">
            Aucun élément pour le moment.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Cliquez sur « Ajouter » pour créer le premier.
          </p>
        </div>
      )}
    </div>
  )
}
