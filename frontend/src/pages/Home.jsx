import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Dicoding Smart Learning Insight
        </p>
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Choose an action
        </h1>

        <div className="mt-5 space-y-3">
          <button
            type="button"
            onClick={() => navigate("/lookup")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:py-3.5 text-left text-sm text-slate-900 shadow-sm hover:bg-slate-100
                       dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-50 dark:hover:bg-slate-950"
          >
            <div className="font-semibold">Masukkan User ID</div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:py-3.5 text-left text-sm text-slate-900 shadow-sm hover:bg-slate-100
                       dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-50 dark:hover:bg-slate-950"
          >
            <div className="font-semibold">Admin Dashboard</div>
          </button>

          <button
            type="button"
            onClick={() => navigate("/add")}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 sm:py-3.5 text-left text-sm text-slate-900 shadow-sm hover:bg-slate-100
                       dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-50 dark:hover:bg-slate-950"
          >
            <div className="font-semibold">Add New Insight</div>
          </button>
        </div>
      </div>
    </div>
  );
}
