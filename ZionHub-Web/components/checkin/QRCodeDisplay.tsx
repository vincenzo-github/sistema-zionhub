'use client'

import { useState } from 'react'
import { Download, Share2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'

interface QRCodeDisplayProps {
  eventId: string
  eventName: string
  qrCodeUrl: string
  isLoading?: boolean
}

export function QRCodeDisplay({
  eventId,
  eventName,
  qrCodeUrl,
  isLoading = false,
}: QRCodeDisplayProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `qrcode-${eventId}-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('QR Code baixado com sucesso!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Erro ao baixar QR Code')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `QR Code - ${eventName}`,
          text: `Escaneie este QR Code para marcar presença no evento: ${eventName}`,
          url: qrCodeUrl,
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(qrCodeUrl)
        toast.success('Link copiado para a área de transferência!')
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') return
      console.error('Share error:', error)
      toast.error('Erro ao compartilhar')
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{eventName}</h3>
        <p className="text-sm text-gray-500 mt-1">QR Code para check-in</p>
      </div>

      {/* QR Code Display */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
        {isLoading ? (
          <div className="w-64 h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          </div>
        ) : (
          <img
            src={qrCodeUrl}
            alt={`QR Code para ${eventName}`}
            className="w-64 h-64 border border-gray-300 rounded"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <Button
          onClick={handleDownload}
          disabled={isDownloading || isLoading}
          className="flex-1 gap-2"
          variant="outline"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Baixando...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Baixar
            </>
          )}
        </Button>

        <Button
          onClick={handleShare}
          disabled={isLoading}
          className="flex-1 gap-2"
          variant="outline"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 text-center">
        Este QR Code é válido por 24 horas a partir da sua geração
      </p>
    </div>
  )
}
