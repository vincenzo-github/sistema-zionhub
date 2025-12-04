export interface ChurchSettings {
  id: string
  name: string
  email: string
  phone?: string
  whatsapp?: string
  logo?: string
  address?: string
  plan_id: 'basic' | 'professional' | 'enterprise'
  status: 'pending' | 'active' | 'suspended' | 'cancelled'
  setup_completed: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  church_id: string
  email: string
  full_name: string
  phone?: string
  whatsapp?: string
  photo?: string
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member'
  position?: string
  status: 'pending' | 'active' | 'inactive'
  is_master: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface UpdateChurchInput {
  name?: string
  email?: string
  phone?: string
  whatsapp?: string
  address?: string
}

export interface UpdateProfileInput {
  full_name?: string
  phone?: string
  whatsapp?: string
  photo?: string
  position?: string
}
