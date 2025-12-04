'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, User, RefreshCw } from 'lucide-react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import UserGamification from '@/components/gamification/UserGamification'
import LeaderboardList from '@/components/gamification/LeaderboardList'
import { useGamification } from '@/hooks/useGamification'
import { useLeaderboard } from '@/hooks/useLeaderboard'

interface DecodedToken {
  userId: string
  email: string
  role: string
}

export default function GamificacaoPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'leaderboard'>('profile')
  const [userId, setUserId] = useState<string | undefined>()

  useEffect(() => {
    const token = Cookies.get('auth_token')
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token)
        setUserId(decoded.userId)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const {
    stats,
    allBadges,
    userBadges,
    loading: gamificationLoading,
    error: gamificationError,
    refetch: refetchGamification,
  } = useGamification(userId)

  const {
    entries,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useLeaderboard(activeTab === 'leaderboard')

  const handleRefresh = () => {
    if (activeTab === 'profile') {
      refetchGamification()
    } else {
      refetchLeaderboard()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gamificação</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Acompanhe seu progresso e conquiste badges
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          disabled={gamificationLoading || leaderboardLoading}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              gamificationLoading || leaderboardLoading ? 'animate-spin' : ''
            }`}
          />
          Atualizar
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <User className="h-4 w-4" />
            Meu Perfil
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'leaderboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <Trophy className="h-4 w-4" />
            Ranking
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'profile' && (
          <>
            {gamificationLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Carregando dados...
                  </p>
                </div>
              </div>
            )}

            {gamificationError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {gamificationError}
                </p>
              </div>
            )}

            {!gamificationLoading && !gamificationError && stats && (
              <UserGamification
                stats={stats}
                allBadges={allBadges}
                userBadges={userBadges}
              />
            )}
          </>
        )}

        {activeTab === 'leaderboard' && (
          <>
            {leaderboardLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Carregando ranking...
                  </p>
                </div>
              </div>
            )}

            {leaderboardError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {leaderboardError}
                </p>
              </div>
            )}

            {!leaderboardLoading && !leaderboardError && (
              <LeaderboardList entries={entries} currentUserId={userId} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
