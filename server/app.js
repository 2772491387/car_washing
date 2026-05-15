const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { URL } = require("node:url");

const bookings = require("./routes/bookings");
const health = require("./routes/health");

const port = Number(process.env.PORT || 3000);
const publicDir = path.resolve(__dirname, "..", "public");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 32768) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON body"));
      }
    });

    req.on("error", reject);
  });
}

function getStaticPath(requestPath) {
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  const decodedPath = decodeURIComponent(safePath);
  const filePath = path.resolve(publicDir, `.${decodedPath}`);

  if (!filePath.startsWith(publicDir)) {
    return null;
  }

  return filePath;
}

async function serveStatic(req, res, requestPath) {
  const filePath = getStaticPath(requestPath);

  if (!filePath) {
    sendJson(res, 400, { message: "Bad request" });
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const contentType = mimeTypes[path.extname(filePath)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch (error) {
    if (path.extname(requestPath)) {
      sendJson(res, 404, { message: "File not found" });
      return;
    }

    const fallback = await fs.readFile(path.join(publicDir, "index.html"));
    res.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    res.end(fallback);
  }
}

async function requestHandler(req, res) {
  const currentUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const requestPath = currentUrl.pathname;

  try {
    if (req.method === "GET" && requestPath === "/api/health") {
      health.handle(req, res, { sendJson });
      return;
    }

    if (req.method === "POST" && requestPath === "/api/bookings") {
      await bookings.create(req, res, { readJson, sendJson });
      return;
    }

    if (req.method === "GET" && requestPath === "/api/bookings") {
      bookings.list(req, res, { sendJson });
      return;
    }

    if (requestPath.startsWith("/api/")) {
      sendJson(res, 404, { message: "API route not found" });
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendJson(res, 405, { message: "Method not allowed" });
      return;
    }

    await serveStatic(req, res, requestPath);
  } catch (error) {
    const statusCode = error.statusCode || (error.message === "Invalid JSON body" ? 400 : 500);
    sendJson(res, statusCode, { message: error.message || "Internal server error" });
  }
}

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Car washing site is running at http://localhost:${port}`);
  });
}

module.exports = { server, requestHandler };
