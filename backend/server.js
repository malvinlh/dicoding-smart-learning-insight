require('dotenv').config();
const createServer = require('./src/createServer');

(async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server running at ${server.info.uri}`);
})();
