'use client'

import { useState } from 'react'
import { Pencil, Trash2, Star, Plus, Search, Headphones, FileText } from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import AdminModal from '@/components/admin/AdminModal'
import FileUpload from '@/components/admin/FileUpload'
import AudioRecorderUpload from '@/components/admin/AudioRecorderUpload'
import {
  BilingualInput,
  Field,
  Input,
  TagsInput,
  Toggle,
  FormActions,
  DeleteConfirm,
  Select,
} from '@/components/admin/AdminFormFields'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import { publishContentNotification } from '@/lib/firebase/services/notifications'
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

  function openEdit(item: Teaching) {
    setCurrent({ ...item })
    setEditId(item.id)
    setModal('edit')
  }

  function openDelete(item: Teaching) {
    setCurrent(item)
    setEditId(item.id)
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

    let success = false
    if (editId) {
      success = await update(editId, data)
    } else {
      const id = await create(data)
      if (id) {
        await publishContentNotification({
          category: data.type === 'audio' ? 'audios' : 'enseignements',
          title: {
            fr: data.type === 'audio' ? 'Nouveau podcast publie' : 'Nouvel enseignement publie',
            en: data.type === 'audio' ? 'New podcast published' : 'New teaching published',
          },
          body: {
            fr: data.title.fr || 'Un nouveau contenu est disponible.',
            en: data.title.en || data.title.fr || 'New content is available.',
          },
          targetPath: data.type === 'audio' ? '/audios' : '/enseignements',
          entityId: id,
        })
      }
      success = !!id
    }
    if (success) setModal(null)
  }

  async function handleDelete() {
    if (!editId) return
    const ok = await remove(editId)
    if (ok) setModal(null)
  }

  const filtered = teachings.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const title = typeof item.title === 'string' ? item.title : `${item.title.fr} ${item.title.en}`
    return title.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Headphones className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Enseignements / Podcasts</h1>
            <p className="text-sm text-gray-500">Textes et podcasts d&apos;enseignement biblique</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-cifm-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-cifm-blue-500">
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
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
          {(['all', 'text', 'audio'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === filter ? 'bg-white text-cifm-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {filter === 'all' ? 'Tous' : filter === 'text' ? 'Textes' : 'Podcasts'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} enseignement(s)</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 animate-pulse">
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
              <div className="h-3 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Headphones className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-500">Aucun enseignement trouve.</p>
          <button onClick={openCreate} className="mt-2 text-sm font-medium text-cifm-blue-600 hover:underline">
            Creer le premier
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-cifm-blue-200">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                {item.type === 'audio' ? <Headphones className="h-5 w-5 text-purple-500" /> : <FileText className="h-5 w-5 text-cifm-blue-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${item.type === 'audio' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-cifm-blue-600'}`}>
                    {item.type}
                  </span>
                  <h3 className="truncate text-sm font-medium text-gray-900">
                    {typeof item.title === 'string' ? item.title : item.title.fr}
                  </h3>
                  {item.featured && <Star className="h-3.5 w-3.5 flex-shrink-0 fill-cifm-gold-500 text-cifm-gold-500" />}
                </div>
                <div className="mt-1 flex gap-1">
                  {item.tags?.slice(0, 3).map(tag => (
                    <span key={tag} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1">
                <button onClick={() => openEdit(item)} className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                  <Pencil className="h-4 w-4 text-gray-400" />
                </button>
                <button onClick={() => openDelete(item)} className="rounded-lg p-2 transition-colors hover:bg-red-50">
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal
        open={modal === 'create' || modal === 'edit'}
        onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier l\'enseignement' : 'Nouvel enseignement'}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Type">
            <Select
              value={current.type || 'text'}
              onChange={value => setCurrent(prev => ({ ...prev, type: value as 'text' | 'audio' }))}
              options={[
                { value: 'text', label: 'Texte ecrit' },
                { value: 'audio', label: 'Podcast' },
              ]}
            />
          </Field>

          <BilingualInput
            label="Titre"
            required
            valueFr={current.title?.fr ?? ''}
            valueEn={current.title?.en ?? ''}
            onChangeFr={value => setCurrent(prev => ({ ...prev, title: { fr: value, en: prev.title?.en ?? '' } }))}
            onChangeEn={value => setCurrent(prev => ({ ...prev, title: { fr: prev.title?.fr ?? '', en: value } }))}
          />

          {current.type === 'text' && (
            <BilingualInput
              label="Contenu"
              required
              multiline
              rows={8}
              valueFr={current.body?.fr ?? ''}
              valueEn={current.body?.en ?? ''}
              onChangeFr={value => setCurrent(prev => ({ ...prev, body: { fr: value, en: prev.body?.en ?? '' } }))}
              onChangeEn={value => setCurrent(prev => ({ ...prev, body: { fr: prev.body?.fr ?? '', en: value } }))}
            />
          )}

          {current.type === 'audio' && (
            <div className="space-y-4">
              <FileUpload
                label="Fichier audio"
                storagePath="teachings"
                value={current.audioUrl ?? ''}
                onUpload={url => setCurrent(prev => ({ ...prev, audioUrl: url }))}
                accept="audio/*"
                maxSizeMB={50}
                hint="Importez un fichier audio, collez une URL ou utilisez le micro."
              />
              <AudioRecorderUpload
                storagePath="teachings"
                onUpload={({ url, duration }) => setCurrent(prev => ({
                  ...prev,
                  audioUrl: url,
                  audioDuration: prev.audioDuration || duration,
                }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="URL audio" required hint="Lien vers le fichier audio">
                  <Input value={current.audioUrl ?? ''} onChange={value => setCurrent(prev => ({ ...prev, audioUrl: value }))} placeholder="https://..." />
                </Field>
                <Field label="Duree" hint="Ex: 38:42">
                  <Input value={current.audioDuration ?? ''} onChange={value => setCurrent(prev => ({ ...prev, audioDuration: value }))} placeholder="38:42" />
                </Field>
              </div>
            </div>
          )}

          <FileUpload
            label="Image de couverture"
            storagePath="teachings"
            value={current.coverImageUrl ?? ''}
            onUpload={url => setCurrent(prev => ({ ...prev, coverImageUrl: url || null }))}
            accept="image/*"
            maxSizeMB={5}
            hint="Optionnel"
          />

          <Field label="Tags">
            <TagsInput value={current.tags ?? []} onChange={tags => setCurrent(prev => ({ ...prev, tags }))} />
          </Field>

          <Toggle
            label="Enseignement en vedette"
            checked={current.featured ?? false}
            onChange={value => setCurrent(prev => ({ ...prev, featured: value }))}
          />

          <FormActions onCancel={() => setModal(null)} saving={saving} />
        </form>
      </AdminModal>

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
