import { Calendar } from 'lucide-react'
import AdminPageShell from '@/components/admin/AdminPageShell'

export default function AdminEvenements() {
  return (
    <AdminPageShell
      title="Événements"
      description="Agenda, lieux, dates et inscriptions"
      icon={Calendar}
      collection="events"
      fields={['title.fr', 'title.en', 'description.fr', 'description.en', 'location.fr', 'startAt', 'endAt', 'imageUrl', 'registrationRequired']}
    />
  )
}
