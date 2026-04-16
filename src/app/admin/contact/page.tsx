'use client'

import { useState, useEffect } from 'react'
import { Phone, Save, CheckCircle } from 'lucide-react'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { getDocById, updateDocById, createDoc } from '@/lib/firebase/services/admin-crud'
import { BilingualInput, Field, Input } from '@/components/admin/AdminFormFields'

interface ContactData {
  phone: string
  email: string
  address: string
  youtube: string
  tiktok: string
  facebook: string
  schedules: { fr: string; en: string }
}

const EMPTY: ContactData = {
  phone: '',
  email: 'sonsofmalachie4@gmail.com',
  address: '',
  youtube: '',
  tiktok: '',
  facebook: '',
  schedules: { fr: '', en: '' },
}

export default function AdminContact() {
  const [data, setData] = useState<ContactData>(EMPTY)
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
            phone: doc.phone || '',
            email: doc.email || '',
            address: doc.address || '',
            youtube: doc.youtube || '',
            tiktok: doc.tiktok || '',
            facebook: doc.facebook || '',
            schedules: doc.schedules || { fr: '', en: '' },
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
          <Phone className="w-5 h-5 text-cifm-blue-600" />
        </div>
        <div>
          <h1 className="font-lora text-xl font-semibold text-gray-900">Contact</h1>
          <p className="text-sm text-gray-500">Informations de contact et réseaux sociaux</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded" />)}
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Téléphone">
              <Input value={data.phone} onChange={v => setData(p => ({ ...p, phone: v }))} placeholder="+237 6XX XXX XXX" />
            </Field>
            <Field label="Email">
              <Input type="email" value={data.email} onChange={v => setData(p => ({ ...p, email: v }))} placeholder="contact@cifm4.com" />
            </Field>
          </div>

          <Field label="Adresse">
            <Input value={data.address} onChange={v => setData(p => ({ ...p, address: v }))} placeholder="Ville, Pays" />
          </Field>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Réseaux sociaux</p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="YouTube" hint="URL complète">
                <Input value={data.youtube} onChange={v => setData(p => ({ ...p, youtube: v }))} placeholder="https://youtube.com/@..." />
              </Field>
              <Field label="TikTok" hint="URL complète">
                <Input value={data.tiktok} onChange={v => setData(p => ({ ...p, tiktok: v }))} placeholder="https://tiktok.com/@..." />
              </Field>
              <Field label="Facebook" hint="URL complète">
                <Input value={data.facebook} onChange={v => setData(p => ({ ...p, facebook: v }))} placeholder="https://facebook.com/..." />
              </Field>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <BilingualInput label="Horaires / Programme" multiline rows={3}
              valueFr={data.schedules.fr} valueEn={data.schedules.en}
              onChangeFr={v => setData(p => ({ ...p, schedules: { ...p.schedules, fr: v } }))}
              onChangeEn={v => setData(p => ({ ...p, schedules: { ...p.schedules, en: v } }))}
            />
          </div>

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
