"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      aria-label="Toggle theme"
      className="h-9 w-9 rounded-full transition-all duration-300 hover:bg-accent/50"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <Sun className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 text-muted-foreground transition-all duration-300 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 text-muted-foreground transition-all duration-300 dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
