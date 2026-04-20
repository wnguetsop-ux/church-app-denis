'use client'

import { useMemo, useState } from 'react'
import {
  HandHeart,
  Trash2,
  Search,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Heart,
  MessageSquareReply,
  Phone,
  Mail,
  Send,
} from 'lucide-react'
import type { Timestamp } from 'firebase/firestore'
import AdminModal from '@/components/admin/AdminModal'
import { DeleteConfirm } from '@/components/admin/AdminFormFields'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import type { PrayerRequest } from '@/types'

function formatDate(ts: Timestamp | string | undefined | null): string {
  if (!ts) return ''
  const date = typeof ts === 'string' ? new Date(ts) : ts.toDate?.() ? ts.toDate() : new Date()
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabels: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'En attente', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  reviewed: { label: 'Lue', color: 'bg-blue-50 text-blue-700', icon: Eye },
  prayed: { label: 'Priee', color: 'bg-green-50 text-green-700', icon: CheckCircle },
}

function buildContactAction(contact: string) {
  const trimmed = contact.trim()
  if (trimmed.includes('@')) {
    return { href: `mailto:${trimmed}`, label: 'Repondre par email', icon: Mail }
  }

  const digits = trimmed.replace(/[^\d+]/g, '')
  if (digits) {
    return { href: `tel:${digits}`, label: 'Appeler', icon: Phone }
  }

  return null
}

export default function AdminPrieres() {
  const { items: prayers, isLoading, update, remove, deleting, saving } = useAdminCrud<PrayerRequest>({
    collection: 'prayers',
    orderField: 'createdAt',
  })

  const [modal, setModal] = useState<'detail' | 'delete' | null>(null)
  const [current, setCurrent] = useState<PrayerRequest | null>(null)
  const [responseDraft, setResponseDraft] = useState('')
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'prayed'>('all')

  function openDetail(prayer: PrayerRequest) {
    setCurrent(prayer)
    setResponseDraft(prayer.pastoralResponse ?? '')
    setModal('detail')
  }

  function openDelete(prayer: PrayerRequest) {
    setCurrent(prayer)
    setModal('delete')
  }

  async function updateStatus(id: string, status: PrayerRequest['status']) {
    await update(id, { status })
  }

  async function savePastoralResponse() {
    if (!current) return
    const trimmed = responseDraft.trim()

    const payload = {
      pastoralResponse: trimmed || null,
      respondedAt: trimmed ? new Date().toISOString() : null,
      respondedBy: trimmed ? 'admin' : null,
      status: current.status === 'pending' && trimmed ? 'reviewed' : current.status,
    }

    const ok = await update(current.id, payload)
    if (!ok) return

    setCurrent(prev => prev ? {
      ...prev,
      pastoralResponse: payload.pastoralResponse,
      respondedAt: payload.respondedAt as unknown as Timestamp,
      respondedBy: payload.respondedBy,
      status: payload.status,
    } : prev)
  }

  async function handleDelete() {
    if (!current) return
    const ok = await remove(current.id)
    if (ok) setModal(null)
  }

  const filtered = useMemo(() => prayers.filter(prayer => {
    if (filterStatus !== 'all' && prayer.status !== filterStatus) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (prayer.name ?? '').toLowerCase().includes(q) ||
      prayer.request.toLowerCase().includes(q) ||
      (prayer.subject ?? '').toLowerCase().includes(q) ||
      (prayer.pastoralResponse ?? '').toLowerCase().includes(q)
    )
  }), [filterStatus, prayers, search])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cifm-blue-50">
            <HandHeart className="h-5 w-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Prieres recues</h1>
            <p className="text-sm text-gray-500">Demandes de priere soumises par les fideles</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-cifm-blue-600">{prayers.length}</p>
          <p className="text-xs text-gray-400">total</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30"
          />
        </div>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['all', 'pending', 'reviewed', 'prayed'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterStatus(filter)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filterStatus === filter ? 'bg-white text-cifm-blue-600 shadow-sm' : 'text-gray-500'}`}
            >
              {filter === 'all' ? 'Toutes' : statusLabels[filter].label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} priere(s)</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-full rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <HandHeart className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">Aucune priere trouvee.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(prayer => {
            const status = statusLabels[prayer.status] || statusLabels.pending
            return (
              <div key={prayer.id} className="rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-cifm-blue-200">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${status.color}`}>{status.label}</span>
                      <span className="text-xs text-gray-400">{formatDate(prayer.createdAt)}</span>
                      {prayer.isPublic ? <Eye className="h-3 w-3 text-green-500" /> : <EyeOff className="h-3 w-3 text-gray-300" />}
                      <span className="text-[10px] uppercase text-gray-400">{prayer.language}</span>
                    </div>
                    {prayer.name && <p className="text-sm font-medium text-gray-700">{prayer.name}</p>}
                    {prayer.subject && <p className="text-xs font-medium text-cifm-blue-600">{prayer.subject}</p>}
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">{prayer.request}</p>
                    {prayer.pastoralResponse && (
                      <div className="mt-2 rounded-lg bg-green-50 p-3 text-xs text-green-800">
                        <p className="mb-1 font-semibold">Reponse pastorale</p>
                        <p className="line-clamp-2 whitespace-pre-wrap">{prayer.pastoralResponse}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Heart className="h-3 w-3" /> {prayer.prayedForCount || 0} priere(s)
                      </span>
                      {prayer.contact && <span className="text-xs text-gray-400">Contact: {prayer.contact}</span>}
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 flex-col gap-1">
                    <button onClick={() => openDetail(prayer)} className="rounded-lg p-2 transition-colors hover:bg-gray-100" title="Details">
                      <MessageSquareReply className="h-4 w-4 text-gray-400" />
                    </button>
                    <button onClick={() => openDelete(prayer)} className="rounded-lg p-2 transition-colors hover:bg-red-50" title="Supprimer">
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AdminModal open={modal === 'detail'} onClose={() => setModal(null)} title="Detail de la priere">
        {current && (
          <div className="space-y-4">
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              {current.name && <p className="text-sm"><span className="font-medium text-gray-700">Nom:</span> {current.name}</p>}
              {current.subject && <p className="text-sm"><span className="font-medium text-gray-700">Sujet:</span> {current.subject}</p>}
              {current.contact && <p className="text-sm"><span className="font-medium text-gray-700">Contact:</span> {current.contact}</p>}
              <p className="text-sm"><span className="font-medium text-gray-700">Langue:</span> {current.language === 'fr' ? 'Francais' : 'English'}</p>
              <p className="text-sm"><span className="font-medium text-gray-700">Public:</span> {current.isPublic ? 'Oui' : 'Non'}</p>
              <p className="text-sm"><span className="font-medium text-gray-700">Date:</span> {formatDate(current.createdAt)}</p>
              {current.respondedAt && (
                <p className="text-sm"><span className="font-medium text-gray-700">Derniere reponse:</span> {formatDate(current.respondedAt)}</p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{current.request}</p>
            </div>

            {current.contact && (() => {
              const action = buildContactAction(current.contact)
              if (!action) return null
              const Icon = action.icon
              return (
                <a
                  href={action.href}
                  target={action.href.startsWith('mailto:') ? '_blank' : undefined}
                  rel={action.href.startsWith('mailto:') ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-lg bg-cifm-blue-50 px-3 py-2 text-xs font-medium text-cifm-blue-700 hover:bg-cifm-blue-100"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {action.label}
                </a>
              )
            })()}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Reponse pastorale</label>
              <textarea
                value={responseDraft}
                onChange={e => setResponseDraft(e.target.value)}
                rows={5}
                placeholder="Ecrivez une parole d'encouragement, un conseil biblique ou une reponse a envoyer au fidele..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-all focus:ring-2 focus:ring-cifm-blue-400/30"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-gray-400">La reponse est enregistree avec la demande de priere.</p>
                <button
                  type="button"
                  onClick={savePastoralResponse}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-cifm-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-cifm-blue-500 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer la reponse'}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <p className="mr-auto pt-2 text-xs text-gray-500">Changer le statut:</p>
              {(['pending', 'reviewed', 'prayed'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => {
                    updateStatus(current.id, status)
                    setCurrent({ ...current, status })
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${current.status === status ? 'bg-cifm-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {statusLabels[status].label}
                </button>
              ))}
            </div>
          </div>
        )}
      </AdminModal>

      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm
          itemName={current?.name || 'cette priere'}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          deleting={deleting}
        />
      </AdminModal>
    </div>
  )
}
