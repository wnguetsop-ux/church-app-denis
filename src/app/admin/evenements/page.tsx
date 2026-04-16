'use client'

import { useState } from 'react'
import { Calendar, Pencil, Trash2, Plus, Search, MapPin, Clock } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, Toggle, FormActions, DeleteConfirm } from '@/components/admin/AdminFormFields'
import { Timestamp } from 'firebase/firestore'
import type { ChurchEvent } from '@/types'

const EMPTY: Partial<ChurchEvent> = {
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  location: { fr: '', en: '' },
  imageUrl: null,
  registrationRequired: false,
}

function formatDate(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  const d = typeof ts === 'string' ? new Date(ts) : ts.toDate?.() ? ts.toDate() : new Date()
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function toInputDate(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  const d = typeof ts === 'string' ? new Date(ts) : ts.toDate?.() ? ts.toDate() : new Date()
  return d.toISOString().slice(0, 16)
}

export default function AdminEvenements() {
  const { items: events, isLoading, create, update, remove, saving, deleting } = useAdminCrud<ChurchEvent>({
    collection: 'events',
    orderField: 'startAt',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<ChurchEvent> & { startStr?: string; endStr?: string }>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  function openCreate() {
    setCurrent({ ...EMPTY, title: { fr: '', en: '' }, description: { fr: '', en: '' }, location: { fr: '', en: '' }, startStr: '', endStr: '' })
    setEditId(null)
    setModal('create')
  }

  function openEdit(ev: ChurchEvent) {
    setCurrent({ ...ev, startStr: toInputDate(ev.startAt), endStr: toInputDate(ev.endAt ?? undefined) })
    setEditId(ev.id)
    setModal('edit')
  }

  function openDelete(ev: ChurchEvent) {
    setCurrent(ev)
    setEditId(ev.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      title: current.title || { fr: '', en: '' },
      description: current.description || { fr: '', en: '' },
      location: current.location || { fr: '', en: '' },
      startAt: current.startStr ? Timestamp.fromDate(new Date(current.startStr)) : Timestamp.now(),
      endAt: current.endStr ? Timestamp.fromDate(new Date(current.endStr)) : null,
      imageUrl: current.imageUrl || null,
      registrationRequired: current.registrationRequired || false,
      updatedBy: 'admin',
    }
    let success = false
    if (editId) success = await update(editId, data)
    else success = !!(await create(data))
    if (success) setModal(null)
  }

  async function handleDelete() {
    if (editId) {
      const ok = await remove(editId)
      if (ok) setModal(null)
    }
  }

  const filtered = events.filter(ev => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const title = typeof ev.title === 'string' ? ev.title : `${ev.title.fr} ${ev.title.en}`
    return title.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Événements</h1>
            <p className="text-sm text-gray-500">Agenda, lieux, dates et inscriptions</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un événement..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30" />
      </div>

      <p className="text-xs text-gray-400">{filtered.length} événement(s)</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucun événement trouvé.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">Créer le premier</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ev => (
            <div key={ev.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-cifm-blue-200 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-cifm-blue-50 flex flex-col items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-cifm-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {typeof ev.title === 'string' ? ev.title : ev.title.fr}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(ev.startAt)}</span>
                  {ev.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {typeof ev.location === 'string' ? ev.location : ev.location.fr}</span>}
                </div>
                {ev.registrationRequired && (
                  <span className="inline-block mt-1 bg-green-50 text-green-600 rounded px-1.5 py-0.5 text-[10px] font-medium">Inscription requise</span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(ev)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => openDelete(ev)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier l\'événement' : 'Nouvel événement'} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          <BilingualInput label="Titre" required
            valueFr={current.title?.fr ?? ''} valueEn={current.title?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: v, en: p.title?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: p.title?.fr ?? '', en: v } }))}
          />
          <BilingualInput label="Description" multiline rows={4}
            valueFr={current.description?.fr ?? ''} valueEn={current.description?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, description: { ...p.description!, fr: v, en: p.description?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, description: { ...p.description!, fr: p.description?.fr ?? '', en: v } }))}
          />
          <BilingualInput label="Lieu"
            valueFr={current.location?.fr ?? ''} valueEn={current.location?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, location: { ...p.location!, fr: v, en: p.location?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, location: { ...p.location!, fr: p.location?.fr ?? '', en: v } }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Début" required>
              <Input type="datetime-local" value={current.startStr ?? ''} onChange={v => setCurrent(p => ({ ...p, startStr: v }))} />
            </Field>
            <Field label="Fin" hint="Optionnel">
              <Input type="datetime-local" value={current.endStr ?? ''} onChange={v => setCurrent(p => ({ ...p, endStr: v }))} />
            </Field>
          </div>
          <Field label="Image (URL)" hint="Optionnel">
            <Input value={current.imageUrl ?? ''} onChange={v => setCurrent(p => ({ ...p, imageUrl: v || null }))} placeholder="https://..." />
          </Field>
          <Toggle label="Inscription requise" checked={current.registrationRequired ?? false}
            onChange={v => setCurrent(p => ({ ...p, registrationRequired: v }))} />
          <FormActions onCancel={() => setModal(null)} saving={saving} />
        </form>
      </AdminModal>

      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm itemName={typeof current.title === 'string' ? current.title : current.title?.fr ?? ''}
          onConfirm={handleDelete} onCancel={() => setModal(null)} deleting={deleting} />
      </AdminModal>
    </div>
  )
}
