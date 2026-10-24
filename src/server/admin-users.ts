import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/config";
import type { AdminProfile, AdminRole, AdminUser } from "@/types/admin-user";
import { connectDB } from "./mongo";
import { AdminUserModel } from "./models/admin-user";

export function hashSecret(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function strip(doc: AdminUser & { _id?: unknown; __v?: unknown }): AdminUser {
  const { _id: _a, __v: _b, ...rest } = doc;
  return rest as AdminUser;
}

function toProfile(u: AdminUser): AdminProfile {
  const { passwordHash: _, ...p } = u;
  return p;
}

/** Bootstrap first admin from config if collection empty (multi-user ready). */
export async function ensureAdminUser(): Promise<AdminUser> {
  await connectDB();
  const existing = await AdminUserModel.findOne().sort({ createdAt: 1 }).lean();
  if (existing) return strip(existing as unknown as AdminUser);

  const now = new Date().toISOString();
  const seed: AdminUser = {
    id: `admin_${Date.now().toString(36)}`,
    email: env.admin.email.trim().toLowerCase(),
    passwordHash: hashSecret(env.admin.password),
    displayName: "Admin",
    role: "admin",
    mobile: "",
    createdAt: now,
    updatedAt: now,
  };
  await AdminUserModel.create(seed);
  return seed;
}

export async function getPrimaryAdmin(): Promise<AdminUser> {
  return ensureAdminUser();
}

export async function getAdminProfile(): Promise<AdminProfile> {
  return toProfile(await getPrimaryAdmin());
}

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  await ensureAdminUser();
  const doc = await AdminUserModel.findOne({ email: email.trim().toLowerCase() }).lean();
  return doc ? strip(doc as unknown as AdminUser) : null;
}

export async function verifyAdminLogin(email: string, password: string): Promise<AdminUser | null> {
  const user = await findAdminByEmail(email);
  if (!user) return null;
  if (user.passwordHash !== hashSecret(password)) return null;
  return user;
}

export async function updateAdminProfile(input: {
  id: string;
  displayName: string;
  email: string;
  role: AdminRole;
  mobile: string;
  passwordHash?: string;
}): Promise<{ ok: true; profile: AdminProfile } | { ok: false; error: string }> {
  await connectDB();
  const email = input.email.trim().toLowerCase();
  const clash = await AdminUserModel.findOne({ email, id: { $ne: input.id } }).lean();
  if (clash) return { ok: false, error: "This email is already used by another account." };

  const $set: Record<string, string> = {
    displayName: input.displayName.trim(),
    email,
    role: input.role,
    mobile: input.mobile.trim(),
    updatedAt: new Date().toISOString(),
  };
  if (input.passwordHash) $set.passwordHash = input.passwordHash;

  const doc = await AdminUserModel.findOneAndUpdate({ id: input.id }, { $set }, { new: true }).lean();
  if (!doc) return { ok: false, error: "Profile not found." };
  return { ok: true, profile: toProfile(strip(doc as unknown as AdminUser)) };
}
