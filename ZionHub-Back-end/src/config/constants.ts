// Gamification points
export const GAMIFICATION_POINTS = {
  CHECK_IN: 10,
  CHECK_OUT_EXTRA: 5,
  EARLY_CONFIRMATION: 3,
  PERFECT_ATTENDANCE_MONTH: 50,
  COMPLETE_PROFILE: 20,
} as const;

// Gamification levels
export const GAMIFICATION_LEVELS = [
  { level: 1, minPoints: 0, name: 'Iniciante' },
  { level: 2, minPoints: 50, name: 'Comprometido' },
  { level: 3, minPoints: 150, name: 'Dedicado' },
  { level: 4, minPoints: 300, name: 'Exemplar' },
  { level: 5, minPoints: 500, name: 'Referência' },
] as const;

// User roles
export const USER_ROLES = {
  MASTER: 'master',
  LEADER_MINISTRY: 'leader_ministry',
  LEADER_DEPT: 'leader_dept',
  MEMBER: 'member',
} as const;

// User status
export const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

// Event status
export const EVENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Event workflow stages
export const EVENT_WORKFLOW_STAGE = {
  CREATED: 'created',
  SCHEDULING: 'scheduling',
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

// Assignment status
export const ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  CHECKED_IN: 'checked_in',
  CHECKED_OUT: 'checked_out',
} as const;

// Church plans
export const CHURCH_PLANS = {
  BASIC: 'basic',
  PROFESSIONAL: 'professional',
  ENTERPRISE: 'enterprise',
} as const;

// Proficiency levels
export const PROFICIENCY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

// API response codes
export const API_ERRORS = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  CONFLICT: 'CONFLICT',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  CONFIRMATION: 'confirmation',
  REMINDER: 'reminder',
  CHECKIN: 'checkin',
  GENERAL: 'general',
} as const;
