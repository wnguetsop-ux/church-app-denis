'use client'

import { useState } from 'react'
import { Heart, Pencil, Trash2, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { useAdminCrud } from '@/lib/hooks/use-admin-crud'
import AdminModal from '@/components/admin/AdminModal'
import { BilingualInput, Field, Input, FormActions, DeleteConfirm, Select, Toggle } from '@/components/admin/AdminFormFields'
import type { DonationMethod } from '@/types'

const METHOD_LABELS: Record<string, string> = {
  orange_money: 'Orange Money',
  mtn_money: 'MTN Mobile Money',
  paypal: 'PayPal',
  bank_transfer: 'Virement bancaire',
}

const EMPTY: Partial<DonationMethod> = {
  method: 'orange_money',
  label: { fr: '', en: '' },
  instructions: { fr: '', en: '' },
  contact: '',
  isActive: true,
  order: 0,
}

export default function AdminDons() {
  const { items, isLoading, create, update, remove, saving, deleting } = useAdminCrud<DonationMethod>({
    collection: 'donationMethods',
    orderField: 'order',
    orderDirection: 'asc',
  })

  const [modal, setModal] = useState<'create' | 'edit' | 'delete' | null>(null)
  const [current, setCurrent] = useState<Partial<DonationMethod>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)

  function openCreate() {
    setCurrent({ ...EMPTY, label: { fr: '', en: '' }, instructions: { fr: '', en: '' } })
    setEditId(null)
    setModal('create')
  }

  function openEdit(d: DonationMethod) {
    setCurrent({ ...d })
    setEditId(d.id)
    setModal('edit')
  }

  function openDelete(d: DonationMethod) {
    setCurrent(d)
    setEditId(d.id)
    setModal('delete')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const data = {
      method: current.method || 'orange_money',
      label: current.label || { fr: '', en: '' },
      instructions: current.instructions || { fr: '', en: '' },
      contact: current.contact || '',
      isActive: current.isActive ?? true,
      order: Number(current.order) || 0,
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

  async function toggleActive(d: DonationMethod) {
    await update(d.id, { isActive: !d.isActive })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-cifm-blue-600" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Dons</h1>
            <p className="text-sm text-gray-500">Méthodes de don affichées publiquement</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-cifm-blue-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-cifm-blue-500 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Aucune méthode de don.</p>
          <button onClick={openCreate} className="text-cifm-blue-600 text-sm font-medium mt-2 hover:underline">Ajouter la première</button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(d => (
            <div key={d.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 transition-colors ${d.isActive ? 'border-gray-200 hover:border-cifm-blue-200' : 'border-gray-100 opacity-60'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold bg-gray-100 text-gray-600 rounded px-1.5 py-0.5">
                    {METHOD_LABELS[d.method] || d.method}
                  </span>
                  <h3 className="font-medium text-gray-900 text-sm truncate">
                    {typeof d.label === 'string' ? d.label : d.label.fr}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{d.contact}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {typeof d.instructions === 'string' ? d.instructions : d.instructions.fr}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(d)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={d.isActive ? 'Désactiver' : 'Activer'}>
                  {d.isActive ? <ToggleRight className="w-5 h-5 text-green-500" /> : <ToggleLeft className="w-5 h-5 text-gray-300" />}
                </button>
                <button onClick={() => openEdit(d)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-gray-400" /></button>
                <button onClick={() => openDelete(d)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Modifier la méthode' : 'Nouvelle méthode de don'} wide>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Méthode" required>
              <Select value={current.method || 'orange_money'} onChange={v => setCurrent(p => ({ ...p, method: v as DonationMethod['method'] }))}
                options={Object.entries(METHOD_LABELS).map(([value, label]) => ({ value, label }))} />
            </Field>
            <Field label="Contact" required hint="Numéro ou email">
              <Input value={current.contact ?? ''} onChange={v => setCurrent(p => ({ ...p, contact: v }))} placeholder="+237 6XX XXX XXX" />
            </Field>
          </div>

          <BilingualInput label="Libellé" required
            valueFr={current.label?.fr ?? ''} valueEn={current.label?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, label: { ...p.label!, fr: v, en: p.label?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, label: { ...p.label!, fr: p.label?.fr ?? '', en: v } }))}
          />

          <BilingualInput label="Instructions" multiline rows={3}
            valueFr={current.instructions?.fr ?? ''} valueEn={current.instructions?.en ?? ''}
            onChangeFr={v => setCurrent(p => ({ ...p, instructions: { ...p.instructions!, fr: v, en: p.instructions?.en ?? '' } }))}
            onChangeEn={v => setCurrent(p => ({ ...p, instructions: { ...p.instructions!, fr: p.instructions?.fr ?? '', en: v } }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ordre d'affichage">
              <Input type="number" value={String(current.order ?? 0)} onChange={v => setCurrent(p => ({ ...p, order: Number(v) }))} />
            </Field>
            <div className="pt-6">
              <Toggle label="Actif (visible publiquement)" checked={current.isActive ?? true}
                onChange={v => setCurrent(p => ({ ...p, isActive: v }))} />
            </div>
          </div>

          <FormActions onCancel={() => setModal(null)} saving={saving} />
        </form>
      </AdminModal>

      <AdminModal open={modal === 'delete'} onClose={() => setModal(null)} title="Confirmer la suppression">
        <DeleteConfirm itemName={typeof current.label === 'string' ? current.label : current.label?.fr ?? ''}
          onConfirm={handleDelete} onCancel={() => setModal(null)} deleting={deleting} />
      </AdminModal>
    </div>
  )
}
