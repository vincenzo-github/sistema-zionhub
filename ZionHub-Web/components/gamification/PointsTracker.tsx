import React from 'react'
import { Trophy, TrendingUp, Award } from 'lucide-react'
import { GamificationStats } from '@/types/gamification'

interface PointsTrackerProps {
  stats: GamificationStats
}

export default function PointsTracker({ stats }: PointsTrackerProps) {
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    if (rank <= 10) return '🏆'
    return '⭐'
  }

  const progressPercentage = stats.next_badge
    ? ((stats.total_points % stats.next_badge.points_required) /
        stats.next_badge.points_required) *
      100
    : 0

  return (
    <div className="space-y-4">
      {/* Points Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total de Pontos
              </p>
              <p className="text-2xl font-bold">{stats.total_points}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">{getRankEmoji(stats.current_rank)}</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Posição no Ranking</p>
              <p className="text-2xl font-bold">#{stats.current_rank}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Badges Conquistadas
              </p>
              <p className="text-2xl font-bold">{stats.total_badges}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Badge Progress */}
      {stats.next_badge && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Próxima Badge</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stats.next_badge.name}
              </p>
            </div>
            <div className={`rounded-full p-2 ${stats.next_badge.color}`}>
              <span className="text-2xl">{stats.next_badge.icon}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progresso</span>
              <span className="font-semibold">
                {stats.total_points} / {stats.next_badge.points_required} pontos
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="mr-1 inline h-4 w-4" />
              Faltam {stats.points_to_next_badge} pontos para a próxima badge
            </p>
          </div>
        </div>
      )}

      {/* Events Attended */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Eventos Participados
            </p>
            <p className="text-xl font-bold">{stats.events_attended}</p>
          </div>
          <div className="text-4xl">🎉</div>
        </div>
      </div>
    </div>
  )
}
