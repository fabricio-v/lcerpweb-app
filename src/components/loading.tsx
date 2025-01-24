"use client";

import { useLoadingStore } from "@/providers/loading";
import { Loader2 } from "lucide-react";

function Loading() {
  const { isShowLoading } = useLoadingStore();

  return isShowLoading ? (
    <div className="fixed z-[100] flex h-full w-full flex-col items-center justify-center gap-4 bg-lc-primary opacity-80">
      <Loader2 className="animate-spin" size={50} />
      <h1>Aguarde...</h1>
    </div>
  ) : (
    <></>
  );
}

export default Loading;
