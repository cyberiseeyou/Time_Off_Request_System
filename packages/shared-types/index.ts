// Shared TypeScript interfaces for time-off system
// Aligns with database schema from Story 1.1

export interface Manager {
  id: number
  name: string
  email: string
  password_hash?: string // Optional for frontend use
}

export interface TimeOffRequest {
  id?: number // Optional for creation
  employee_name: string
  start_date: string // ISO date string
  end_date: string // ISO date string
  reason?: string // Optional field
  manager_id: number
  created_at?: string // Optional, set by database
  updated_at?: string // Optional, set by database
}

export interface TimeOffRequestForm {
  employee_name: string
  start_date: string
  end_date: string
  reason?: string
  manager_id: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ManagerLoginForm {
  email: string
  password: string
}

export interface ManagerSession {
  id: number
  name: string
  email: string
  authenticated: boolean
}