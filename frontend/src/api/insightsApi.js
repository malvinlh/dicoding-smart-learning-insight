const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const API_PREFIX = import.meta.env.DEV ? "" : "/api";

async function parseError(res, fallback) {
  let message = fallback;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch (_) {}
  return message;
}

function url(path) {
  return `${API_BASE_URL}${API_PREFIX}${path}`;
}

// GET /api/insights/{userId}
export async function getInsightByUserId(userId) {
  const res = await fetch(url(`/insights/${userId}`));
  if (!res.ok) throw new Error(await parseError(res, "Gagal mengambil insight"));
  const json = await res.json();
  return json.data.insight;
}

// GET /api/insights?source=ml|manual
export async function listInsights(source) {
  const qs = source ? `?source=${encodeURIComponent(source)}` : "";
  const res = await fetch(url(`/insights${qs}`));
  if (!res.ok) throw new Error(await parseError(res, "Gagal mengambil daftar insight"));
  const json = await res.json();
  return json.data.insights;
}

// POST /api/insights/manual
export async function createManualInsight(payload) {
  const res = await fetch(url(`/insights/manual`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Gagal menambah insight manual"));
  const json = await res.json();
  return json.data.insight;
}

// PUT /api/insights/manual/{userId}
export async function updateManualInsight(userId, payload) {
  const res = await fetch(url(`/insights/manual/${userId}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await parseError(res, "Gagal update insight manual"));
  const json = await res.json();
  return json.data.insight;
}

// DELETE /api/insights/manual/{userId}
export async function deleteManualInsight(userId) {
  const res = await fetch(url(`/insights/manual/${userId}`), {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(await parseError(res, "Gagal delete insight manual"));
  const json = await res.json();
  return json.data;
}

// Mapping DB row -> shape AiInsightPage
export function mapRowToProfile(row) {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    learningStyles: {
      clusterLabel: row.learning_styles_cluster_label || "Steady Learners",
      insight:
        row.learning_styles_insight ||
        "Insight gaya belajar belum tersedia untuk pengguna ini.",
      suggestion:
        row.learning_styles_suggestion ||
        "Belum ada saran spesifik.",
    },
    examPerformance: {
      clusterLabel: row.exam_submission_cluster_label || "Good Performers",
      insight:
        row.exam_submission_insight ||
        "Insight performa ujian belum tersedia.",
      suggestion:
        row.exam_submission_suggestion ||
        "Belum ada saran spesifik.",
    },
  };
}
