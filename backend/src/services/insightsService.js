const NotFoundError = require('../exceptions/NotFoundError');
const AuthorizationError = require('../exceptions/AuthorizationError');
const ConflictError = require('../exceptions/ConflictError');

class LearningInsightsService {
  constructor(pool) {
    this._pool = pool;
  }

  async getInsightByUserId(userId) {
    const query = {
      text: `SELECT * FROM learning_insights WHERE user_id = $1`,
      values: [userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Insight tidak ditemukan');
    }

    return result.rows[0];
  }

  async listInsights(source) {
    // source optional: 'ml' | 'manual'
    const query = source
      ? {
          text: `SELECT * FROM learning_insights WHERE source = $1 ORDER BY created_at DESC, user_id ASC`,
          values: [source],
        }
      : {
          text: `SELECT * FROM learning_insights ORDER BY created_at DESC, user_id ASC`,
          values: [],
        };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // ========= ML UPSERT (POST /insights) =========
  // source dipaksa 'ml'
  async upsertLearningInsight(payload) {
    const {
      user_id,
      display_name,
      learning_styles_cluster_label,
      learning_styles_insight,
      learning_styles_suggestion,
      exam_submission_cluster_label,
      exam_submission_insight,
      exam_submission_suggestion,
    } = payload;

    const query = {
      text: `
        INSERT INTO learning_insights (
          user_id,
          display_name,
          learning_styles_cluster_label,
          learning_styles_insight,
          learning_styles_suggestion,
          exam_submission_cluster_label,
          exam_submission_insight,
          exam_submission_suggestion,
          source
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'ml')
        ON CONFLICT (user_id)
        DO UPDATE SET
          display_name = EXCLUDED.display_name,
          learning_styles_cluster_label = EXCLUDED.learning_styles_cluster_label,
          learning_styles_insight = EXCLUDED.learning_styles_insight,
          learning_styles_suggestion = EXCLUDED.learning_styles_suggestion,
          exam_submission_cluster_label = EXCLUDED.exam_submission_cluster_label,
          exam_submission_insight = EXCLUDED.exam_submission_insight,
          exam_submission_suggestion = EXCLUDED.exam_submission_suggestion,
          source = 'ml'
        RETURNING *;
      `,
      values: [
        user_id,
        display_name,
        learning_styles_cluster_label,
        learning_styles_insight,
        learning_styles_suggestion,
        exam_submission_cluster_label,
        exam_submission_insight,
        exam_submission_suggestion,
      ],
    };

    const res = await this._pool.query(query);
    return res.rows[0];
  }

  // ========= MANUAL CREATE (INSERT only) =========
  async createManualInsight(payload) {
    const {
      user_id,
      display_name,
      learning_styles_cluster_label,
      learning_styles_insight,
      learning_styles_suggestion,
      exam_submission_cluster_label,
      exam_submission_insight,
      exam_submission_suggestion,
    } = payload;

    try {
      const query = {
        text: `
          INSERT INTO learning_insights (
            user_id,
            display_name,
            learning_styles_cluster_label,
            learning_styles_insight,
            learning_styles_suggestion,
            exam_submission_cluster_label,
            exam_submission_insight,
            exam_submission_suggestion,
            source
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'manual')
          RETURNING *;
        `,
        values: [
          user_id,
          display_name,
          learning_styles_cluster_label,
          learning_styles_insight,
          learning_styles_suggestion,
          exam_submission_cluster_label,
          exam_submission_insight,
          exam_submission_suggestion,
        ],
      };

      const res = await this._pool.query(query);
      return res.rows[0];
    } catch (e) {
      // duplikat PK user_id
      if (e && e.code === '23505') {
        throw new ConflictError('User ID sudah digunakan');
      }
      throw e;
    }
  }

  // ========= MANUAL UPDATE (only if source='manual') =========
  async updateManualInsight(userId, payload) {
    const exists = await this._pool.query({
      text: `SELECT source FROM learning_insights WHERE user_id = $1`,
      values: [userId],
    });

    if (!exists.rows.length) throw new NotFoundError('Insight tidak ditemukan');
    if (exists.rows[0].source !== 'manual') {
      throw new AuthorizationError(
        'Tidak dapat mengubah insight yang di-generate oleh ML'
      );
    }

    const {
      display_name,
      learning_styles_cluster_label,
      learning_styles_insight,
      learning_styles_suggestion,
      exam_submission_cluster_label,
      exam_submission_insight,
      exam_submission_suggestion,
    } = payload;

    const query = {
      text: `
        UPDATE learning_insights
        SET
          display_name = $2,
          learning_styles_cluster_label = $3,
          learning_styles_insight = $4,
          learning_styles_suggestion = $5,
          exam_submission_cluster_label = $6,
          exam_submission_insight = $7,
          exam_submission_suggestion = $8
        WHERE user_id = $1 AND source = 'manual'
        RETURNING *;
      `,
      values: [
        userId,
        display_name,
        learning_styles_cluster_label,
        learning_styles_insight,
        learning_styles_suggestion,
        exam_submission_cluster_label,
        exam_submission_insight,
        exam_submission_suggestion,
      ],
    };

    const res = await this._pool.query(query);
    return res.rows[0];
  }

  // ========= MANUAL DELETE (only if source='manual') =========
  async deleteManualInsight(userId) {
    const exists = await this._pool.query({
      text: `SELECT source FROM learning_insights WHERE user_id = $1`,
      values: [userId],
    });

    if (!exists.rows.length) throw new NotFoundError('Insight tidak ditemukan');
    if (exists.rows[0].source !== 'manual') {
      throw new AuthorizationError(
        'Tidak dapat menghapus insight yang di-generate oleh ML'
      );
    }

    const res = await this._pool.query({
      text: `DELETE FROM learning_insights WHERE user_id = $1 AND source = 'manual' RETURNING user_id;`,
      values: [userId],
    });

    return { user_id: res.rows[0].user_id };
  }
}

module.exports = LearningInsightsService;
