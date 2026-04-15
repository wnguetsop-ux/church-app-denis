import { Church } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminAPropos() {
  return (
    <AdminPageShell
      title="À propos / Église"
      description="Mission, histoire, équipe et confession de foi"
      icon={Church}
      collection="churchInfo"
      fields={['name.fr', 'name.en', 'tagline.fr', 'tagline.en', 'description.fr', 'description.en', 'history.fr', 'history.en', 'beliefs.fr']}
    />
  )
}
