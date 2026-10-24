"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin";
import { getPrimaryAdmin, hashSecret, updateAdminProfile } from "@/server/admin-users";
import { adminRoles, type AdminRole } from "@/types/admin-user";

export type ProfileFormState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<"displayName" | "email" | "role" | "mobile" | "currentPassword" | "newPassword" | "confirmPassword" | "form", string>>;
};

export async function updateProfileAction(_: ProfileFormState, fd: FormData): Promise<ProfileFormState> {
  await requireAdmin();
  const admin = await getPrimaryAdmin();

  const displayName = String(fd.get("displayName") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const role = String(fd.get("role") ?? "admin") as AdminRole;
  const mobile = String(fd.get("mobile") ?? "").trim();
  const currentPassword = String(fd.get("currentPassword") ?? "");
  const newPassword = String(fd.get("newPassword") ?? "");
  const confirmPassword = String(fd.get("confirmPassword") ?? "");

  const errors: ProfileFormState["errors"] = {};
  if (!displayName) errors.displayName = "Display name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!adminRoles.includes(role)) errors.role = "Choose a valid role.";
  if (mobile && !/^[0-9+\-\s()]{7,15}$/.test(mobile)) errors.mobile = "Enter a valid mobile number.";

  const changingPw = Boolean(currentPassword || newPassword || confirmPassword);
  let passwordHash: string | undefined;
  if (changingPw) {
    if (!currentPassword) errors.currentPassword = "Enter your current password.";
    else if (hashSecret(currentPassword) !== admin.passwordHash) errors.currentPassword = "Current password is incorrect.";
    if (newPassword.length < 8) errors.newPassword = "New password must be at least 8 characters.";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    if (!errors.currentPassword && !errors.newPassword && !errors.confirmPassword) {
      passwordHash = hashSecret(newPassword);
    }
  }

  if (errors && Object.keys(errors).length) return { errors };

  const result = await updateAdminProfile({
    id: admin.id,
    displayName,
    email,
    role,
    mobile,
    passwordHash,
  });
  if (!result.ok) return { errors: { form: result.error } };

  revalidatePath("/admin", "layout");
  revalidatePath("/admin/profile");
  return {
    ok: true,
    message: changingPw ? "Profile and password updated." : "Profile saved.",
  };
}
