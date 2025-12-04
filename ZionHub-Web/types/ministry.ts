export interface Ministry {
  id: string
  church_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  leader_id?: string
  leader_name?: string
  is_default: boolean
  total_volunteers?: number
  total_departments?: number
  created_at: string
  updated_at: string
}

export interface MinistryFilters {
  search?: string
}

export interface CreateMinistryInput {
  name: string
  description?: string
  color?: string
  icon?: string
  leader_id?: string
}

export interface MinistryStats {
  total_ministries: number
  active_ministries: number
  total_volunteers: number
  total_departments: number
}
