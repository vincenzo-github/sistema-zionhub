'use client'

import { Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { AttendanceRecord } from '@/types/checkin'

interface AttendanceListProps {
  attendees: AttendanceRecord[]
  isLoading?: boolean
  eventName?: string
}

function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatDuration(minutes: number | null | undefined): string {
  if (!minutes) return '-'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function AttendanceList({
  attendees,
  isLoading = false,
  eventName,
}: AttendanceListProps) {
  const checkedIn = attendees.filter(a => a.status === 'checked_in').length
  const checkedOut = attendees.filter(a => a.status === 'checked_out').length
  const totalAttendees = attendees.length

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse space-y-4 w-full">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Presença</h3>
            {eventName && (
              <p className="text-sm text-gray-500 mt-1">{eventName}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{totalAttendees}</div>
            <p className="text-xs text-blue-600 mt-1">Total inscrito</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">{checkedIn}</div>
            <p className="text-xs text-green-600 mt-1">Check-in</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">{checkedOut}</div>
            <p className="text-xs text-purple-600 mt-1">Check-out</p>
          </div>
        </div>
      </div>

      {/* List */}
      {totalAttendees === 0 ? (
        <div className="p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum voluntário registrado ainda</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Voluntário
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Check-in
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Check-out
                </th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-700 uppercase">
                  Duração
                </th>
              </tr>
            </thead>
            <tbody>
              {attendees.map(attendee => (
                <tr
                  key={attendee.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{attendee.full_name}</p>
                      <p className="text-xs text-gray-500">{attendee.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {attendee.status === 'checked_in' && (
                        <>
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Presente
                          </span>
                        </>
                      )}
                      {attendee.status === 'checked_out' && (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Saída registrada
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600 font-mono">
                      {formatTime(attendee.check_in_time)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-gray-600 font-mono">
                      {formatTime(attendee.check_out_time)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {formatDuration(attendee.duration_minutes)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
