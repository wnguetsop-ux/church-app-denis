'use client'

import { useState } from 'react'
import { BookOpen, Pencil, Trash2, Star, Plus, Search, Headphones, FileText } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, TagsInput, Toggle, FormActions, DeleteConfirm, Select } from '@/components/admin/AdminFormFields'
import { Timestamp } from 'firebase/firestore'
import type { Teaching } from '@/types'

const EMPTY: Partial<Teaching> = {
  type: 'text',
  title: { fr: '', en: '' },
  body: { fr: '', en: '' },
  audioUrl: null,
  audioDuration: null,
  coverImageUrl: null,
  tags: [],
  featured: false,
}

export default function AdminEnseignements() {
  const { items: teachings, isLoading, create, update, remove, saving, deleting } = useAdminCrud<Teaching>({
    collection: 'teachings',
    orderField: 'publishedAt',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<Teaching>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'text' | 'audio'>('all')

  function openCreate() {
    setCurrent({ ...EMPTY, title: { fr: '', en: '' }, body: { fr: '', en: '' } })
    setEditId(null)
    setModal('create')
  }

  function openEdit(t: Teaching) {
    setCurrent({ ...t })
    setEditId(t.id)
    setModal('edit')
  }

  function openDelete(t: Teaching) {
    setCurrent(t)
    setEditId(t.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      type: current.type || 'text',
      title: current.title || { fr: '', en: '' },
      body: current.type === 'text' ? (current.body || { fr: '', en: '' }) : null,
      audioUrl: current.type === 'audio' ? (current.audioUrl || null) : null,
      audioDuration: current.type === 'audio' ? (current.audioDuration || null) : null,
      coverImageUrl: current.coverImageUrl || null,
      tags: current.tags || [],
      featured: current.featured || false,
      publishedAt: Timestamp.now(),
      updatedBy: 'admin',
    }

    if (editId) {
      await update(editId, data)
    } else {
      await create(data)
    }
    setModal(null)
  }

  async function handleDelete() {
    if (editId) {
      const ok = await remove(editId)
      if (ok) setModal(null)
    }
  }

  const filtered = teachings.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const title = typeof t.title === 'string' ? t.title : `${t.title.fr} ${t.title.en}`
    return title.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Enseignements</h1>
            <p className="text-sm text-gray-500">Textes et audios d&apos;enseignement biblique</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30" />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(['all', 'text', 'audio'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterType === f ? 'bg-white text-cifm-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {f === 'all' ? 'Tous' : f === 'text' ? 'Textes' : 'Audios'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} enseignement(s)</p>

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
          <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucun enseignement trouvé.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">Créer le premier</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:border-cifm-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                {t.type === 'audio' ? <Headphones className="w-5 h-5 text-purple-500" /> : <FileText className="w-5 h-5 text-cifm-blue-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${t.type === 'audio' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-cifm-blue-600'}`}>
                    {t.type}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {typeof t.title === 'string' ? t.title : t.title.fr}
                  </h3>
                  {t.featured && <Star className="w-3.5 h-3.5 text-cifm-gold-500 fill-cifm-gold-500 flex-shrink-0" />}
                </div>
                <div className="flex gap-1 mt-1">
                  {t.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-500 rounded px-1.5 py-0.5 text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(t)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => openDelete(t)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier l\'enseignement' : 'Nouvel enseignement'} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Type">
            <Select value={current.type || 'text'} onChange={v => setCurrent(p => ({ ...p, type: v as 'text' | 'audio' }))}
              options={[{ value: 'text', label: 'Texte écrit' }, { value: 'audio', label: 'Audio' }]} />
          </Field>

          <BilingualInput label="Titre" required
            valueFr={current.title?.fr ?? ''} valueEn={current.title?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: v, en: p.title?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, title: { ...p.title!, fr: p.title?.fr ?? '', en: v } }))}
          />

          {current.type === 'text' && (
            <BilingualInput label="Contenu" required multiline rows={8}
              valueFr={current.body?.fr ?? ''} valueEn={current.body?.en ?? ''}
              onChangeFr={v => setCurrent(p => ({ ...p, body: { ...p.body!, fr: v, en: p.body?.en ?? '' } }))}
              onChangeEn={v => setCurrent(p => ({ ...p, body: { ...p.body!, fr: p.body?.fr ?? '', en: v } }))}
            />
          )}

          {current.type === 'audio' && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="URL audio" required hint="Lien vers le fichier audio">
                <Input value={current.audioUrl ?? ''} onChange={v => setCurrent(p => ({ ...p, audioUrl: v }))} placeholder="https://..." />
              </Field>
              <Field label="Durée" hint="Ex: 38:42">
                <Input value={current.audioDuration ?? ''} onChange={v => setCurrent(p => ({ ...p, audioDuration: v }))} placeholder="38:42" />
              </Field>
            </div>
          )}

          <Field label="Image de couverture (URL)" hint="Optionnel">
            <Input value={current.coverImageUrl ?? ''} onChange={v => setCurrent(p => ({ ...p, coverImageUrl: v || null }))} placeholder="https://..." />
          </Field>

          <Field label="Tags">
            <TagsInput value={current.tags ?? []} onChange={tags => setCurrent(p => ({ ...p, tags }))} />
          </Field>

          <Toggle label="Enseignement en vedette" checked={current.featured ?? false}
            onChange={v => setCurrent(p => ({ ...p, featured: v }))} />

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
