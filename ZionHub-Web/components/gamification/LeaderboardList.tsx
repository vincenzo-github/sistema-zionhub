import React from 'react'
import { Trophy, Award, Star } from 'lucide-react'
import { LeaderboardEntry } from '@/types/gamification'

interface LeaderboardListProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
}

export default function LeaderboardList({ entries, currentUserId }: LeaderboardListProps) {
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => {
        const isCurrentUser = entry.user_id === currentUserId
        const medal = getMedalEmoji(entry.rank)

        return (
          <div
            key={entry.user_id}
            className={`flex items-center justify-between rounded-lg border p-4 transition-all ${
              isCurrentUser
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                {medal ? (
                  <span className="text-2xl">{medal}</span>
                ) : (
                  <span className="font-bold text-gray-600 dark:text-gray-300">
                    #{entry.rank}
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{entry.full_name}</h3>
                  {isCurrentUser && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Você
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-right">
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Trophy className="h-4 w-4" />
                  <span>{entry.total_points} pts</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Award className="h-4 w-4" />
                  <span>{entry.badges.length} badges</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4" />
                  <span>{entry.events_attended} eventos</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {entries.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center dark:border-gray-700 dark:bg-gray-800">
          <Trophy className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 font-semibold text-gray-600 dark:text-gray-400">
            Nenhuma entrada no ranking
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            Participe de eventos para aparecer no ranking!
          </p>
        </div>
      )}
    </div>
  )
}
