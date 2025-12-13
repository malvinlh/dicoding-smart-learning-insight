// backend/api/[...path].js
const createServer = require("../src/createServer");

let serverPromise;

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  try {
    if (!serverPromise) serverPromise = createServer();
    const server = await serverPromise;

    const urlObj = new URL(req.url, "http://localhost");

    let path = urlObj.pathname || "/";
    if (path.startsWith("/api")) path = path.slice(4) || "/";

    const injectUrl = path + (urlObj.search || "");

    const payload =
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await readBody(req);

    const hapiRes = await server.inject({
      method: req.method,
      url: injectUrl,
      headers: req.headers,
      payload,
    });

    res.statusCode = hapiRes.statusCode;

    for (const [key, value] of Object.entries(hapiRes.headers || {})) {
      const lower = key.toLowerCase();

      if (lower === "content-length") continue;
      if (lower === "content-encoding") continue;
      if (lower === "transfer-encoding") continue;

      res.setHeader(key, value);
    }

    const body = Buffer.from(hapiRes.payload || "", "utf8");
    res.end(body);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        status: "error",
        message: "Maaf, terjadi kesalahan pada server kami.",
      })
    );
  }
};
