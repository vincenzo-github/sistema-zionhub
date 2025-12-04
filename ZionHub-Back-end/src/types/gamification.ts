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
  earned_at: string
}

export interface UserGameification {
  user_id: string
  total_points: number
  current_rank: number
  badges_earned: number
  events_attended: number
  updated_at: string
}

export interface PointsHistory {
  id: string
  user_id: string
  event_id: string
  points_awarded: number
  reason: string
  created_at: string
}

export interface AwardPointsInput {
  user_id: string
  event_id: string
  points: number
  reason: string
}
