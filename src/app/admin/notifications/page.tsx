'use client'

import { useState } from 'react'
import { BellRing, Send, Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { BilingualInput, Field, FormActions } from '@/components/admin/AdminFormFields'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { createDoc } from '@/lib/firebase/services/admin-crud'

export default function AdminNotifications() {
  const [title, setTitle] = useState({ fr: '', en: '' })
  const [body, setBody] = useState({ fr: '', en: '' })
  const [audience, setAudience] = useState<'all' | 'subscribers'>('all')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.fr.trim() || !body.fr.trim()) {
      setError('Le titre et le corps sont requis (au moins en fran\u00E7ais).')
      return
    }

    if (!isFirebaseConfigured) {
      setError('Firebase non configur\u00E9. Notifications indisponibles en mode d\u00E9mo.')
      return
    }

    setSending(true)
    try {
      // Save notification to Firestore for record-keeping
      await createDoc('notifications', {
        title,
        body,
        audience,
        sentAt: new Date().toISOString(),
        status: 'sent',
      })

      setSent(true)
      setTitle({ fr: '', en: '' })
      setBody({ fr: '', en: '' })

      // Reset success message after 5s
      setTimeout(() => setSent(false), 5000)
    } catch (err) {
      console.error('Notification error:', err)
      setError('Erreur lors de l\'envoi. V\u00E9rifiez la configuration Firebase.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
          <BellRing className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h1 className="font-lora text-xl font-semibold text-gray-900">Notifications Push</h1>
          <p className="text-sm text-gray-500">Envoyer des notifications aux abonn&eacute;s de l&apos;app</p>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 space-y-1">
          <p className="font-medium">Comment fonctionnent les notifications ?</p>
          <ul className="text-xs space-y-0.5 text-blue-700">
            <li>&bull; Les notifications sont envoy&eacute;es via Firebase Cloud Messaging (FCM)</li>
            <li>&bull; Les visiteurs doivent autoriser les notifications dans leur navigateur</li>
            <li>&bull; Le message est envoy&eacute; en fran&ccedil;ais et en anglais (selon la langue du visiteur)</li>
            <li>&bull; L&apos;envoi est irr&eacute;versible &mdash; v&eacute;rifiez bien avant d&apos;envoyer</li>
          </ul>
        </div>
      </div>

      {/* Success message */}
      {sent && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle size={18} className="text-green-600" />
          <p className="text-sm text-green-800 font-medium">
            Notification enregistr&eacute;e avec succ&egrave;s !
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSend} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <BilingualInput
          label="Titre de la notification"
          required
          valueFr={title.fr}
          valueEn={title.en}
          onChangeFr={v => setTitle(p => ({ ...p, fr: v }))}
          onChangeEn={v => setTitle(p => ({ ...p, en: v }))}
        />

        <BilingualInput
          label="Corps du message"
          required
          valueFr={body.fr}
          valueEn={body.en}
          onChangeFr={v => setBody(p => ({ ...p, fr: v }))}
          onChangeEn={v => setBody(p => ({ ...p, en: v }))}
          multiline
          rows={3}
        />

        <Field label="Audience">
          <div className="flex gap-3">
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
              audience === 'all' ? 'border-cifm-blue-400 bg-cifm-blue-50 text-cifm-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
              <input type="radio" name="audience" value="all" checked={audience === 'all'} onChange={() => setAudience('all')} className="sr-only" />
              <span className="text-sm font-medium">Tous les abonn&eacute;s</span>
            </label>
            <label className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
              audience === 'subscribers' ? 'border-cifm-blue-400 bg-cifm-blue-50 text-cifm-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
              <input type="radio" name="audience" value="subscribers" checked={audience === 'subscribers'} onChange={() => setAudience('subscribers')} className="sr-only" />
              <span className="text-sm font-medium">Membres actifs</span>
            </label>
          </div>
        </Field>

        {/* Preview */}
        {(title.fr || body.fr) && (
          <div className="border border-gray-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Aper&ccedil;u</p>
            <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cifm-blue-600 flex items-center justify-center shrink-0">
                <BellRing size={14} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{title.fr || 'Titre...'}</p>
                <p className="text-gray-600 text-xs mt-0.5">{body.fr || 'Corps du message...'}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={sending || !title.fr.trim() || !body.fr.trim()}
          className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white rounded-lg py-3 font-semibold text-sm hover:bg-amber-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Send size={18} />
              Envoyer la notification
            </>
          )}
        </button>
      </form>

      {/* Notification history */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 text-sm mb-3">Historique des notifications</h2>
        <p className="text-xs text-gray-400">
          Les notifications envoy&eacute;es seront list&eacute;es ici une fois connect&eacute; &agrave; Firebase.
        </p>
      </div>
    </div>
  )
}
