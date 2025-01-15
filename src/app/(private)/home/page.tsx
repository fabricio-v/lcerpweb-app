"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { getCookieClient } from "@/lib/cookieClient";
import { useUser } from "@/providers/user";
import { useEffect } from "react";

export default function Home() {
  const { setUser } = useUser();
  useEffect(() => {
    const loadUser = async () => {
      const userCookie = await getCookieClient(CookiesKeys.USER);
      if (userCookie) {
        setUser(JSON.parse(userCookie.toString()));
      }
    };
    loadUser();
  }, []);

  return (
    <div>
      <h1>HOME</h1>
    </div>
  );
}
