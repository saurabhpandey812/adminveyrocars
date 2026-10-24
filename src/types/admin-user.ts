export type AdminRole = "admin" | "manager" | "staff";

export const adminRoles: AdminRole[] = ["admin", "manager", "staff"];

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: AdminRole;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

/** Safe shape for UI (no password hash). */
export type AdminProfile = Omit<AdminUser, "passwordHash">;
