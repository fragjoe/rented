import type { UserRole } from '@/types/auth'

export type Permission =
  | 'read'
  | 'write'
  | 'delete'

export const permissions = {
  // User management — admin only
  users: {
    read: ['admin'] as UserRole[],
    write: ['admin'] as UserRole[],
    delete: ['admin'] as UserRole[],
  },
  // All other modules — admin + staff
  locations: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  owners: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  units: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  customers: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  contracts: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  chargeTypes: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin'] as UserRole[],
    delete: ['admin'] as UserRole[],
  },
  chargeRules: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  invoices: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  payments: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  sharedUtilities: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  maintenance: {
    read: ['admin', 'staff'] as UserRole[],
    write: ['admin', 'staff'] as UserRole[],
    delete: ['admin', 'staff'] as UserRole[],
  },
  reports: {
    read: ['admin', 'staff'] as UserRole[],
  },
} as const

export type Resource = keyof typeof permissions

export function canAccess(role: UserRole, resource: Resource, action: Permission): boolean {
  const resourcePerms = permissions[resource] as Record<Permission, UserRole[]> | undefined
  if (!resourcePerms) return false
  const allowed = resourcePerms[action]
  if (!allowed) return false
  return allowed.includes(role)
}
