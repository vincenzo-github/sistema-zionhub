'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateEventInput } from '@/types/event'

interface EventFormProps {
  initialData?: Partial<CreateEventInput>
  isEdit?: boolean
}

export function EventForm({ initialData, isEdit = false }: EventFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateEventInput>({
    name: initialData?.name || '',
    type: initialData?.type || 'culto',
    date: initialData?.date || '',
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    ministry_id: initialData?.ministry_id || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Criar/Atualizar evento:', formData)

      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar para lista
      router.push('/dashboard/eventos')
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof CreateEventInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome do Evento */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Evento *</Label>
            <Input
              id="name"
              placeholder="Ex: Culto de Domingo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Tipo e Ministério */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento *</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="culto">Culto</option>
                <option value="ensaio">Ensaio</option>
                <option value="reuniao">Reunião</option>
                <option value="evento_especial">Evento Especial</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ministry">Ministério</Label>
              <select
                id="ministry"
                value={formData.ministry_id}
                onChange={(e) => handleChange('ministry_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Selecione...</option>
                <option value="louvor">Louvor</option>
                <option value="tecnica">Técnica</option>
                <option value="recepcao">Recepção</option>
                <option value="kids">Kids</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data e Horário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Horários */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora de Início *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <Input
                  id="start_time"
                  type="time"
                  className="pl-10"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Hora de Término *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
                <Input
                  id="end_time"
                  type="time"
                  className="pl-10"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Local e Descrição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Local */}
          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <Input
                id="location"
                placeholder="Ex: Templo Principal"
                className="pl-10"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
              <Textarea
                id="description"
                placeholder="Adicione detalhes sobre o evento..."
                className="min-h-[120px] pl-10"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && '⏳ '}
          {isEdit ? 'Salvar Alterações' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  )
}
