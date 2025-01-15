import { getCookie } from "cookies-next";

export async function getCookieClient(cookieName: string) {
  const cookie = await getCookie(cookieName);
  return cookie;
}
