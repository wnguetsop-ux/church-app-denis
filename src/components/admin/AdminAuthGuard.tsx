'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/use-auth'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { LogIn, Loader2, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: Props) {
  const { user, loading, isAuthenticated, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-cifm-blue-600 mx-auto" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isFirebaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <AlertCircle size={40} className="text-amber-500 mx-auto" />
          <h2 className="font-lora text-lg font-semibold text-gray-900">Mode D&eacute;mo</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Firebase n&apos;est pas configur&eacute;. Les donn&eacute;es ne seront pas sauvegard&eacute;es.
            Pour activer, ajoutez les variables d&apos;environnement Firebase.
          </p>
          <DemoModeWrapper>{children}</DemoModeWrapper>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={signIn} />
  }

  return (
    <AuthenticatedWrapper user={user} onSignOut={signOut}>
      {children}
    </AuthenticatedWrapper>
  )
}

function DemoModeWrapper({ children }: { children: React.ReactNode }) {
  const [showDemo, setShowDemo] = useState(false)
  if (!showDemo) {
    return (
      <button
        onClick={() => setShowDemo(true)}
        className="bg-amber-500 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-amber-400 transition-colors"
      >
        Continuer en mode d&eacute;mo
      </button>
    )
  }
  return <>{children}</>
}

function AuthenticatedWrapper({ user, onSignOut, children }: {
  user: { email?: string | null; displayName?: string | null } | null
  onSignOut: () => void
  children: React.ReactNode
}) {
  return <>{children}</>
}

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<unknown> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.')
      return
    }
    setSubmitting(true)
    try {
      await onLogin(email.trim(), password)
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Email ou mot de passe incorrect.')
      } else if (code === 'auth/too-many-requests') {
        setError('Trop de tentatives. R\u00E9essayez dans quelques minutes.')
      } else {
        setError('Erreur de connexion. V\u00E9rifiez vos identifiants.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cifm-blue-700 via-cifm-blue-800 to-cifm-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-6">
        {/* Logo + Title */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-xl bg-cifm-blue-50 flex items-center justify-center">
            <Image src="/images/logo/logo-cifm4.png" alt="CIFM4" width={40} height={40} className="rounded-lg" />
          </div>
          <div>
            <h1 className="font-lora text-xl font-semibold text-gray-900">Administration CIFM4</h1>
            <p className="text-sm text-gray-500 mt-1">Connectez-vous pour g&eacute;rer le contenu</p>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@cifm4.org"
              className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400 transition-colors"
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                className="w-full h-11 bg-gray-50 border border-gray-200 rounded-xl px-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30 focus:border-cifm-blue-400 transition-colors"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 bg-cifm-blue-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-cifm-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <LogIn size={18} />
                Se connecter
              </>
            )}
          </button>
        </form>

        {/* Security note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <Shield size={12} />
          Connexion s&eacute;curis&eacute;e Firebase Auth
        </div>
      </div>
    </div>
  )
}
