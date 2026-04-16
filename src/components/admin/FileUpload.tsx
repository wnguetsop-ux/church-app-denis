'use client'

import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { getStorageInstance } from '@/lib/firebase/client'
import { isFirebaseConfigured } from '@/lib/firebase/client'
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react'

interface FileUploadProps {
  /** Firebase Storage path prefix, e.g. "gallery", "sermons/thumbnails" */
  storagePath: string
  /** Callback with the download URL after successful upload */
  onUpload: (url: string) => void
  /** Current value (URL) — shown as preview */
  value?: string
  /** Accept file types, default image/* */
  accept?: string
  /** Max file size in MB, default 5 */
  maxSizeMB?: number
  /** Label */
  label?: string
  /** Allow entering URL directly instead of uploading */
  allowUrl?: boolean
  /** Hint text */
  hint?: string
}

export default function FileUpload({
  storagePath,
  onUpload,
  value,
  accept = 'image/*',
  maxSizeMB = 5,
  label,
  allowUrl = true,
  hint,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setError('')

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Fichier trop volumineux (max ${maxSizeMB} MB)`)
      return
    }

    if (!isFirebaseConfigured) {
      setError('Firebase Storage non configur\u00E9. Utilisez une URL directe.')
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const storageRef = ref(getStorageInstance(), `${storagePath}/${fileName}`)

      const uploadTask = uploadBytesResumable(storageRef, file)

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            setProgress(pct)
          },
          (err) => reject(err),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            onUpload(url)
            resolve()
          }
        )
      })
    } catch (err) {
      console.error('Upload error:', err)
      setError('Erreur d\'upload. V\u00E9rifiez les r\u00E8gles Firebase Storage.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return
    onUpload(urlInput.trim())
    setUrlInput('')
  }

  function handleRemove() {
    onUpload('')
    setUrlInput('')
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Current preview */}
      {value && (
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 border-2 border-cifm-blue-200">
            {accept.startsWith('image') ? (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 p-2 text-center break-all">
                {value.split('/').pop()?.slice(0, 20)}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Mode toggle */}
      {allowUrl && !value && (
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5 w-fit">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
              mode === 'upload' ? 'bg-white text-cifm-blue-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Upload size={12} /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-md transition-colors ${
              mode === 'url' ? 'bg-white text-cifm-blue-600 shadow-sm font-medium' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LinkIcon size={12} /> URL
          </button>
        </div>
      )}

      {/* Upload zone */}
      {!value && mode === 'upload' && (
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            uploading
              ? 'border-cifm-blue-400 bg-cifm-blue-50'
              : 'border-gray-200 hover:border-cifm-blue-300 hover:bg-gray-50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />

          {uploading ? (
            <div className="space-y-2">
              <Loader2 size={24} className="animate-spin text-cifm-blue-600 mx-auto" />
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-cifm-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-cifm-blue-600">{progress}%</p>
            </div>
          ) : (
            <>
              <ImageIcon size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Glisser-d&eacute;poser ou <span className="text-cifm-blue-600 font-medium">parcourir</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Max {maxSizeMB} MB</p>
            </>
          )}
        </div>
      )}

      {/* URL input */}
      {!value && mode === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 h-10 bg-gray-50 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-cifm-blue-400/30"
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="h-10 px-4 bg-cifm-blue-600 text-white rounded-lg text-sm font-medium hover:bg-cifm-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
