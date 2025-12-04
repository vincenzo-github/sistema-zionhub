'use client'

import { Search, Bell, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth'

export function Header() {
  const { user } = useAuthStore()

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'PJ'

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-8 shadow-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar eventos, voluntários..."
          className="pl-10"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-error"></span>
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-primary-300 to-primary-500 text-sm font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
