class LearningInsightsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.getInsightByUserIdHandler = this.getInsightByUserIdHandler.bind(this);
    this.upsertLearningInsightHandler =
      this.upsertLearningInsightHandler.bind(this);

    this.listInsightsHandler = this.listInsightsHandler.bind(this);
    this.createManualInsightHandler = this.createManualInsightHandler.bind(this);
    this.updateManualInsightHandler = this.updateManualInsightHandler.bind(this);
    this.deleteManualInsightHandler = this.deleteManualInsightHandler.bind(this);
  }

  async getInsightByUserIdHandler(request, h) {
    const { userId } = request.params;
    const insight = await this._service.getInsightByUserId(userId);

    return { status: 'success', data: { insight } };
  }

  // POST /insights (ML upsert)
  async upsertLearningInsightHandler(request, h) {
    this._validator.validateMlUpsert(request.payload);
    const insight = await this._service.upsertLearningInsight(request.payload);

    return h.response({ status: 'success', data: { insight } }).code(201);
  }

  // GET /insights?source=ml|manual
  async listInsightsHandler(request, h) {
    const { source } = request.query;

    const insights = await this._service.listInsights(source);
    return { status: 'success', data: { insights } };
  }

  // POST /insights/manual (INSERT only)
  async createManualInsightHandler(request, h) {
    this._validator.validateManualCreate(request.payload);

    const insight = await this._service.createManualInsight(request.payload);
    return h.response({ status: 'success', data: { insight } }).code(201);
  }

  // PUT /insights/manual/{userId}
  async updateManualInsightHandler(request, h) {
    this._validator.validateManualUpdate(request.payload);

    const { userId } = request.params;
    const insight = await this._service.updateManualInsight(userId, request.payload);

    return { status: 'success', data: { insight } };
  }

  // DELETE /insights/manual/{userId}
  async deleteManualInsightHandler(request, h) {
    const { userId } = request.params;
    const result = await this._service.deleteManualInsight(userId);

    return { status: 'success', data: result };
  }
}

module.exports = LearningInsightsHandler;
