'use client'

import { useEffect, useRef, useState } from 'react'
import { BrowserMultiFormatReader } from '@zxing/library'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'

interface QRCodeScannerProps {
  onScan: (data: string) => void
  isProcessing?: boolean
  onClose?: () => void
}

export function QRCodeScanner({
  onScan,
  isProcessing = false,
  onClose,
}: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const readerRef = useRef<BrowserMultiFormatReader | null>(null)
  const scanningRef = useRef(false)

  useEffect(() => {
    const initScanner = async () => {
      try {
        setIsInitializing(true)
        setError(null)

        const reader = new BrowserMultiFormatReader()
        readerRef.current = reader

        // Get video element
        if (!videoRef.current) {
          setError('Video element not found')
          return
        }

        // Request camera permission and start scanning
        const selectedDeviceId = await reader.listVideoInputDevices()
          .then(devices => {
            // Prefer back camera if available
            const backCamera = devices.find(d =>
              d.label.toLowerCase().includes('back') ||
              d.label.toLowerCase().includes('rear')
            )
            return (backCamera || devices[0])?.deviceId
          })

        if (!selectedDeviceId) {
          setError('Nenhuma câmera disponível')
          return
        }

        // Start continuous scanning
        scanningRef.current = true
        reader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, err) => {
            if (result) {
              const qrData = result.getText()
              // Validate QR code format
              if (qrData.startsWith('ZIONHUB:EVENT:')) {
                scanningRef.current = false
                onScan(qrData)
              }
            }
            if (err && !(err instanceof Error && err.name === 'NotFoundError')) {
              // Ignore NotFoundError (no barcode found)
              if (!(err instanceof Error && err.message.includes('No code found'))) {
                console.debug('Scan error:', err)
              }
            }
          }
        )

        setIsInitializing(false)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao acessar câmera'
        setError(errorMessage)
        setIsInitializing(false)

        if (errorMessage.includes('Permission')) {
          toast.error('Permissão de câmera negada. Verifique as configurações do navegador.')
        }
      }
    }

    initScanner()

    return () => {
      if (readerRef.current) {
        readerRef.current.reset()
      }
      scanningRef.current = false
    }
  }, [onScan])

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="w-full flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Escanear QR Code</h3>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Video Stream */}
      {!error ? (
        <div className="relative w-full max-w-sm aspect-square bg-black rounded-lg overflow-hidden border-2 border-gray-300">
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
                <p className="text-sm text-white">Inicializando câmera...</p>
              </div>
            </div>
          )}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />

          {/* Scanning overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-64">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary-500"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500"></div>
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-sm aspect-square bg-red-50 rounded-lg border-2 border-red-200 flex flex-col items-center justify-center p-4 gap-3">
          <p className="text-center text-sm text-red-700 font-medium">
            Erro ao acessar a câmera
          </p>
          <p className="text-center text-xs text-red-600">
            {error}
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-700 font-medium">Alinhe o QR Code com a câmera</p>
        <p className="text-xs text-gray-500">
          O escaneamento é automático - não é necessário tirar foto
        </p>
      </div>
    </div>
  )
}
