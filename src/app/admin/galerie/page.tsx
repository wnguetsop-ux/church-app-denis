'use client'

import { useState } from 'react'
import { ImageIcon, Pencil, Trash2, Plus, Search, Film, Image } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, FormActions, DeleteConfirm, Select } from '@/components/admin/AdminFormFields'
import type { GalleryItem } from '@/types'

const EMPTY: Partial<GalleryItem> = {
  type: 'image',
  url: '',
  thumbnailUrl: '',
  caption: { fr: '', en: '' },
  album: null,
  order: 0,
  duration: null,
}

export default function AdminGalerie() {
  const { items, isLoading, create, update, remove, saving, deleting } = useAdminCrud<GalleryItem>({
    collection: 'gallery',
    orderField: 'order',
    orderDirection: 'asc',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<GalleryItem>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all')

  function openCreate() {
    setCurrent({ ...EMPTY, caption: { fr: '', en: '' } })
    setEditId(null)
    setModal('create')
  }

  function openEdit(item: GalleryItem) {
    setCurrent({ ...item })
    setEditId(item.id)
    setModal('edit')
  }

  function openDelete(item: GalleryItem) {
    setCurrent(item)
    setEditId(item.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      type: current.type || 'image',
      url: current.url || '',
      thumbnailUrl: current.thumbnailUrl || current.url || '',
      caption: current.caption || null,
      album: current.album || null,
      order: Number(current.order) || 0,
      duration: current.type === 'video' ? (current.duration || null) : null,
      uploadedBy: 'admin',
    }
    if (editId) await update(editId, data)
    else await create(data)
    setModal(null)
  }

  async function handleDelete() {
    if (editId) {
      const ok = await remove(editId)
      if (ok) setModal(null)
    }
  }

  const filtered = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const cap = item.caption ? `${item.caption.fr} ${item.caption.en}` : ''
    return cap.toLowerCase().includes(q) || (item.album ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Galerie</h1>
            <p className="text-sm text-gray-500">Photos et vidéos courtes de la communauté</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'image', 'video'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === f ? 'bg-white text-cifm-blue-600 shadow-sm' : 'text-gray-500'}`}>
              {f === 'all' ? 'Tous' : f === 'image' ? 'Photos' : 'Vidéos'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} élément(s)</p>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucun élément trouvé.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">Ajouter le premier</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-cifm-blue-200 transition-colors">
              <div className="aspect-square bg-gray-100 relative">
                {item.url && (
                  <img src={item.thumbnailUrl || item.url} alt="" className="w-full h-full object-cover" />
                )}
                {item.type === 'video' && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white rounded px-1.5 py-0.5 text-[10px] flex items-center gap-1">
                    <Film className="w-3 h-3" /> {item.duration || 'Vidéo'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => openEdit(item)} className="p-2 bg-white rounded-lg shadow-sm mr-2"><Pencil className="w-4 h-4 text-gray-600" /></button>
                  <button onClick={() => openDelete(item)} className="p-2 bg-white rounded-lg shadow-sm"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{item.caption?.fr || item.album || '—'}</p>
                <p className="text-[10px] text-gray-400">#{item.order}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier l\'élément' : 'Nouvel élément'} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Type">
            <Select value={current.type || 'image'} onChange={v => setCurrent(p => ({ ...p, type: v as 'image' | 'video' }))}
              options={[{ value: 'image', label: 'Photo' }, { value: 'video', label: 'Vidéo courte' }]} />
          </Field>

          <Field label="URL du fichier" required hint="Lien vers l'image ou la vidéo">
            <Input value={current.url ?? ''} onChange={v => setCurrent(p => ({ ...p, url: v }))} placeholder="https://..." />
          </Field>

          <Field label="URL miniature" hint="Optionnel — si différent de l'URL principale">
            <Input value={current.thumbnailUrl ?? ''} onChange={v => setCurrent(p => ({ ...p, thumbnailUrl: v }))} placeholder="https://..." />
          </Field>

          <BilingualInput label="Légende"
            valueFr={current.caption?.fr ?? ''} valueEn={current.caption?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, caption: { fr: v, en: p.caption?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, caption: { fr: p.caption?.fr ?? '', en: v } }))}
          />

          <div className="grid grid-cols-3 gap-4">
            <Field label="Album" hint="Optionnel">
              <Input value={current.album ?? ''} onChange={v => setCurrent(p => ({ ...p, album: v || null }))} placeholder="culte-2025" />
            </Field>
            <Field label="Ordre" hint="Numéro de tri">
              <Input type="number" value={String(current.order ?? 0)} onChange={v => setCurrent(p => ({ ...p, order: Number(v) }))} />
            </Field>
            {current.type === 'video' && (
              <Field label="Durée" hint="Ex: 0:45">
                <Input value={current.duration ?? ''} onChange={v => setCurrent(p => ({ ...p, duration: v || null }))} placeholder="0:45" />
              </Field>
            )}
          </div>

          <FormActions onCancel={() => setModal(null)} saving={saving} />
        </form>
      </AdminModal>

      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm itemName={current.caption?.fr || 'cet élément'}
          onConfirm={handleDelete} onCancel={() => setModal(null)} deleting={deleting} />
      </AdminModal>
    </div>
  )
}
