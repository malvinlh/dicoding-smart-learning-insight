// api/[...path].js
const createServer = require("../backend/src/createServer");

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
    for (const [k, v] of Object.entries(hapiRes.headers)) {
      if (v !== undefined) res.setHeader(k, v);
    }
    return res.end(hapiRes.rawPayload);
  } catch (err) {
    // IMPORTANT: make the error visible in Vercel logs
    console.error("FUNCTION_CRASH:", err);

    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        status: "error",
        message: "Serverless function crashed",
        detail: err?.message || String(err),
      })
    );
  }
};
