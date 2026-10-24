import "server-only";
import { env } from "@/config";
import type { UserAccount, UserProfile, UserRole } from "@/types/user-account";
import { connectDB } from "./mongo";
import { UserModel } from "./models/user";

function configUser(): UserAccount {
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

function toProfile(u: UserAccount): UserProfile {
  const { password: _, ...p } = u;
  return p;
}

function strip(doc: Record<string, unknown>): UserAccount {
  return {
    id: String(doc.id ?? ""),
    email: String(doc.email ?? "").toLowerCase(),
    name: String(doc.name || doc.displayName || "Admin"),
    role: (doc.role as UserRole) || "admin",
    password: String(doc.password ?? ""),
    mobile: String(doc.mobile ?? ""),
    createdAt: String(doc.createdAt ?? ""),
    updatedAt: String(doc.updatedAt ?? ""),
  };
}

export function matchesConfigCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === env.admin.email.trim().toLowerCase() &&
    password === env.admin.password
  );
}

/** Upsert config admin into `users` (plain password). Never throws to caller. */
export async function syncConfigUserToDb(): Promise<void> {
  try {
    await connectDB();
    const email = env.admin.email.trim().toLowerCase();
    const now = new Date().toISOString();
    const existing = (await UserModel.findOne({ email }).lean()) as Record<string, unknown> | null;
    if (existing) {
      await UserModel.updateOne(
        { email },
        {
          $set: {
            name: String(existing.name || "Admin"),
            role: String(existing.role || "admin"),
            password: env.admin.password,
            updatedAt: now,
          },
          $unset: { passwordHash: "", displayName: "" },
        },
      );
      return;
    }
    await UserModel.create({
      id: `user_${Date.now().toString(36)}`,
      email,
      name: "Admin",
      role: "admin",
      password: env.admin.password,
      mobile: "",
      createdAt: now,
      updatedAt: now,
    });
  } catch (err) {
    console.error("[users] syncConfigUserToDb:", err);
  }
}

/** UI/layout — always safe, prefers DB then config. */
export async function getUserProfile(): Promise<UserProfile> {
  try {
    await connectDB();
    const doc = await UserModel.findOne().sort({ createdAt: 1 }).lean();
    if (doc) return toProfile(strip(doc as Record<string, unknown>));
  } catch (err) {
    console.error("[users] getUserProfile:", err);
  }
  return toProfile(configUser());
}

export async function getPrimaryUser(): Promise<UserAccount> {
  try {
    await connectDB();
    const doc = await UserModel.findOne().sort({ createdAt: 1 }).lean();
    if (doc) return strip(doc as Record<string, unknown>);
    await syncConfigUserToDb();
    const again = await UserModel.findOne().sort({ createdAt: 1 }).lean();
    if (again) return strip(again as Record<string, unknown>);
  } catch (err) {
    console.error("[users] getPrimaryUser:", err);
  }
  return configUser();
}

/**
 * Extra users from `users` table (plain password).
 * Config path is handled in loginAction without awaiting DB.
 */
export async function verifyUserLogin(email: string, password: string): Promise<UserAccount | null> {
  const normalized = email.trim().toLowerCase();

  if (matchesConfigCredentials(normalized, password)) {
    return configUser();
  }

  try {
    await connectDB();
    const doc = await UserModel.findOne({ email: normalized }).lean();
    if (doc) {
      const u = strip(doc as Record<string, unknown>);
      if (u.password === password) return u;
    }
  } catch (err) {
    console.error("[users] verifyUserLogin db:", err);
  }

  return null;
}

export async function updateUserProfile(input: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile: string;
  password?: string;
}): Promise<{ ok: true; profile: UserProfile } | { ok: false; error: string }> {
  try {
    await connectDB();
    let id = input.id;
    if (id === "config_admin") {
      await syncConfigUserToDb();
      const seeded = (await UserModel.findOne({ email: env.admin.email.trim().toLowerCase() }).lean()) as { id?: string } | null;
      if (!seeded?.id) return { ok: false, error: "Could not create user row." };
      id = String(seeded.id);
    }

    const email = input.email.trim().toLowerCase();
    const clash = await UserModel.findOne({ email, id: { $ne: id } }).lean();
    if (clash) return { ok: false, error: "This email is already used by another account." };

    const $set: Record<string, string> = {
      name: input.name.trim(),
      email,
      role: input.role,
      mobile: input.mobile.trim(),
      updatedAt: new Date().toISOString(),
    };
    if (input.password !== undefined) $set.password = input.password;

    const doc = await UserModel.findOneAndUpdate(
      { id },
      { $set, $unset: { passwordHash: "", displayName: "" } },
      { new: true },
    ).lean();
    if (!doc) return { ok: false, error: "Profile not found." };
    return { ok: true, profile: toProfile(strip(doc as Record<string, unknown>)) };
  } catch (err) {
    console.error("[users] updateUserProfile:", err);
    return { ok: false, error: "Could not save profile (database unavailable)." };
  }
}
