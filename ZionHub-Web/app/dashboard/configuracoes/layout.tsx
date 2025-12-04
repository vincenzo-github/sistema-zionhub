import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b">
        <Link href="/dashboard/configuracoes">
          <Button variant="ghost" className="rounded-none border-b-2 border-b-transparent hover:border-b-primary-600">
            Igreja
          </Button>
        </Link>
        <Link href="/dashboard/configuracoes/perfil">
          <Button variant="ghost" className="rounded-none border-b-2 border-b-transparent hover:border-b-primary-600">
            Meu Perfil
          </Button>
        </Link>
      </div>

      {/* Content */}
      {children}
    </div>
  )
}
