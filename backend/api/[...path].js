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

    // Copy headers (biarkan content-encoding kalau memang ada)
    for (const [key, value] of Object.entries(hapiRes.headers || {})) {
      const lower = key.toLowerCase();
      if (lower === "content-length") continue;      // biar Node hitung sendiri
      if (lower === "transfer-encoding") continue;   // hindari konflik
      res.setHeader(key, value);
    }

    // Kalau ada kompresi, body yang benar adalah rawPayload (bytes),
    // bukan hapiRes.payload (string yang sudah “terdecode”).
    const isCompressed = !!hapiRes.headers?.["content-encoding"];
    const body = isCompressed
      ? hapiRes.rawPayload // Buffer
      : Buffer.from(hapiRes.payload || "", "utf8");

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
