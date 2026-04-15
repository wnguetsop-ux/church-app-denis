'use client'

import { useState } from 'react'
import { HandHeart, Trash2, Search, Eye, EyeOff, CheckCircle, Clock, Heart } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { DeleteConfirm } from '@/components/admin/AdminFormFields'
import type { PrayerRequest } from '@/types'
import type { Timestamp } from 'firebase/firestore'

function formatDate(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  const d = typeof ts === 'string' ? new Date(ts) : ts.toDate?.() ? ts.toDate() : new Date()
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'En attente', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  reviewed: { label: 'Lue', color: 'bg-blue-50 text-blue-700', icon: Eye },
  prayed: { label: 'Priée', color: 'bg-green-50 text-green-700', icon: CheckCircle },
}

export default function AdminPrieres() {
  const { items: prayers, isLoading, update, remove, deleting } = useAdminCrud<PrayerRequest>({
    collection: 'prayers',
    orderField: 'createdAt',
  })

  const [modal, setModal] = useState<'detail' | 'delete' | null>(null)
  const [current, setCurrent] = useState<PrayerRequest | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'prayed'>('all')

  function openDetail(p: PrayerRequest) {
    setCurrent(p)
    setModal('detail')
  }

  function openDelete(p: PrayerRequest) {
    setCurrent(p)
    setModal('delete')
  }

  async function updateStatus(id: string, status: string) {
    await update(id, { status })
  }

  async function handleDelete() {
    if (current) {
      const ok = await remove(current.id)
      if (ok) setModal(null)
    }
  }

  const filtered = prayers.filter(p => {
    if (filterStatus !== 'all' && p.status !== filterStatus) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (p.name ?? '').toLowerCase().includes(q) || p.request.toLowerCase().includes(q) || (p.subject ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <HandHeart className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Prières reçues</h1>
            <p className="text-sm text-gray-500">Demandes de prière soumises par les fidèles</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cifm-blue-600">{prayers.length}</p>
          <p className="text-xs text-gray-400">total</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'pending', 'reviewed', 'prayed'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterStatus === f ? 'bg-white text-cifm-blue-600 shadow-sm' : 'text-gray-500'}`}>
              {f === 'all' ? 'Toutes' : statusLabels[f].label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} prière(s)</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <HandHeart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucune prière trouvée.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(p => {
            const st = statusLabels[p.status] || statusLabels.pending
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:border-cifm-blue-200 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${st.color}`}>{st.label}</span>
                      <span className="text-xs text-gray-400">{formatDate(p.createdAt)}</span>
                      {p.isPublic ? <Eye className="w-3 h-3 text-green-500" /> : <EyeOff className="w-3 h-3 text-gray-300" />}
                      <span className="text-[10px] text-gray-400 uppercase">{p.language}</span>
                    </div>
                    {p.name && <p className="text-sm font-medium text-gray-700">{p.name}</p>}
                    {p.subject && <p className="text-xs text-cifm-blue-600 font-medium">{p.subject}</p>}
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.request}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {p.prayedForCount || 0} prière(s)
                      </span>
                      {p.contact && <span className="text-xs text-gray-400">Contact: {p.contact}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => openDetail(p)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Détails">
                      <Eye className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => openDelete(p)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                      <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AdminModal open={modal === 'detail'} onClose={() => setModal(null)} title="Détail de la prière">
        {current && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {current.name && <p className="text-sm"><span className="font-medium text-gray-700">Nom:</span> {current.name}</p>}
              {current.subject && <p className="text-sm"><span className="font-medium text-gray-700">Sujet:</span> {current.subject}</p>}
              {current.contact && <p className="text-sm"><span className="font-medium text-gray-700">Contact:</span> {current.contact}</p>}
              <p className="text-sm"><span className="font-medium text-gray-700">Langue:</span> {current.language === 'fr' ? 'Français' : 'English'}</p>
              <p className="text-sm"><span className="font-medium text-gray-700">Public:</span> {current.isPublic ? 'Oui' : 'Non'}</p>
              <p className="text-sm"><span className="font-medium text-gray-700">Date:</span> {formatDate(current.createdAt)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{current.request}</p>
            </div>
            <div className="flex gap-2">
              <p className="text-xs text-gray-500 mr-auto pt-2">Changer le statut:</p>
              {(['pending', 'reviewed', 'prayed'] as const).map(s => (
                <button key={s} onClick={() => { updateStatus(current.id, s); setCurrent({ ...current, status: s }) }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${current.status === s ? 'bg-cifm-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {statusLabels[s].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm itemName={current?.name || 'cette prière'}
          onConfirm={handleDelete} onCancel={() => setModal(null)} deleting={deleting} />
      </AdminModal>
    </div>
  )
}
