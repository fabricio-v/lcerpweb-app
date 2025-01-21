"use client";

import { create } from "zustand";

type Props = {
  isShowLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
};

const useLoadingStore = create<Props>((set) => ({
  isShowLoading: false,
  showLoading: () => set({ isShowLoading: true }),
  hideLoading: () => set({ isShowLoading: false }),
}));

export { useLoadingStore };
