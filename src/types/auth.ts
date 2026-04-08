export type UserRole = 'admin' | 'staff'

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: UserRole
}

export interface AuthState {
  user: SessionUser | null
  isLoading: boolean
}
