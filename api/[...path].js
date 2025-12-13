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

    // /api/... -> ... (hapus prefix /api)
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

    // status
    res.statusCode = hapiRes.statusCode;

    // headers
    Object.entries(hapiRes.headers || {}).forEach(([k, v]) => {
      if (v !== undefined) res.setHeader(k, v);
    });

    // payload (Buffer/string)
    res.end(hapiRes.rawPayload ?? hapiRes.payload);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        status: "error",
        message: "Maaf, terjadi kesalahan pada server kami.",
      })
    );
  }
};
