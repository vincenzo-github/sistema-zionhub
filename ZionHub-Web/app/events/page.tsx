import { redirect } from 'next/navigation'

export default function EventsPage() {
  // Redirecionar para a nova rota de eventos
  redirect('/dashboard/eventos')
}
