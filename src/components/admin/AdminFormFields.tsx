'use client'

import type { ReactNode } from 'react'

/* ── Label + Input wrapper ── */
interface FieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: string
}

export function Field({ label, required, children, hint }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

/* ── Text input ── */
interface InputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}

export function Input({ value, onChange, placeholder, type = 'text', disabled }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                 focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                 outline-none transition-all disabled:opacity-50"
    />
  )
}

/* ── Textarea ── */
interface TextareaProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
}

export function Textarea({ value, onChange, placeholder, rows = 3 }: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none
                 focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                 outline-none transition-all"
    />
  )
}

/* ── Bilingual input (FR + EN side by side) ── */
interface BilingualInputProps {
  label: string
  valueFr: string
  valueEn: string
  onChangeFr: (v: string) => void
  onChangeEn: (v: string) => void
  required?: boolean
  multiline?: boolean
  rows?: number
}

export function BilingualInput({ label, valueFr, valueEn, onChangeFr, onChangeEn, required, multiline, rows = 3 }: BilingualInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">🇫🇷 Français</span>
          {multiline ? (
            <Textarea value={valueFr} onChange={onChangeFr} placeholder="Texte en français..." rows={rows} />
          ) : (
            <Input value={valueFr} onChange={onChangeFr} placeholder="Texte en français..." />
          )}
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">🇬🇧 English</span>
          {multiline ? (
            <Textarea value={valueEn} onChange={onChangeEn} placeholder="Text in English..." rows={rows} />
          ) : (
            <Input value={valueEn} onChange={onChangeEn} placeholder="Text in English..." />
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Select ── */
interface SelectProps {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm
                 focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                 outline-none transition-all"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

/* ── Toggle ── */
interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-cifm-blue-500 transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm
                        peer-checked:translate-x-4 transition-transform" />
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </label>
  )
}

/* ── Tags input ── */
interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}

export function TagsInput({ value, onChange, placeholder = 'Ajouter un tag...' }: TagsInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const input = e.currentTarget
      const tag = input.value.trim()
      if (tag && !value.includes(tag)) {
        onChange([...value, tag])
      }
      input.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {value.map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 bg-cifm-blue-50 text-cifm-blue-700 rounded-md px-2 py-0.5 text-xs">
            {tag}
            <button type="button" onClick={() => onChange(value.filter(t => t !== tag))} className="hover:text-red-500">×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm
                   focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400
                   outline-none transition-all"
      />
    </div>
  )
}

/* ── Submit / Cancel buttons ── */
interface FormActionsProps {
  onCancel: () => void
  saving: boolean
  submitLabel?: string
}

export function FormActions({ onCancel, saving, submitLabel = 'Enregistrer' }: FormActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 text-sm font-medium text-white bg-cifm-blue-600 hover:bg-cifm-blue-500 rounded-lg transition-colors disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : submitLabel}
      </button>
    </div>
  )
}

/* ── Delete confirmation ── */
interface DeleteConfirmProps {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}

export function DeleteConfirm({ itemName, onConfirm, onCancel, deleting }: DeleteConfirmProps) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
        <span className="text-2xl">🗑️</span>
      </div>
      <div>
        <p className="font-medium text-gray-900">Supprimer cet élément ?</p>
        <p className="text-sm text-gray-500 mt-1">« {itemName} »</p>
        <p className="text-xs text-red-500 mt-2">Cette action est irréversible.</p>
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? 'Suppression...' : 'Supprimer'}
        </button>
      </div>
    </div>
  )
}
