import { getCookie } from "cookies-next";

export function getCookieClient(cookieName: string) {
  const cookie = getCookie(cookieName);
  return cookie;
}
