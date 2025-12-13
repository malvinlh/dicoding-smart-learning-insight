import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import ThemeToggle from "./components/ThemeToggle";

import Home from "./pages/Home";
import Lookup from "./pages/Lookup";
import InsightRoute from "./pages/InsightRoute";
import AdminDashboard from "./pages/AdminDashboard";
import InsightFormPage from "./pages/InsightFormPage";

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")
      ?.matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="w-full px-4 pt-4 flex justify-end">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Input user ID */}
        <Route path="/lookup" element={<Lookup />} />
        <Route path="/insight/:userId" element={<InsightRoute />} />

        {/* Admin dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* Add & Edit manual insight */}
        <Route path="/add" element={<InsightFormPage mode="add" />} />
        <Route path="/edit/:userId" element={<InsightFormPage mode="edit" />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-700 shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-200">
        <p className="font-semibold">404</p>
        <p className="mt-1 text-xs">Page tidak ditemukan.</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-sky-500"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
