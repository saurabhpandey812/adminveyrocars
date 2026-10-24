"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/server/admin";
import { getPrimaryUser, updateUserProfile } from "@/server/users";
import { userRoles, type UserRole } from "@/types/user-account";

export type ProfileFormState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<
    Record<"displayName" | "email" | "role" | "mobile" | "currentPassword" | "newPassword" | "confirmPassword" | "form", string>
  >;
};

export async function updateProfileAction(_: ProfileFormState, fd: FormData): Promise<ProfileFormState> {
  await requireAdmin();
  const user = await getPrimaryUser();

  const name = String(fd.get("displayName") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const role = String(fd.get("role") ?? "admin") as UserRole;
  const mobile = String(fd.get("mobile") ?? "").trim();
  const currentPassword = String(fd.get("currentPassword") ?? "");
  const newPassword = String(fd.get("newPassword") ?? "");
  const confirmPassword = String(fd.get("confirmPassword") ?? "");

  const errors: ProfileFormState["errors"] = {};
  if (!name) errors.displayName = "Name is required.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email.";
  if (!userRoles.includes(role)) errors.role = "Choose a valid role.";
  if (mobile && !/^[0-9+\-\s()]{7,15}$/.test(mobile)) errors.mobile = "Enter a valid mobile number.";

  const changingPw = Boolean(currentPassword || newPassword || confirmPassword);
  let password: string | undefined;
  if (changingPw) {
    if (!currentPassword) errors.currentPassword = "Enter your current password.";
    else if (currentPassword !== user.password) errors.currentPassword = "Current password is incorrect.";
    if (newPassword.length < 4) errors.newPassword = "New password must be at least 4 characters.";
    if (newPassword !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    if (!errors.currentPassword && !errors.newPassword && !errors.confirmPassword) {
      password = newPassword;
    }
  }

  if (errors && Object.keys(errors).length) return { errors };

  const result = await updateUserProfile({
    id: user.id,
    name,
    email,
    role,
    mobile,
    password,
  });
  if (!result.ok) return { errors: { form: result.error } };

  revalidatePath("/admin", "layout");
  revalidatePath("/admin/profile");
  return {
    ok: true,
    message: changingPw ? "Profile and password updated." : "Profile saved.",
  };
}
