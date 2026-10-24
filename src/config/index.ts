// ============================================================
// ENV — yahi edit karo (jaise pehle .env.local me karte the).
// Deploy pe .env file zaroori nahi — yehi values use hoti hain.
// Baaki files touch mat karo.
// ============================================================

// Atlas (active) — web (verocars) aur admin same DB
export const MONGODB_URI =
  "mongodb+srv://saurabhpandey081220_db_user:8WEuUtRmCafeAENn@cluster0.v8wdvaa.mongodb.net/verocars?retryWrites=true&w=majority";

// Local Mongo — Atlas band karo to upar comment, ye uncomment:
// export const MONGODB_URI = "mongodb://127.0.0.1:27017/verocars";

/** Customer website URL (View website / image fallback / revalidate) */
// Live
export const NEXT_PUBLIC_SITE_URL = "https://verocars.vercel.app";
// Local — live band karo to upar comment, ye uncomment:
// export const NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

/** Admin panel URL */
// Live
export const NEXT_PUBLIC_ADMIN_URL = "https://adminveyrocars.vercel.app";
// Local — live band karo to upar comment, ye uncomment:
// export const NEXT_PUBLIC_ADMIN_URL = "http://localhost:3002";

/**
 * Live login credentials (server pe yahi se login — DB wait nahi).
 * Successful login pe `users` collection me bhi sync (email, name, role, password plain).
 */
export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "admin12345";
export const ADMIN_SESSION_SECRET = "dev-only-secret-change-me";

/** Must match verocars revalidate secret if you use live cache bust */
export const REVALIDATE_SECRET = "dev-revalidate-secret";

/** Optional: absolute path to verocars/public for shared uploads. Empty = admin/public */
export const CUSTOMER_PUBLIC_DIR = "";

// ============================================================
// App use (change mat karo)
// ============================================================

export const publicEnv = {
  siteUrl: NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
  adminUrl: NEXT_PUBLIC_ADMIN_URL.replace(/\/$/, ""),
} as const;

export const env = {
  isProd: process.env.NODE_ENV === "production",
  siteUrl: publicEnv.siteUrl,
  adminUrl: publicEnv.adminUrl,
  mongodbUri: MONGODB_URI,
  admin: {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    sessionSecret: ADMIN_SESSION_SECRET,
  },
  revalidateSecret: REVALIDATE_SECRET,
  customerPublicDir: CUSTOMER_PUBLIC_DIR,
} as const;

export function hasAdminCreds() {
  return Boolean(ADMIN_EMAIL && ADMIN_PASSWORD && ADMIN_SESSION_SECRET);
}
