"use client";

import { CookiesKeys } from "@/constants/CookiesKeys";
import { DOMAIN } from "@/utils/hosts";
import { deleteCookie } from "cookies-next";
import { create } from "zustand";

interface UserProps {
  id: number;
  nome: string;
  email: string;
  permissoes: string[];
  avatar?: "";
}

type Props = {
  user: UserProps | null;
  setUser: (user: UserProps) => void;
  clearUser: () => void;
  signout: () => Promise<void>;
};

const useUserStore = create<Props>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  signout: async () => {
    get().clearUser();

    await deleteCookie(CookiesKeys.TOKEN, {
      domain: DOMAIN,
    });
    await deleteCookie(CookiesKeys.USER, {
      domain: DOMAIN,
    });
  },
}));

export { useUserStore };
