"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

function ButtonTheme() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
    >
      {theme !== "dark" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

export default ButtonTheme;
