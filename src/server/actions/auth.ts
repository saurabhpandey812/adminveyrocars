"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, hasAdminCreds } from "@/config";
import { COOKIE, getSecret, signToken } from "@/lib/admin-auth/token";
import { verifyAdminLogin } from "@/server/admin-users";

export async function loginAction(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!hasAdminCreds() || !getSecret()) return { error: "Admin credentials are not configured on the server." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const pw = String(fd.get("password") ?? "");
  const user = await verifyAdminLogin(email, pw);
  if (!user) {
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Incorrect email or password." };
  }
  (await cookies()).set(COOKIE, await signToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: env.isProd,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
