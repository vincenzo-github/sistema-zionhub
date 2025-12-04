import { EventForm } from '@/components/eventos/EventForm'

export default function NovoEventoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
        <p className="text-gray-600">
          Preencha as informações abaixo para criar um novo evento
        </p>
      </div>

      {/* Form */}
      <EventForm />
    </div>
  )
}
