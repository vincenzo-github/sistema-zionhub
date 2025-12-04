'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Volunteer } from '@/types/volunteer'
import { useVolunteers } from '@/hooks/useVolunteers'

export default function VoluntarioDetalhePage() {
  const params = useParams()
  const volunteerId = params.id as string
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getVolunteer } = useVolunteers({
    autoFetch: false,
  })

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const data = await getVolunteer(volunteerId)
        setVolunteer(data || null)
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar voluntário')
      } finally {
        setLoading(false)
      }
    }

    fetchVolunteer()
  }, [volunteerId, getVolunteer])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/voluntarios" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <Card className="p-12 text-center">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Carregando voluntário...</p>
        </Card>
      </div>
    )
  }

  if (error || !volunteer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/voluntarios" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <Card className="border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Erro ao carregar voluntário</h3>
          <p className="mb-4 text-red-700">{error || 'Voluntário não encontrado'}</p>
        </Card>
      </div>
    )
  }

  const statusConfig: Record<string, { label: string; color: string }> = {
    active: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
    suspended: { label: 'Suspenso', color: 'bg-red-100 text-red-800' },
  }

  const availabilityConfig: Record<string, { label: string; color: string }> = {
    available: { label: 'Disponível', color: 'bg-green-100 text-green-800' },
    unavailable: { label: 'Indisponível', color: 'bg-gray-100 text-gray-800' },
    limited: { label: 'Limitado', color: 'bg-yellow-100 text-yellow-800' },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/voluntarios" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>
        <Link href={`/dashboard/voluntarios/${volunteer.id}/editar`}>
          <Button variant="outline">Editar</Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">{volunteer.full_name}</h1>
            {volunteer.position && <p className="text-lg text-gray-600 mt-1">{volunteer.position}</p>}
          </div>
          <div className="flex gap-2">
            <Badge className={statusConfig[volunteer.status].color}>
              {statusConfig[volunteer.status].label}
            </Badge>
            <Badge className={availabilityConfig[volunteer.availability].color}>
              {availabilityConfig[volunteer.availability].label}
            </Badge>
          </div>
        </div>
        {volunteer.bio && <p className="mt-4 text-gray-700">{volunteer.bio}</p>}
      </Card>

      {/* Contact Info */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações de Contato</h2>
          <div className="space-y-3">
            {volunteer.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{volunteer.email}</span>
              </div>
            )}
            {volunteer.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{volunteer.phone}</span>
              </div>
            )}
            {volunteer.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <span>{volunteer.whatsapp}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold">{volunteer.total_events}</p>
          <p className="text-gray-600">Eventos</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold">{volunteer.total_hours}h</p>
          <p className="text-gray-600">Horas</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold">{volunteer.attendance_rate}%</p>
          <p className="text-gray-600">Presença</p>
        </Card>
      </div>

      {/* Skills & Ministries */}
      {volunteer.skills && volunteer.skills.length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Habilidades</h2>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {volunteer.ministries && volunteer.ministries.length > 0 && (
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ministérios</h2>
            <div className="flex flex-wrap gap-2">
              {volunteer.ministries.map((ministry) => (
                <Badge key={ministry} variant="secondary" className="bg-primary-100 text-primary-800">
                  {ministry}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
