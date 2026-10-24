export type AdminRole = "admin" | "manager" | "staff";

export const adminRoles: AdminRole[] = ["admin", "manager", "staff"];

/** Admin panel user — password is plain text for now (encrypt later). */
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  /** Plain text for now — not hashed */
  password: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

/** Safe shape for UI (no password). */
export type AdminProfile = Omit<AdminUser, "password">;
