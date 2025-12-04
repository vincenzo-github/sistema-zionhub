export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  points_required: number
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  badge: Badge
  earned_at: string
}

export interface UserPoints {
  user_id: string
  full_name: string
  email: string
  total_points: number
  rank: number
  badges_count: number
  events_attended: number
  last_activity: string | null
}

export interface PointsHistory {
  id: string
  user_id: string
  event_id: string
  event_name: string
  points_awarded: number
  reason: string
  created_at: string
}

export interface LeaderboardEntry {
  rank: number
  user_id: string
  full_name: string
  email: string
  total_points: number
  badges: UserBadge[]
  events_attended: number
}

export interface GamificationStats {
  total_points: number
  current_rank: number
  total_badges: number
  next_badge?: Badge
  points_to_next_badge: number
  events_attended: number
}

export interface PointsAwardRequest {
  user_id: string
  event_id: string
  points: number
  reason: string
}

export interface BadgeCheckResult {
  badge_id: string
  badge_name: string
  newly_earned: boolean
}
