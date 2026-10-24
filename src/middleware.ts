import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, verifyToken } from "@/lib/admin-auth/token";

export async function middleware(req: NextRequest) {
  const ok = await verifyToken(req.cookies.get(COOKIE)?.value);
  const isLogin = req.nextUrl.pathname === "/admin/login";
  let res: NextResponse;
  if (isLogin) res = ok ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  else res = ok ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", req.url));
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
