import { ImageIcon } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminGalerie() {
  return (
    <AdminPageShell
      title="Galerie"
      description="Photos et vidéos courtes de la communauté"
      icon={ImageIcon}
      collection="gallery"
      fields={['type', 'url', 'thumbnailUrl', 'caption.fr', 'caption.en', 'album', 'order', 'duration']}
    />
  )
}
