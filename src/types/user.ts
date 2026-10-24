export type UserRole = "customer" | "admin";
export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
