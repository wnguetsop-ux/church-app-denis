'use client'

import { useState, useEffect } from 'react'
import { Church, Save, CheckCircle } from 'lucide-react'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { getDocById, updateDocById, createDoc } from '@/lib/firebase/services/admin-crud'
import { BilingualInput } from '@/components/admin/AdminFormFields'

interface AboutData {
  name: { fr: string; en: string }
  tagline: { fr: string; en: string }
  description: { fr: string; en: string }
}

const EMPTY: AboutData = {
  name: { fr: 'Communauté Internationale des Fils de Malachie 4', en: 'International Community of the Sons of Malachi 4' },
  tagline: { fr: '', en: '' },
  description: { fr: '', en: '' },
}

export default function AdminAPropos() {
  const [data, setData] = useState<AboutData>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [docId, setDocId] = useState<string | null>('main')

  useEffect(() => {
    async function load() {
      if (!isFirebaseConfigured) { setLoading(false); return }
      try {
        const doc = await getDocById('churchInfo', 'main')
        if (doc) {
          setData({
            name: doc.name || EMPTY.name,
            tagline: doc.tagline || { fr: '', en: '' },
            description: doc.description || { fr: '', en: '' },
          })
          setDocId(doc.id)
        }
      } catch { /* ignore */ }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!isFirebaseConfigured) {
      alert('Firebase non configuré — mode démo.')
      return
    }
    setSaving(true)
    try {
      if (docId) {
        await updateDocById('churchInfo', docId, data)
      } else {
        await createDoc('churchInfo', data)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
          <Church className="w-5 h-5 text-cifm-blue-600" />
        </div>
        <div>
          <h1 className="font-lora text-xl font-semibold text-gray-900">À propos / Église</h1>
          <p className="text-sm text-gray-500">Mission, présentation et identité de l&apos;église</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded" />)}
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <BilingualInput label="Nom de l'église" required
            valueFr={data.name.fr} valueEn={data.name.en}
            onChangeFr={v => setData(p => ({ ...p, name: { ...p.name, fr: v } }))}
            onChangeEn={v => setData(p => ({ ...p, name: { ...p.name, en: v } }))}
          />

          <BilingualInput label="Slogan / Accroche"
            valueFr={data.tagline.fr} valueEn={data.tagline.en}
            onChangeFr={v => setData(p => ({ ...p, tagline: { ...p.tagline, fr: v } }))}
            onChangeEn={v => setData(p => ({ ...p, tagline: { ...p.tagline, en: v } }))}
          />

          <BilingualInput label="Description / Mission" multiline rows={8}
            valueFr={data.description.fr} valueEn={data.description.en}
            onChangeFr={v => setData(p => ({ ...p, description: { ...p.description, fr: v } }))}
            onChangeEn={v => setData(p => ({ ...p, description: { ...p.description, en: v } }))}
          />

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-cifm-blue-600 hover:bg-cifm-blue-500 rounded-lg transition-colors disabled:opacity-50">
              {saved ? (
                <><CheckCircle className="w-4 h-4" /> Enregistré</>
              ) : saving ? (
                'Enregistrement...'
              ) : (
                <><Save className="w-4 h-4" /> Enregistrer</>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
