import React from 'react'
import { Badge, UserBadge, GamificationStats } from '@/types/gamification'
import PointsTracker from './PointsTracker'
import BadgeCard from './BadgeCard'

interface UserGamificationProps {
  stats: GamificationStats
  allBadges: Badge[]
  userBadges: UserBadge[]
}

export default function UserGamification({
  stats,
  allBadges,
  userBadges,
}: UserGamificationProps) {
  const isEarned = (badgeId: string) => {
    return userBadges.some((ub) => ub.badge_id === badgeId)
  }

  const getUserBadge = (badgeId: string) => {
    return userBadges.find((ub) => ub.badge_id === badgeId)
  }

  const earnedBadges = allBadges.filter((badge) => isEarned(badge.id))
  const lockedBadges = allBadges.filter((badge) => !isEarned(badge.id))

  return (
    <div className="space-y-8">
      {/* Points Tracker */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Seu Desempenho</h2>
        <PointsTracker stats={stats} />
      </section>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">
            Badges Conquistadas ({earnedBadges.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {earnedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                userBadge={getUserBadge(badge.id)}
                isEarned={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">
            Badges Bloqueadas ({lockedBadges.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {lockedBadges.map((badge) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                isEarned={false}
              />
            ))}
          </div>
        </section>
      )}

      {allBadges.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <div className="text-6xl">🏆</div>
          <h3 className="mt-4 font-semibold text-gray-600 dark:text-gray-400">
            Nenhuma badge disponível
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            As badges serão disponibilizadas em breve!
          </p>
        </div>
      )}
    </div>
  )
}
