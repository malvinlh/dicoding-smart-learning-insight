const Joi = require('joi');
const ValidationError = require('../../exceptions/ValidationError');

// schema payload inti (kolom sesuai DB)
const BaseInsightSchema = {
  user_id: Joi.number().integer().required(),
  display_name: Joi.string().required(),

  learning_styles_cluster_label: Joi.string().allow(null, ''),
  learning_styles_insight: Joi.string().allow(null, ''),
  learning_styles_suggestion: Joi.string().allow(null, ''),

  exam_submission_cluster_label: Joi.string().allow(null, ''),
  exam_submission_insight: Joi.string().allow(null, ''),
  exam_submission_suggestion: Joi.string().allow(null, ''),
};

// Untuk ML upsert: sama seperti sebelumnya
const MlInsightPayloadSchema = Joi.object(BaseInsightSchema);

// Untuk manual create: sama (form isi kolom2 DB)
const ManualCreateSchema = Joi.object(BaseInsightSchema);

// Untuk manual update: tetap require semua (biar sederhana & sesuai form)
const ManualUpdateSchema = Joi.object(BaseInsightSchema);

module.exports = {
  validateMlUpsert(payload) {
    const { error } = MlInsightPayloadSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },

  validateManualCreate(payload) {
    const { error } = ManualCreateSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },

  validateManualUpdate(payload) {
    const { error } = ManualUpdateSchema.validate(payload);
    if (error) throw new ValidationError(error.message);
  },
};
