import { cookies } from "next/headers";

export function getCookieServer(cookieName: string) {
  const cookie = cookies().get(cookieName)?.value;

  return cookie || null;
}
