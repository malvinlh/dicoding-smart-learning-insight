const Hapi = require("@hapi/hapi");

const pool = require("./services/db");
const InsightsService = require("./services/insightsService");
const InsightsHandler = require("./api/insights/handler");
const insightsRoutes = require("./api/insights/routes");
const InsightsValidator = require("./api/insights/validator");
const errorHandler = require("./utils/errorHandler");

async function createServer() {
  const server = Hapi.server({
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  errorHandler(server);

  const service = new InsightsService(pool);
  const handler = new InsightsHandler(service, InsightsValidator);

  server.route(insightsRoutes(handler));

  server.route({
    method: "GET",
    path: "/health",
    handler: () => ({ status: "ok", time: new Date().toISOString() }),
  });

  await server.initialize();
  return server;
}

module.exports = createServer;
