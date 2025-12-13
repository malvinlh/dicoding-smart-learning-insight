import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AiInsightPage from "../components/AIInsightPage";
import { getInsightByUserId, mapRowToProfile } from "../api/insightsApi";

export default function InsightRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const [profile, setProfile] = useState(location.state?.profile || null);
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const row = await getInsightByUserId(userId);
        if (!alive) return;
        setProfile(mapRowToProfile(row));
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Gagal memuat insight.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [profile, userId]);

  return (
    <div>
      <div className="mx-auto mt-4 max-w-4xl px-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-2 inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm
                     hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <span aria-hidden="true">←</span>
          Back to Home
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
            Memuat AI Learning Insight...
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
            <p className="font-semibold mb-1">Gagal memuat data</p>
            <p className="text-xs">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && profile && <AiInsightPage profile={profile} />}
    </div>
  );
}
