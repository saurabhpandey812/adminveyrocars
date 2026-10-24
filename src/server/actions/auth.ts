"use server";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, hasAdminCreds } from "@/config";
import { COOKIE, getSecret, signToken } from "@/lib/admin-auth/token";

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export async function loginAction(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  if (!hasAdminCreds() || !getSecret()) return { error: "Admin credentials are not configured on the server." };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const pw = String(fd.get("password") ?? "");
  const ok = sha(email) === sha(env.admin.email.toLowerCase()) && sha(pw) === sha(env.admin.password);
  if (!ok) { await new Promise((r) => setTimeout(r, 600)); return { error: "Incorrect email or password." }; }
  (await cookies()).set(COOKIE, await signToken(), { httpOnly: true, sameSite: "lax", secure: env.isProd, path: "/", maxAge: 60 * 60 * 24 * 7 });
  redirect("/admin");
}
export async function logoutAction() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
