'use client'

import { useMemo, useRef, useState } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { Mic, Square, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getStorageInstance, isFirebaseConfigured } from '@/lib/firebase/client'

interface Props {
  storagePath: string
  onUpload: (payload: { url: string; duration: string }) => void
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.round(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function pickMimeType(): string {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus']
  for (const candidate of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(candidate)) return candidate
  }
  return ''
}

export default function AudioRecorderUpload({ storagePath, onUpload }: Props) {
  const [recording, setRecording] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startedAtRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)
  const mimeType = useMemo(() => pickMimeType(), [])

  async function startRecording() {
    setError('')
    setSuccess('')

    if (!isFirebaseConfigured) {
      setError('Firebase Storage n’est pas configuré.')
      return
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('L’enregistrement micro n’est pas supporté sur cet appareil.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      chunksRef.current = []
      startedAtRef.current = Date.now()

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null

        const durationSeconds = Math.max(1, (Date.now() - startedAtRef.current) / 1000)
        const extension = recorder.mimeType.includes('mp4') ? 'm4a' : recorder.mimeType.includes('ogg') ? 'ogg' : 'webm'
        const fileName = `${Date.now()}-podcast.${extension}`

        setUploading(true)
        try {
          const storageRef = ref(getStorageInstance(), `${storagePath}/${fileName}`)
          const uploadTask = uploadBytesResumable(storageRef, blob)

          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed', undefined, reject, resolve)
          })

          const url = await getDownloadURL(uploadTask.snapshot.ref)
          const duration = formatDuration(durationSeconds)
          onUpload({ url, duration })
          setSuccess('Enregistrement envoyé avec succès.')
        } catch (uploadError) {
          console.error('Audio upload error:', uploadError)
          setError('Impossible d’envoyer l’enregistrement.')
        } finally {
          setUploading(false)
        }
      }

      recorder.start()
      setRecording(true)
    } catch (err) {
      console.error('Audio recording error:', err)
      setError('Micro refusé ou indisponible.')
    }
  }

  function stopRecording() {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return
    mediaRecorderRef.current.stop()
    setRecording(false)
  }

  return (
    <div className="space-y-2 rounded-xl border border-dashed border-purple-200 bg-purple-50/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Enregistrer depuis le micro</p>
          <p className="text-xs text-gray-500">Pratique sur téléphone pour publier un podcast directement.</p>
        </div>
        {recording ? (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-500"
          >
            <Square size={14} />
            Arrêter
          </button>
        ) : (
          <button
            type="button"
            onClick={startRecording}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Mic size={14} />}
            {uploading ? 'Envoi...' : 'Enregistrer'}
          </button>
        )}
      </div>

      {recording && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Enregistrement en cours...
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-xs text-green-700">
          <CheckCircle2 size={14} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  )
}
