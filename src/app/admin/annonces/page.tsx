import { Megaphone } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminAnnonces() {
  return (
    <AdminPageShell
      title="Annonces"
      description="Actualités et informations de la communauté"
      icon={Megaphone}
      collection="announcements"
      fields={['title.fr', 'title.en', 'body.fr', 'body.en', 'imageUrl', 'priority', 'publishedAt', 'expiresAt']}
    />
  )
}
