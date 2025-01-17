import { decode } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { CookiesKeys } from "./constants/CookiesKeys";
import { getCookieServer } from "./lib/cookieServer";
import api from "./services/axios";
import { DOMAIN, HOST, PROTOCOL } from "./utils/hosts";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const host = req.headers.get("host") || "";

  console.log("pathname: " + pathname);
  console.log("host: " + req.headers.get("host"));

  if (host.startsWith("app.")) {
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/signup") ||
      pathname.startsWith("/forgot-password")
    ) {
      return NextResponse.next();
    } else {
      if (pathname.startsWith("/_next") || pathname === "/") {
        return NextResponse.next();
      } else {
        console.log("ENTROU NO REDIRECT 1");
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  } else {
    const token = getCookieServer(CookiesKeys.TOKEN);

    if (!token) {
      console.log("ENTROU NO REDIRECT 2");
      return NextResponse.redirect(new URL(PROTOCOL + "app." + HOST + "/"));
    }

    if (!(await validarToken(token))) {
      console.log("ENTROU NO REDIRECT 3");
      return NextResponse.redirect(new URL(PROTOCOL + "app." + HOST + "/"));
    }

    const tokenDecoded = decode(token);
    const subdomain = host.split(".")[0];

    if (tokenDecoded?.aud !== subdomain) {
      console.log("ENTROU NO REDIRECT 4");

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
      console.log("ENTROU NO REDIRECT 5");
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  return NextResponse.next();
}

const validarToken = async (token: string) => {
  try {
    await api.get("/auth/valid-token", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return false;
  }
  return true;
};
