// ============================================================
// ENV — yahi edit karo (jaise .env.local). Baaki touch mat karo.
// ============================================================

// Atlas (active)
export const MONGODB_URI =
  "mongodb+srv://saurabhpandey081220_db_user:8WEuUtRmCafeAENn@cluster0.v8wdvaa.mongodb.net/verocars?retryWrites=true&w=majority";

// Local Mongo — Atlas band karo to upar comment, ye uncomment:
// export const MONGODB_URI = "mongodb://127.0.0.1:27017/verocars";

export const NEXT_PUBLIC_SITE_URL = "http://localhost:3000";

export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "admin12345";
export const ADMIN_SESSION_SECRET = "dev-only-secret-change-me";

export const REVALIDATE_SECRET = "dev-revalidate-secret";
export const CUSTOMER_PUBLIC_DIR = "";

// ============================================================
// App use (change mat karo)
// ============================================================

export const publicEnv = {
  siteUrl: NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
} as const;

export const env = {
  isProd: process.env.NODE_ENV === "production",
  siteUrl: publicEnv.siteUrl,
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
