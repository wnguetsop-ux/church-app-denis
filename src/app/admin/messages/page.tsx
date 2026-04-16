'use client'

import { useState } from 'react'
import { Video, Pencil, Trash2, Star, Plus, Search } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, TagsInput, Toggle, FormActions, DeleteConfirm } from '@/components/admin/AdminFormFields'
import FileUpload from '@/components/admin/FileUpload'
import { Timestamp } from 'firebase/firestore'
import type { Sermon } from '@/types'

const EMPTY: Partial<Sermon> = {
  youtubeVideoId: '',
  title: { fr: '', en: '' },
  description: { fr: '', en: '' },
  speaker: '',
  series: null,
  tags: [],
  featured: false,
}

export default function AdminMessages() {
  const { items: sermons, isLoading, create, update, remove, saving, deleting } = useAdminCrud<Sermon>({
    collection: 'sermons',
    orderField: 'publishedAt',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<Sermon>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  function openCreate() {
    setCurrent({ ...EMPTY, title: { fr: '', en: '' }, description: { fr: '', en: '' } })
    setEditId(null)
    setModal('create')
  }

  function openEdit(s: Sermon) {
    setCurrent({ ...s })
    setEditId(s.id)
    setModal('edit')
  }

  function openDelete(s: Sermon) {
    setCurrent(s)
    setEditId(s.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      youtubeVideoId: current.youtubeVideoId || '',
      title: current.title || { fr: '', en: '' },
      description: current.description || { fr: '', en: '' },
      speaker: current.speaker || '',
      series: current.series || null,
      tags: current.tags || [],
      featured: current.featured || false,
      publishedAt: Timestamp.now(),
    }

    let success = false
    if (editId) {
      success = await update(editId, data)
    } else {
      const id = await create(data)
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

  const filtered = sermons.filter(s => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const t = typeof s.title === 'string' ? s.title : `${s.title.fr} ${s.title.en}`
    return t.toLowerCase().includes(q) || s.speaker?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Video className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Messages / Sermons</h1>
            <p className="text-sm text-gray-500">Vidéos YouTube de prédications et sermons</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un sermon..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30"
        />
      </div>

      {/* Stats */}
      <p className="text-xs text-gray-400">{filtered.length} sermon(s)</p>

      {/* List */}
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
          <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucun sermon trouvé.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">
            Créer le premier
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-cifm-blue-200 transition-colors">
              {/* YouTube thumbnail */}
              <div className="w-20 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {s.youtubeVideoId && !s.youtubeVideoId.startsWith('_') && (
                  <img
                    src={`https://img.youtube.com/vi/${s.youtubeVideoId}/mqdefault.jpg`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {typeof s.title === 'string' ? s.title : s.title.fr}
                  </h3>
                  {s.featured && <Star className="w-3.5 h-3.5 text-cifm-gold-500 fill-cifm-gold-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 truncate">{s.speaker}</p>
                <div className="flex gap-1 mt-1">
                  {s.tags?.slice(0, 3).map(t => (
                    <span key={t} className="bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 text-[10px]">{t}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(s)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Modifier">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => openDelete(s)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AdminModal
        open={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier le sermon' : 'Nouveau sermon'}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <BilingualInput
            label="Titre"
            required
            valueFr={current.title?.fr ?? ''}
            valueEn={current.title?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: v, en: p.title?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: p.title?.fr ?? '', en: v } }))}
          />

          <BilingualInput
            label="Description"
            valueFr={current.description?.fr ?? ''}
            valueEn={current.description?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, description: { ...p.description!, fr: v, en: p.description?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, description: { ...p.description!, fr: p.description?.fr ?? '', en: v } }))}
            multiline
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="YouTube Video ID" required hint="11 caractères après ?v= dans l'URL">
              <Input
                value={current.youtubeVideoId ?? ''}
                onChange={v => setCurrent(p => ({ ...p, youtubeVideoId: v }))}
                placeholder="dQw4w9WgXcQ"
              />
            </Field>
            <Field label="Prédicateur" required>
              <Input
                value={current.speaker ?? ''}
                onChange={v => setCurrent(p => ({ ...p, speaker: v }))}
                placeholder="Descartes Tadum"
              />
            </Field>
          </div>

          <Field label="Tags">
            <TagsInput
              value={current.tags ?? []}
              onChange={tags => setCurrent(p => ({ ...p, tags }))}
              placeholder="Entrer + Entrée pour ajouter"
            />
          </Field>

          <Toggle
            label="Sermon en vedette (affiché en premier)"
            checked={current.featured ?? false}
            onChange={v => setCurrent(p => ({ ...p, featured: v }))}
          />

          <FormActions onCancel={() => setModal(null)} saving={saving} />
        </form>
      </AdminModal>

      {/* Delete Modal */}
      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm
          itemName={typeof current.title === 'string' ? current.title : current.title?.fr ?? ''}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
          deleting={deleting}
        />
      </AdminModal>
    </div>
  )
}
