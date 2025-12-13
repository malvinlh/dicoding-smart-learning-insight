// src/components/UserIdForm.jsx
import React, { useState } from "react";

export default function UserIdForm({ onSubmit, loading, error }) {
  const [inputUserId, setInputUserId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUserId.trim()) return;
    onSubmit(Number(inputUserId));
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-7 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            Dicoding Smart Learning Insight
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Masukkan <span className="font-medium">User ID</span> untuk melihat
            ringkasan gaya belajar dan performa ujian.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          {/* Input group */}
          <label className="block space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>User ID</span>
            <input
              type="number"
              min="1"
              value={inputUserId}
              onChange={(e) => setInputUserId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm outline-none
                         focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                         dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
              placeholder="Contoh: 3390"
            />
          </label>

          {/* Error message */}
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white shadow-sm
                       hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Memuat insight..." : "Lihat AI Insight"}
          </button>
        </form>
      </div>
    </div>
  );
}
