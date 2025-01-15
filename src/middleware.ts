import { decode } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { CookiesKeys } from "./constants/CookiesKeys";
import { getCookieServer } from "./lib/cookieServer";
import { DOMAIN, HOST, PROTOCOL } from "./utils/hosts";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const host = req.headers.get("host") || "";

  console.log("pathname: " + pathname);
  console.log("host: " + req.headers.get("host"));

  if (host.startsWith("app.")) {
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup")
    ) {
      return NextResponse.next();
    } else {
      console.log("ENTROU NO REDIRECT 1");
      return NextResponse.redirect(new URL("/", req.url));
    }
  } else {
    const token = getCookieServer(CookiesKeys.TOKEN);

    if (!token) {
      console.log("ENTROU NO REDIRECT 2");
      return NextResponse.redirect(new URL(PROTOCOL + "app." + HOST + "/"));
    }

    const tokenDecoded = decode(token);
    const subdomain = host.split(".")[0];

    if (tokenDecoded?.aud !== subdomain) {
      console.log("ENTROU NO REDIRECT 3");

      const response = NextResponse.redirect(
        new URL(PROTOCOL + "app." + HOST + "/"),
      );

      response.headers.set(
        "Set-Cookie",
        `${CookiesKeys.TOKEN}=; ${CookiesKeys.USER}=; Path=/; HttpOnly; Max-Age=0; Domain=${DOMAIN}`,
      );
      return response;
    }

    if (pathname === "/") {
      console.log("ENTROU NO REDIRECT 4");
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
