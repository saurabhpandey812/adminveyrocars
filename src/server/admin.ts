import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifyToken } from "@/lib/admin-auth/token";

// Call at the top of every admin page and server action (defence in depth beside middleware).
export async function requireAdmin() {
  const store = await cookies();
  if (!(await verifyToken(store.get(COOKIE)?.value))) redirect("/admin/login");
}
