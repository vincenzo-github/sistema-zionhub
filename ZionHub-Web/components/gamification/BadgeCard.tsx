import React from 'react'
import { CheckCircle2, Lock } from 'lucide-react'
import { Badge, UserBadge } from '@/types/gamification'

interface BadgeCardProps {
  badge: Badge
  userBadge?: UserBadge
  isEarned: boolean
}

export default function BadgeCard({ badge, userBadge, isEarned }: BadgeCardProps) {
  return (
    <div
      className={`relative rounded-lg border p-4 transition-all ${
        isEarned
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : 'border-gray-300 bg-gray-50 opacity-60 dark:border-gray-600 dark:bg-gray-800'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl ${
              isEarned ? badge.color : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {badge.icon}
          </div>
          <div>
            <h3 className="font-semibold">{badge.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {badge.description}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {badge.points_required} pontos necessários
            </p>
          </div>
        </div>
        <div>
          {isEarned ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <Lock className="h-6 w-6 text-gray-400" />
          )}
        </div>
      </div>
      {isEarned && userBadge && (
        <div className="mt-2 text-xs text-green-700 dark:text-green-300">
          Conquistado em {new Date(userBadge.earned_at).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  )
}
