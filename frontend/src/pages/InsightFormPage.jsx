// src/pages/InsightFormPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createManualInsight,
  getInsightByUserId,
  updateManualInsight,
} from "../api/insightsApi";

const emptyForm = {
  user_id: "",
  display_name: "",
  learning_styles_cluster_label: "",
  learning_styles_insight: "",
  learning_styles_suggestion: "",
  exam_submission_cluster_label: "",
  exam_submission_insight: "",
  exam_submission_suggestion: "",
};

export default function InsightFormPage({ mode }) {
  const navigate = useNavigate();
  const { userId } = useParams();

  const isEdit = mode === "edit";
  const title = useMemo(
    () => (isEdit ? "Update Manual Insight" : "Add New Manual Insight"),
    [isEdit]
  );

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!isEdit) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const row = await getInsightByUserId(userId);
        if (!alive) return;

        setForm({
          user_id: row.user_id,
          display_name: row.display_name || "",
          learning_styles_cluster_label: row.learning_styles_cluster_label || "",
          learning_styles_insight: row.learning_styles_insight || "",
          learning_styles_suggestion: row.learning_styles_suggestion || "",
          exam_submission_cluster_label: row.exam_submission_cluster_label || "",
          exam_submission_insight: row.exam_submission_insight || "",
          exam_submission_suggestion: row.exam_submission_suggestion || "",
        });
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Gagal memuat data untuk edit.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isEdit, userId]);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    setSaving(true);

    try {
      const payload = {
        ...form,
        user_id: Number(form.user_id),
      };

      if (!payload.user_id || !payload.display_name) {
        throw new Error("user_id dan display_name wajib diisi.");
      }

      if (isEdit) {
        await updateManualInsight(userId, payload);
        setOk("Berhasil update insight manual.");
      } else {
        await createManualInsight(payload);
        setOk("Berhasil menambahkan insight manual.");
      }

      setTimeout(() => setOk(""), 2500);
    } catch (e2) {
      setError(e2.message || "Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto mt-4 max-w-4xl px-4 sm:px-6 lg:px-8 pb-10">
      {/* Top controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex w-full items-center justify-center gap-1 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm
                     hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:w-auto"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </button>

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-sky-500 sm:w-auto"
        >
          Admin Dashboard
        </button>
      </div>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white/90 p-5 sm:p-6 shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900/90">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          Manual Insight Form
        </p>
        <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h1>

        {loading && (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300">
            Memuat data...
          </div>
        )}

        {!loading && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* user_id + display_name */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  user_id (unique)
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.user_id}
                  onChange={setField("user_id")}
                  disabled={isEdit}
                  inputMode="numeric"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>

              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  display_name
                </span>
                <input
                  type="text"
                  value={form.display_name}
                  onChange={setField("display_name")}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
            </div>

            {/* cluster labels */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  learning_styles_cluster_label
                </span>
                <input
                  type="text"
                  value={form.learning_styles_cluster_label}
                  onChange={setField("learning_styles_cluster_label")}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>

              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  exam_submission_cluster_label
                </span>
                <input
                  type="text"
                  value={form.exam_submission_cluster_label}
                  onChange={setField("exam_submission_cluster_label")}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
            </div>

            {/* insights */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  learning_styles_insight
                </span>
                <textarea
                  rows={5}
                  value={form.learning_styles_insight}
                  onChange={setField("learning_styles_insight")}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>

              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  exam_submission_insight
                </span>
                <textarea
                  rows={5}
                  value={form.exam_submission_insight}
                  onChange={setField("exam_submission_insight")}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
            </div>

            {/* suggestions */}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  learning_styles_suggestion
                </span>
                <textarea
                  rows={4}
                  value={form.learning_styles_suggestion}
                  onChange={setField("learning_styles_suggestion")}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>

              <label className="block min-w-0">
                <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  exam_submission_suggestion
                </span>
                <textarea
                  rows={4}
                  value={form.exam_submission_suggestion}
                  onChange={setField("exam_submission_suggestion")}
                  className="mt-1 w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm outline-none
                             focus:border-sky-500 focus:ring-1 focus:ring-sky-500
                             dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                />
              </label>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
                {error}
              </div>
            )}
            {ok && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-700/60 dark:bg-emerald-900/40 dark:text-emerald-100">
                {ok}
              </div>
            )}

            {/* Action bar */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-1 rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-medium text-white shadow-sm
                           hover:bg-emerald-500 disabled:opacity-70 sm:w-auto"
              >
                {saving
                  ? "Menyimpan..."
                  : isEdit
                  ? "Update Manual Insight"
                  : "Create Manual Insight"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-medium text-slate-700 hover:bg-slate-100
                           dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:bg-slate-950 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
