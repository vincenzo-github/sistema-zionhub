'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/types/notification'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const { notifications, loading, getUnreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications({
      autoFetch: true,
      refetchInterval: 30000,
    })

  // Atualizar contagem de não lidas
  useEffect(() => {
    const updateUnreadCount = async () => {
      const count = await getUnreadCount()
      setUnreadCount(count)
    }

    updateUnreadCount()
    const interval = setInterval(updateUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [getUnreadCount])

  // Atualizar contagem quando notificações mudam
  useEffect(() => {
    const count = notifications.filter((n) => !n.is_read).length
    setUnreadCount(count)
  }, [notifications])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return '📋'
      case 'confirmation':
        return '✅'
      case 'reminder':
        return '🔔'
      case 'checkin':
        return '✓'
      default:
        return 'ℹ️'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'bg-blue-50 border-blue-200'
      case 'confirmation':
        return 'bg-green-50 border-green-200'
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200'
      case 'checkin':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        title="Notificações"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-lg">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 gap-1 text-xs"
                >
                  <CheckCheck className="h-4 w-4" />
                  Marcar tudo
                </Button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
                <p className="mt-2 text-sm text-gray-600">Carregando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
              <p className="text-xs text-gray-600">
                {notifications.filter((n) => n.is_read).length} de {notifications.length} lidas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Overlay para fechar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  getTypeIcon: (type: string) => string
  getTypeColor: (type: string) => string
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({
  notification,
  getTypeIcon,
  getTypeColor,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
        notification.is_read
          ? 'border-l-gray-300'
          : 'border-l-primary-600 bg-blue-50'
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="text-2xl flex-shrink-0">
          {getTypeIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 line-clamp-1">
            {notification.title}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(notification.created_at).toLocaleDateString('pt-BR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          {!notification.is_read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 text-gray-400 hover:text-primary-600 hover:bg-gray-200 rounded transition-colors"
              title="Marcar como lida"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-200 rounded transition-colors"
            title="Deletar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
