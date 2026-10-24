"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env, hasAdminCreds } from "@/config";
import { COOKIE, getSecret, signToken } from "@/lib/admin-auth/token";
import { verifyUserLogin } from "@/server/users";

function isNextRedirect(err: unknown) {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function loginAction(_: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  try {
    if (!hasAdminCreds() || !getSecret()) {
      return { error: "Admin credentials are not configured on the server." };
    }
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const pw = String(fd.get("password") ?? "");
    if (!email || !pw) return { error: "Email and password are required." };

    // Config / users table — never throws for DB issues
    const user = await verifyUserLogin(email, pw);
    if (!user) {
      await new Promise((r) => setTimeout(r, 400));
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
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    console.error("[auth] loginAction:", err);
    return { error: "Sign in failed. Please try again." };
  }
}

export async function logoutAction() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
