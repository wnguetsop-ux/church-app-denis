import { BookOpen } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminEnseignements() {
  return (
    <AdminPageShell
      title="Enseignements"
      description="Textes bibliques et audios d'enseignement"
      icon={BookOpen}
      collection="teachings"
      fields={['type', 'title.fr', 'title.en', 'body.fr', 'body.en', 'audioUrl', 'audioDuration', 'tags', 'publishedAt']}
    />
  )
}
