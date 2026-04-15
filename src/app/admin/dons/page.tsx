import { Heart } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminDons() {
  return (
    <AdminPageShell
      title="Dons"
      description="Méthodes de don et coordonnées affichées publiquement"
      icon={Heart}
      collection="donationMethods"
      fields={['method', 'label.fr', 'label.en', 'instructions.fr', 'instructions.en', 'contact', 'isActive', 'order']}
    />
  )
}
