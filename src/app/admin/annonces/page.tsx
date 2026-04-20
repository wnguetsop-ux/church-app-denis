'use client'

import { useState } from 'react'
import { Megaphone, Pencil, Trash2, Plus, Search, AlertTriangle } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, FormActions, DeleteConfirm, Select } from '@/components/admin/AdminFormFields'
import { Timestamp } from 'firebase/firestore'
import type { Announcement } from '@/types'
import { publishContentNotification } from '@/lib/firebase/services/notifications'

const EMPTY: Partial<Announcement> = {
  title: { fr: '', en: '' },
  body: { fr: '', en: '' },
  imageUrl: null,
  priority: 'normal',
}

function formatDate(ts: Timestamp | string | undefined): string {
  if (!ts) return ''
  const d = typeof ts === 'string' ? new Date(ts) : ts.toDate?.() ? ts.toDate() : new Date()
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminAnnonces() {
  const { items: annonces, isLoading, create, update, remove, saving, deleting } = useAdminCrud<Announcement>({
    collection: 'announcements',
    orderField: 'publishedAt',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<Announcement> & { expiresStr?: string }>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  function openCreate() {
    setCurrent({ ...EMPTY, title: { fr: '', en: '' }, body: { fr: '', en: '' }, expiresStr: '' })
    setEditId(null)
    setModal('create')
  }

  function openEdit(a: Announcement) {
    const expiresStr = a.expiresAt ? (typeof a.expiresAt === 'string' ? a.expiresAt : a.expiresAt.toDate?.().toISOString().slice(0, 10)) : ''
    setCurrent({ ...a, expiresStr: expiresStr || '' })
    setEditId(a.id)
    setModal('edit')
  }

  function openDelete(a: Announcement) {
    setCurrent(a)
    setEditId(a.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      title: current.title || { fr: '', en: '' },
      body: current.body || { fr: '', en: '' },
      imageUrl: current.imageUrl || null,
      priority: current.priority || 'normal',
      publishedAt: Timestamp.now(),
      expiresAt: current.expiresStr ? Timestamp.fromDate(new Date(current.expiresStr)) : null,
      updatedBy: 'admin',
    }
    let success = false
    if (editId) success = await update(editId, data)
    else {
      const id = await create(data)
      if (id) {
        await publishContentNotification({
          category: 'annonces',
          title: { fr: 'Nouvelle annonce publiée', en: 'New announcement published' },
          body: {
            fr: data.title.fr || 'Une nouvelle annonce est disponible.',
            en: data.title.en || data.title.fr || 'A new announcement is available.',
          },
          targetPath: '/annonces',
          entityId: id,
        })
      }
      success = !!id
    }
    if (success) setModal(null)
  }

  async function handleDelete() {
    if (editId) {
      const ok = await remove(editId)
      if (ok) setModal(null)
    }
  }

  const filtered = annonces.filter(a => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const title = typeof a.title === 'string' ? a.title : `${a.title.fr} ${a.title.en}`
    return title.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Annonces</h1>
            <p className="text-sm text-gray-500">Actualités et informations de la communauté</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher une annonce..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30" />
      </div>

      <p className="text-xs text-gray-400">{filtered.length} annonce(s)</p>

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
          <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucune annonce trouvée.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">Créer la première</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-cifm-blue-200 transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${a.priority === 'urgent' ? 'bg-red-50' : 'bg-gray-100'}`}>
                {a.priority === 'urgent' ? <AlertTriangle className="w-5 h-5 text-red-500" /> : <Megaphone className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {a.priority === 'urgent' && (
                    <span className="bg-red-50 text-red-600 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase">Urgent</span>
                  )}
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {typeof a.title === 'string' ? a.title : a.title.fr}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{formatDate(a.publishedAt)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(a)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => openDelete(a)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier l\'annonce' : 'Nouvelle annonce'} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          <BilingualInput label="Titre" required
            valueFr={current.title?.fr ?? ''} valueEn={current.title?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: v, en: p.title?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: p.title?.fr ?? '', en: v } }))}
          />
          <BilingualInput label="Contenu" required multiline rows={5}
            valueFr={current.body?.fr ?? ''} valueEn={current.body?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, body: { ...p.body!, fr: v, en: p.body?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, body: { ...p.body!, fr: p.body?.fr ?? '', en: v } }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Priorité">
              <Select value={current.priority || 'normal'} onChange={v => setCurrent(p => ({ ...p, priority: v as 'normal' | 'urgent' }))}
                options={[{ value: 'normal', label: 'Normale' }, { value: 'urgent', label: 'Urgente' }]} />
            </Field>
            <Field label="Date d'expiration" hint="Optionnel">
              <Input type="date" value={current.expiresStr ?? ''} onChange={v => setCurrent(p => ({ ...p, expiresStr: v }))} />
            </Field>
          </div>
          <Field label="Image (URL)" hint="Optionnel">
            <Input value={current.imageUrl ?? ''} onChange={v => setCurrent(p => ({ ...p, imageUrl: v || null }))} placeholder="https://..." />
          </Field>
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
