const insightsRoutes = (handler) => [
  // List all insights
  {
    method: 'GET',
    path: '/insights',
    handler: handler.listInsightsHandler,
  },

  // Existing: ML upsert
  {
    method: 'POST',
    path: '/insights',
    handler: handler.upsertLearningInsightHandler,
  },

  // Existing: get by userId
  {
    method: 'GET',
    path: '/insights/{userId}',
    handler: handler.getInsightByUserIdHandler,
  },

  // Manual create/update/delete
  {
    method: 'POST',
    path: '/insights/manual',
    handler: handler.createManualInsightHandler,
  },
  {
    method: 'PUT',
    path: '/insights/manual/{userId}',
    handler: handler.updateManualInsightHandler,
  },
  {
    method: 'DELETE',
    path: '/insights/manual/{userId}',
    handler: handler.deleteManualInsightHandler,
  },
];

module.exports = insightsRoutes;
