import "server-only";
import { env } from "@/config";

// Tell the website project to refresh its cached pages after an admin change.
export async function revalidateSite() {
  if (!env.revalidateSecret) return;
  try {
    await fetch(`${env.siteUrl}/api/revalidate`, {
      method: "POST",
      headers: { "x-revalidate-secret": env.revalidateSecret },
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    /* website offline: it refreshes on next build/restart */
  }
}
