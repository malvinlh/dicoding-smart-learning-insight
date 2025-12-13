// src/components/AIInsightPage.jsx
import React, { useState } from "react";

const LEARNING_LABEL_DESCRIPTIONS = {
  "consistent learner":
    "Memiliki jumlah materi yang konsisten diselesaikan setiap hari atau minggunya.",
  "fast learner":
    "Menyelesaikan banyak materi (lebih dari 5 materi) dalam satu hari.",
  "reflective learner":
    "Menghabiskan banyak waktu untuk mempelajari atau mengulas kembali materi.",
  "Steady Learners":
    "Memiliki pola belajar yang stabil dan ritme penyelesaian materi yang relatif tetap.",
};

const EXAM_LABEL_DESCRIPTIONS = {
  "Excellent Performers":
    "Memiliki nilai ujian sangat tinggi dan konsisten lulus.",
  "Good Performers":
    "Memiliki nilai ujian di atas rata-rata dengan performa cukup stabil.",
  "Needs Improvement":
    "Sering mengalami kesulitan di ujian dan perlu meningkatkan pemahaman materi.",
};

export default function AiInsightPage({ profile }) {
  const { displayName, learningStyles, examPerformance } = profile;
  const [copyStatus, setCopyStatus] = useState("");

  const learningLabelDescription =
    LEARNING_LABEL_DESCRIPTIONS[learningStyles.clusterLabel] ||
    "Deskripsi learning style belum tersedia.";
  const examLabelDescription =
    EXAM_LABEL_DESCRIPTIONS[examPerformance.clusterLabel] ||
    "Deskripsi performa ujian belum tersedia.";

  const handleCopy = async () => {
    const reportText =
      `Dicoding Smart Learning Insight\n` +
      `Nama: ${displayName}\n\n` +
      `=== Learning Style ===\n` +
      `Label: ${learningStyles.clusterLabel}\n` +
      `Definisi: ${learningLabelDescription}\n\n` +
      `Insight:\n${learningStyles.insight}\n\n` +
      `Saran:\n${learningStyles.suggestion}\n\n` +
      `=== Exam & Submission Performance ===\n` +
      `Label: ${examPerformance.clusterLabel}\n` +
      `Definisi: ${examLabelDescription}\n\n` +
      `Insight:\n${examPerformance.insight}\n\n` +
      `Saran:\n${examPerformance.suggestion}\n`;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopyStatus("Report copied!");
      setTimeout(() => setCopyStatus(""), 2000);
    } catch {
      setCopyStatus("Copy failed");
      setTimeout(() => setCopyStatus(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto mt-4 max-w-4xl space-y-4 px-4 py-6 md:mt-6 md:py-8 lg:mt-8 lg:py-10">
        {/* Header */}
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Dicoding Smart Learning Insight
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-3xl">
              Hi, <span className="text-sky-500">{displayName}</span> 👋
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 md:text-[15px]">
              Berikut ringkasan singkat dari AI tentang gaya belajar dan
              performa ujian kamu di Dicoding.
            </p>
          </div>
        </header>

        {/* Main Card */}
        <main>
          <section
            className="w-full rounded-3xl border border-slate-200 bg-white/95 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur-sm
                       dark:border-slate-800 dark:bg-slate-950/95 dark:text-slate-50 dark:shadow-slate-950/50"
          >
            <div className="space-y-4 px-5 py-4 md:px-6 md:py-5">
              {/* Persona badges + tooltip */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    AI persona
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {/* Learning style badge + tooltip */}
                    <div className="group relative inline-flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-800 dark:border-sky-500/40 dark:bg-sky-500/15 dark:text-sky-200">
                        <span aria-hidden="true">📚</span>
                        {learningStyles.clusterLabel}
                      </span>
                      <button
                        type="button"
                        title={learningLabelDescription}
                        className="cursor-default text-[11px] text-slate-500 dark:text-slate-400"
                      >
                        ⓘ
                      </button>
                      {/* Tooltip */}
                      <div
                        className="pointer-events-none absolute left-0 top-full z-10 mt-1 w-56 scale-95 rounded-md border border-slate-200 bg-white p-3 text-[11px] text-slate-700 opacity-0 shadow-lg transition-all duration-150
                                   group-hover:scale-100 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {learningLabelDescription}
                      </div>
                    </div>

                    {/* Exam performance badge + tooltip */}
                    <div className="group relative inline-flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200">
                        <span aria-hidden="true">✅</span>
                        {examPerformance.clusterLabel}
                      </span>
                      <button
                        type="button"
                        title={examLabelDescription}
                        className="cursor-default text-[11px] text-slate-500 dark:text-slate-400"
                      >
                        ⓘ
                      </button>
                      {/* Tooltip */}
                      <div
                        className="pointer-events-none absolute left-0 top-full z-10 mt-1 w-56 scale-95 rounded-md border border-emerald-100 bg-white p-3 text-[11px] text-slate-700 opacity-0 shadow-lg transition-all duration-150
                                   group-hover:scale-100 group-hover:opacity-100 dark:border-emerald-500/40 dark:bg-slate-900 dark:text-slate-200"
                      >
                        {examLabelDescription}
                      </div>
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-slate-900/5 px-3 py-1 text-[10px] font-medium text-slate-600 dark:border-slate-700/70 dark:bg-slate-900 dark:text-slate-300">
                  Powered by machine learning model
                </span>
              </div>

              {/* Insight & Recommendation */}
              <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-start">
                {/* Left Block: Short Insight */}
                <div className="min-w-0 flex-1 space-y-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Ringkasan AI
                  </h2>
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 md:p-6">
                    <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-sky-400 via-indigo-500 to-emerald-400" />
                    <div className="space-y-6 pl-2">
                      <p>
                        <span className="font-medium text-slate-900 dark:text-slate-50">
                          Gaya belajar:
                        </span>{" "}
                        {learningStyles.insight}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900 dark:text-slate-50">
                          Performa ujian & tugas:
                        </span>{" "}
                        {examPerformance.insight}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Block: Recommendation */}
                <div className="min-w-0 flex-1 space-y-3 border-t border-slate-200/70 pt-3 md:border-t-0 md:border-l md:border-slate-200/70 md:pl-4 md:pt-0 dark:md:border-slate-800">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Langkah yang disarankan
                  </h2>
                  <div className="space-y-2 text-sm text-slate-800 dark:text-slate-100">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-900">
                      <p className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-50">
                        <span aria-hidden="true">🧭</span>
                        Dari pola belajar:
                      </p>
                      <p>{learningStyles.suggestion}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-900">
                      <p className="mb-1 flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-50">
                        <span aria-hidden="true">📊</span>
                        Dari hasil ujian & tugas:
                      </p>
                      <p>{examPerformance.suggestion}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action bar */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-sky-500 active:bg-sky-700"
                  >
                    <span aria-hidden="true">📋</span>
                    Copy report
                  </button>
                  {copyStatus && (
                    <span className="text-[10px] text-emerald-500">
                      {copyStatus}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Insight ini bersifat personal dan hanya terlihat oleh akun
                  kamu.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
