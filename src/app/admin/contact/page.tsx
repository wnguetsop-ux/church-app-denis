import { Phone } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminContact() {
  return (
    <AdminPageShell
      title="Contact"
      description="Informations de contact et réseaux sociaux"
      icon={Phone}
      collection="churchInfo"
      fields={['phone', 'email', 'address', 'facebook', 'youtube', 'tiktok', 'schedules.fr', 'schedules.en']}
    />
  )
}
