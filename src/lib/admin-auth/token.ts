import { env } from "@/config";

// Works in both Node and the Edge middleware (Web Crypto only).
export const COOKIE = "admin_session";
const enc = new TextEncoder();

export function getSecret(): string | null {
  return env.admin.sessionSecret || null;
}
async function hmac(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
export async function signToken(ttlSeconds = 60 * 60 * 24 * 7) {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  return `${exp}.${await hmac(secret, String(exp))}`;
}
export async function verifyToken(token?: string) {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const good = await hmac(secret, exp);
  if (good.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < good.length; i++) diff |= good.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}
