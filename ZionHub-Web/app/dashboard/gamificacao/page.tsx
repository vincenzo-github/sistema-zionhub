'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserGamification } from '@/components/gamification/UserGamification'
import { LeaderboardList } from '@/components/gamification/LeaderboardList'
import { useGamification } from '@/hooks/useGamification'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { Zap, Trophy, RefreshCw } from 'lucide-react'

export default function GamificacaoPage() {
  const [activeTab, setActiveTab] = useState('profile')

  const {
    stats,
    allBadges,
    userBadges,
    loading: userLoading,
    error: userError,
    refetch: refetchUser,
  } = useGamification()

  const {
    entries: leaderboard,
    isLoading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useLeaderboard()

  const earnedBadgeIds = new Set(userBadges.map(b => b.badge_id))
  const nextBadge = allBadges.find(
    badge => !earnedBadgeIds.has(badge.id)
  )
  const pointsToNextBadge = nextBadge && stats
    ? Math.max(0, nextBadge.points_required - stats.total_points)
    : 0

  const handleRefresh = async () => {
    await refetchUser()
    await refetchLeaderboard()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gamificação</h1>
          <p className="text-gray-500 mt-2">
            Acompanhe seu progresso e suba no ranking
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          Meu Perfil
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'leaderboard'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Ranking
        </button>
      </div>

      <div>
        {activeTab === 'profile' && (
          <>
            {userError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-900 font-medium">Erro ao carregar gamificação</p>
                <p className="text-red-700 text-sm mt-2">{userError}</p>
              </div>
            ) : userLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">Carregando dados...</p>
              </div>
            ) : stats ? (
              <UserGamification
                stats={stats}
                badges={userBadges}
                allBadges={allBadges}
                gameReport={{
                  rankName: 'Membro',
                  rankEmoji: '🏆',
                  percentToNextRank: 0,
                }}
                nextBadge={nextBadge}
                pointsToNextBadge={pointsToNextBadge}
                isLoading={userLoading}
                error={userError}
              />
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  Participe de eventos para começar a ganhar pontos!
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <>
            {leaderboardError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-900 font-medium">Erro ao carregar ranking</p>
                <p className="text-red-700 text-sm mt-2">{leaderboardError}</p>
              </div>
            ) : (
              <LeaderboardList
                entries={leaderboard}
                isLoading={leaderboardLoading}
              />
            )}
          </>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">Como funciona:</span> Ganhe pontos participando de eventos
          (baseado na duração), desbloqueie badges conforme atinge marcos de pontos,
          e suba no ranking global!
        </p>
      </div>
    </div>
  )
}
