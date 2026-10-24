export type UserRole = "admin" | "manager" | "staff";

export const userRoles: UserRole[] = ["admin", "manager", "staff"];

/** Panel login user — stored in Mongo `users`. Password plain for now. */
export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

export type UserProfile = Omit<UserAccount, "password">;
