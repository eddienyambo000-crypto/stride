import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "stride_admin";
const ADMIN_TOKEN = "ok";

/** Gate /admin/* behind the admin cookie. /admin/login stays public. */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    if (token !== ADMIN_TOKEN) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
