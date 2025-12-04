// Database Models / Types

export interface Church {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  logo?: string;
  address?: string;
  plan_id: 'basic' | 'professional' | 'enterprise';
  cakto_id?: string;
  status: 'pending' | 'active' | 'suspended' | 'cancelled';
  setup_completed: boolean;
  setup_token?: string;
  setup_token_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  church_id: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  whatsapp?: string;
  photo?: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  status: 'pending' | 'active' | 'inactive';
  is_master: boolean;
  position?: string;
  activation_token?: string;
  activation_token_expires_at?: string;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Ministry {
  id: string;
  church_id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  leader_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  church_id: string;
  ministry_id: string;
  name: string;
  description?: string;
  admin_id?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface DepartmentRole {
  id: string;
  department_id: string;
  name: string;
  description?: string;
  max_volunteers?: number;
  created_at: string;
}

export interface Event {
  id: string;
  church_id: string;
  name: string;
  type?: string;
  date: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';
  is_draft: boolean;
  workflow_stage: string;
  ministry_id?: string;
  event_template_id?: string;
  schedule_template_id?: string;
  setlist_id?: string;
  recurrence_group_id?: string;
  qrcode?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EventAssignment {
  id: string;
  event_id: string;
  department_role_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'checked_in' | 'checked_out';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  assigned_by?: string;
  assigned_at: string;
  confirmed_at?: string;
  declined_at?: string;
  decline_reason?: string;
}

export interface GamificationPoints {
  id: string;
  church_id: string;
  user_id: string;
  points: number;
  level: number;
  rank_position?: number;
  updated_at: string;
}

export interface Notification {
  id: string;
  church_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'assignment' | 'confirmation' | 'reminder' | 'checkin' | 'general';
  event_id?: string;
  assignment_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface JWTPayload {
  userId: string;
  churchId: string;
  email: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  isMaster: boolean;
  iat?: number;
  exp?: number;
}
