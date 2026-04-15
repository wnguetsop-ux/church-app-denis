import { HandHeart } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminPrieres() {
  return (
    <AdminPageShell
      title="Prières reçues"
      description="Demandes de prière soumises par les fidèles"
      icon={HandHeart}
      collection="prayers"
      fields={['name', 'subject', 'request', 'contact', 'isPublic', 'language', 'status', 'prayedForCount', 'createdAt']}
    />
  )
}
