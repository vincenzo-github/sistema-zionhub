'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { QRCodeDisplay } from '@/components/checkin/QRCodeDisplay'
import { QRCodeScanner } from '@/components/checkin/QRCodeScanner'
import { AttendanceList } from '@/components/checkin/AttendanceList'
import { useEventQRCode } from '@/hooks/useEventQRCode'
import { useCheckin } from '@/hooks/useCheckin'
import { useAttendance } from '@/hooks/useAttendance'
import { toast } from '@/lib/toast'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type TabType = 'qrcode' | 'scanner' | 'attendance'

export default function CheckinPage() {
  const params = useParams()
  const eventId = params.id as string
  const [activeTab, setActiveTab] = useState<TabType>('qrcode')

  // QR Code
  const { qrCode, isLoading: qrLoading } = useEventQRCode(eventId)

  // Check-in functionality
  const { checkIn, isLoading: isCheckinLoading } = useCheckin()

  // Attendance
  const { attendees, isLoading: attendanceLoading } = useAttendance(eventId)

  const handleQRScan = async (qrData: string) => {
    try {
      await checkIn({
        event_id: eventId,
        qrcode_data: qrData,
      })

      toast.success('Check-in realizado com sucesso!')
      setActiveTab('attendance')

      // The attendance list will auto-refresh through the useAttendance hook
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao processar check-in'
      toast.error(errorMsg)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/events" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Check-in / Check-out</h1>
          </div>
          <p className="text-gray-500 mt-2">Gerencie a presença dos voluntários no evento</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('qrcode')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'qrcode'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          QR Code
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'scanner'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Escanear
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'attendance'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Presença
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* QR Code Tab */}
        {activeTab === 'qrcode' && (
          <>
            {qrCode ? (
              <QRCodeDisplay
                eventId={eventId}
                eventName={qrCode.event_name || 'Evento'}
                qrCodeUrl={qrCode.qrcode_url}
                isLoading={qrLoading}
              />
            ) : qrLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-center h-80">
                  <div className="animate-pulse space-y-4 w-full max-w-sm">
                    <div className="h-64 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 text-center">
                <p className="text-red-600">Erro ao carregar QR Code</p>
              </div>
            )}

            <Button
              onClick={() => setActiveTab('scanner')}
              className="w-full"
            >
              Iniciar Escaneamento
            </Button>
          </>
        )}

        {/* Scanner Tab */}
        {activeTab === 'scanner' && (
          <>
            <QRCodeScanner
              onScan={handleQRScan}
              isProcessing={isCheckinLoading}
              onClose={() => setActiveTab('qrcode')}
            />

            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-900 mb-2">💡 Como usar:</p>
              <ul className="space-y-1 text-blue-800 text-xs list-disc list-inside">
                <li>Abra a câmera do seu navegador</li>
                <li>Aponte para o QR Code do evento</li>
                <li>O sistema registrará o check-in automaticamente</li>
              </ul>
            </div>
          </>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <>
            <AttendanceList
              attendees={attendees}
              isLoading={attendanceLoading}
              eventName={qrCode?.event_name}
            />

            {!attendanceLoading && attendees.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setActiveTab('scanner')}
                >
                  Continuar Escaneando
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Info Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-900">
          <span className="font-semibold">Nota:</span> O QR Code permanece válido por 24 horas.
          A lista de presença atualiza automaticamente a cada 10 segundos.
        </p>
      </div>
    </div>
  )
}
