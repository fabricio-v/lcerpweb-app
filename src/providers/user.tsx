"use client";
import { CookiesKeys } from "@/constants/CookiesKeys";
import { DOMAIN, HOST, PROTOCOL } from "@/utils/hosts";
import { deleteCookie } from "cookies-next";
import { createContext, ReactNode, useContext, useState } from "react";

interface User {
  id: number;
  nome: string;
  email: string;
  permissoes: string[];
  avatar?: "";
}

type UserContextData = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  signout: () => Promise<void>;
};

type UserProviderProps = {
  children: ReactNode;
};

export const UserContext = createContext({} as UserContextData);

function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  function clearUser() {
    setUser(null);
  }

  async function signout() {
    await deleteCookie(CookiesKeys.TOKEN, {
      domain: DOMAIN,
    });
    await deleteCookie(CookiesKeys.USER, {
      domain: DOMAIN,
    });
    window.location.href = PROTOCOL + "app." + HOST;
  }

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, signout }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser(): UserContextData {
  const context = useContext(UserContext);
  return context;
}

export { UserProvider, useUser };
