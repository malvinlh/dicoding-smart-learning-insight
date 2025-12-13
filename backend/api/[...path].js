const createServer = require('../src/createServer');

let serverPromise;

// baca raw body dari request (Node IncomingMessage)
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  try {
    if (!serverPromise) serverPromise = createServer();
    const server = await serverPromise;

    // req.url di Vercel Function biasanya "/api/....?query"
    const urlObj = new URL(req.url, 'http://localhost');

    // Path asli Hapi kamu itu "/health" dan "/insights/..."
    // Karena function route-nya "/api/*", kita buang prefix "/api"
    let path = urlObj.pathname || '/';
    if (path.startsWith('/api')) path = path.slice(4) || '/';

    const injectUrl = path + (urlObj.search || '');

    const payload =
      req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : await readBody(req);

    const hapiRes = await server.inject({
      method: req.method,
      url: injectUrl,
      headers: req.headers,
      payload,
    });

    // set status + headers
    res.statusCode = hapiRes.statusCode;

    // copy header penting
    for (const [key, value] of Object.entries(hapiRes.headers || {})) {
      // hindari header yang berpotensi konflik
      if (key.toLowerCase() === 'content-length') continue;
      res.setHeader(key, value);
    }

    res.end(hapiRes.payload);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(
      JSON.stringify({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server kami.',
      })
    );
  }
};
