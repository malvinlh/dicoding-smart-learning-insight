const Hapi = require('@hapi/hapi');

const pool = require('../src/services/db');
const InsightsService = require('../src/services/insightsService');
const InsightsHandler = require('../src/api/insights/handler');
const insightsRoutes = require('../src/api/insights/routes');
const InsightsValidator = require('../src/api/insights/validator');
const errorHandler = require('../src/utils/errorHandler');

module.exports = async function createServer() {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    routes: { cors: { origin: ['*'] } },
  });

  errorHandler(server);

  const service = new InsightsService(pool);
  const handler = new InsightsHandler(service, InsightsValidator);

  server.route(insightsRoutes(handler));
  server.route({
    method: 'GET',
    path: '/health',
    handler: () => ({ status: 'ok', time: new Date().toISOString() }),
  });

  await server.initialize();
  return server;
};
