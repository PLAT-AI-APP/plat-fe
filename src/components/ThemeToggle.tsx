"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded-md bg-card text-font-1 border border-border-main hover:bg-card-hover transition-colors"
    >
      {theme === "dark" ? "☀️ 라이트 모드로 변경" : "🌙 다크 모드로 변경"}
    </button>
  );
}
