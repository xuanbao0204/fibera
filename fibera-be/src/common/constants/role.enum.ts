export enum Role {
  TENANT = 'tenant',
  LANDLORD = 'landlord',
  ADMIN = 'admin',
}

/** Roles a visitor may pick on public registration. ADMIN is seeded, never self-assigned. */
export const PUBLIC_REGISTER_ROLES: readonly Role[] = [Role.TENANT, Role.LANDLORD];

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (Object.values(Role) as string[]).includes(value);
}
