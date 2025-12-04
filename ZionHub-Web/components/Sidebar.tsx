'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import {
  Home,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

export default function Sidebar() {
  const pathname = usePathname()
  const { logout, user } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/eventos', label: 'Eventos', icon: Calendar },
    { href: '/dashboard/voluntarios', label: 'Voluntários', icon: Users },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-primary-800 text-white rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-primary-800 text-white transform transition-transform md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-30 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-primary-700">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-primary-100">ZionHub</h1>
          </Link>
        </div>

        {/* Menu items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(href)
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:bg-primary-700'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-primary-700 space-y-3">
          <div className="text-sm">
            <p className="text-primary-200">Logado como</p>
            <p className="font-semibold text-white">{user?.full_name}</p>
          </div>
          <button
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className="w-full flex items-center gap-2 px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
