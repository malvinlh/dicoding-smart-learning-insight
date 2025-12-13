import React from "react";

export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-200 hover:border-slate-400 transition
                 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
    >
      <span className="text-base" aria-hidden="true">
        {isDark ? "☀️" : "🌙"}
      </span>
      <span>{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
