import { Video } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminMessages() {
  return (
    <AdminPageShell
      title="Messages / Sermons"
      description="Vidéos YouTube de prédications et sermons"
      icon={Video}
      collection="sermons"
      fields={['title.fr', 'title.en', 'youtubeVideoId', 'speaker', 'series', 'tags', 'publishedAt', 'featured']}
    />
  )
}
