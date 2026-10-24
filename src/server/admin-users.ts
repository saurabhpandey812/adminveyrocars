import "server-only";
import { env } from "@/config";
import type { AdminProfile, AdminRole, AdminUser } from "@/types/admin-user";
import { connectDB } from "./mongo";
import { AdminUserModel } from "./models/admin-user";

type LeanUser = AdminUser & {
  _id?: unknown;
  __v?: unknown;
  passwordHash?: string;
  displayName?: string;
};

function strip(doc: LeanUser): AdminUser {
  const { _id: _a, __v: _b, passwordHash: _h, displayName: _d, ...rest } = doc;
  return {
    id: rest.id,
    email: rest.email,
    name: rest.name || _d || "Admin",
    role: rest.role,
    password: rest.password ?? "",
    mobile: rest.mobile ?? "",
    createdAt: rest.createdAt,
    updatedAt: rest.updatedAt,
  };
}

function toProfile(u: AdminUser): AdminProfile {
  const { password: _, ...p } = u;
  return p;
}

function configUser(): AdminUser {
  const now = new Date().toISOString();
  return {
    id: "config_admin",
    email: env.admin.email.trim().toLowerCase(),
    name: "Admin",
    role: "admin",
    password: env.admin.password,
    mobile: "",
    createdAt: now,
    updatedAt: now,
  };
}

function matchesConfig(email: string, password: string) {
  return (
    email.trim().toLowerCase() === env.admin.email.trim().toLowerCase() &&
    password === env.admin.password
  );
}

/**
 * Ensure `adminusers` has at least one row.
 * Seeds from config (email/password plain). Migrates old hashed docs.
 */
export async function ensureAdminUser(): Promise<AdminUser> {
  await connectDB();
  const existing = await AdminUserModel.findOne().sort({ createdAt: 1 }).lean();

  if (existing) {
    const raw = existing as unknown as LeanUser;
    // Old schema: passwordHash / displayName → convert to plain password + name
    if (!raw.password || raw.passwordHash || raw.displayName) {
      const now = new Date().toISOString();
      const patched = await AdminUserModel.findOneAndUpdate(
        { id: raw.id },
        {
          $set: {
            name: raw.name || raw.displayName || "Admin",
            password: env.admin.password,
            email: raw.email || env.admin.email.trim().toLowerCase(),
            role: raw.role || "admin",
            mobile: raw.mobile || "",
            updatedAt: now,
          },
          $unset: { passwordHash: "", displayName: "" },
        },
        { new: true },
      ).lean();
      if (patched) return strip(patched as unknown as LeanUser);
    }
    return strip(raw);
  }

  const now = new Date().toISOString();
  const seed: AdminUser = {
    id: `admin_${Date.now().toString(36)}`,
    email: env.admin.email.trim().toLowerCase(),
    name: "Admin",
    role: "admin",
    password: env.admin.password,
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
  try {
    return toProfile(await getPrimaryAdmin());
  } catch (err) {
    console.error("[admin-users] getAdminProfile fallback:", err);
    return toProfile(configUser());
  }
}

/** Login against DB plain password; config fallback if DB down. */
export async function verifyAdminLogin(email: string, password: string): Promise<AdminUser | null> {
  const normalized = email.trim().toLowerCase();

  try {
    const user = await ensureAdminUser();
    const doc = await AdminUserModel.findOne({ email: normalized }).lean();
    if (doc) {
      const u = strip(doc as unknown as LeanUser);
      return u.password === password ? u : null;
    }
    // email not in DB but config matches primary seed email
    if (matchesConfig(normalized, password)) return user;
  } catch (err) {
    console.error("[admin-users] verifyAdminLogin db error:", err);
  }

  if (matchesConfig(normalized, password)) return configUser();
  return null;
}

export async function updateAdminProfile(input: {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  mobile: string;
  password?: string;
}): Promise<{ ok: true; profile: AdminProfile } | { ok: false; error: string }> {
  try {
    await connectDB();
    let id = input.id;
    if (id === "config_admin") {
      const seeded = await ensureAdminUser();
      id = seeded.id;
    }

    const email = input.email.trim().toLowerCase();
    const clash = await AdminUserModel.findOne({ email, id: { $ne: id } }).lean();
    if (clash) return { ok: false, error: "This email is already used by another account." };

    const $set: Record<string, string> = {
      name: input.name.trim(),
      email,
      role: input.role,
      mobile: input.mobile.trim(),
      updatedAt: new Date().toISOString(),
    };
    if (input.password !== undefined) $set.password = input.password;

    const doc = await AdminUserModel.findOneAndUpdate({ id }, { $set, $unset: { passwordHash: "", displayName: "" } }, { new: true }).lean();
    if (!doc) return { ok: false, error: "Profile not found. Try again in a moment." };
    return { ok: true, profile: toProfile(strip(doc as unknown as LeanUser)) };
  } catch (err) {
    console.error("[admin-users] updateAdminProfile:", err);
    return { ok: false, error: "Could not save profile (database unavailable)." };
  }
}
