import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, normalize, relative, sep } from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "127.0.0.1";
const clients = new Set();
const watchedRoots = ["index.html", "styles.css", "script.js", "assets", "src/js"];
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let reloadTimer;
let sassProcess;
let lastSnapshot = "";
let scanInProgress = false;

const liveReloadScript = `
<script>
  (() => {
    const events = new EventSource("/__dev_reload");
    events.addEventListener("reload", () => window.location.reload());
  })();
</script>`;

function isSafePath(filePath) {
  const normalized = normalize(filePath);
  const pathFromRoot = relative(rootDir, normalized);
  return pathFromRoot && !pathFromRoot.startsWith(`..${sep}`) && pathFromRoot !== "..";
}

function sendReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const response of clients) {
      response.write("event: reload\ndata: changed\n\n");
    }
  }, 80);
}

async function serveHtml(response, filePath) {
  const html = await readFile(filePath, "utf8");
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[".html"],
  });
  response.end(html.replace("</body>", `${liveReloadScript}\n  </body>`));
}

function serveFile(response, filePath) {
  const extension = extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": mimeTypes[extension] || "application/octet-stream",
  });
  createReadStream(filePath).pipe(response);
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  let filePath = join(rootDir, requestedPath);

  if (!isSafePath(filePath)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  if (!extname(pathname)) {
    return join(rootDir, "index.html");
  }

  return null;
}

const server = createServer(async (request, response) => {
  if (request.url === "/__dev_reload") {
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
    });
    response.write("\n");
    clients.add(response);
    request.on("close", () => clients.delete(response));
    return;
  }

  try {
    const filePath = resolveRequestPath(request.url || "/");

    if (!filePath) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    if (extname(filePath).toLowerCase() === ".html") {
      await serveHtml(response, filePath);
      return;
    }

    serveFile(response, filePath);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Server error");
  }
});

async function collectFileState(pathToScan, state = []) {
  const fullPath = join(rootDir, pathToScan);

  if (!existsSync(fullPath)) {
    return state;
  }

  const stats = statSync(fullPath);

  if (stats.isFile()) {
    state.push(`${pathToScan}:${stats.mtimeMs}:${stats.size}`);
    return state;
  }

  if (!stats.isDirectory()) {
    return state;
  }

  for (const entry of await readdir(fullPath, { withFileTypes: true })) {
    await collectFileState(join(pathToScan, entry.name), state);
  }

  return state;
}

async function getSnapshot() {
  const state = [];

  for (const pathToScan of watchedRoots) {
    await collectFileState(pathToScan, state);
  }

  return state.sort().join("\n");
}

async function scanForChanges() {
  if (scanInProgress) {
    return;
  }

  scanInProgress = true;

  try {
    const snapshot = await getSnapshot();

    if (lastSnapshot && snapshot !== lastSnapshot) {
      sendReload();
    }

    lastSnapshot = snapshot;
  } catch (error) {
    console.error(`[dev] file scan failed: ${error instanceof Error ? error.message : error}`);
  } finally {
    scanInProgress = false;
  }
}

async function startFileWatcher() {
  lastSnapshot = await getSnapshot();
  setInterval(scanForChanges, 400);
}

function startSassWatcher() {
  const sassBinary = process.platform === "win32"
    ? join(rootDir, "node_modules", ".bin", "sass.cmd")
    : join(rootDir, "node_modules", ".bin", "sass");

  if (!existsSync(sassBinary)) {
    console.warn("[dev] sass is not installed. Run npm install if styles do not rebuild.");
    return;
  }

  sassProcess = spawn(sassBinary, [
    "src/scss/main.scss",
    "styles.css",
    "--watch",
    "--no-source-map",
  ], {
    stdio: "inherit",
  });
}

process.on("SIGINT", () => {
  sassProcess?.kill("SIGINT");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  sassProcess?.kill("SIGTERM");
  server.close(() => process.exit(0));
});

await startFileWatcher();
startSassWatcher();

server.on("error", (error) => {
  if ("code" in error && error.code === "EADDRINUSE") {
    console.error(`[dev] port ${port} is already in use. Try PORT=3001 npm run dev`);
    process.exit(1);
  }

  console.error(`[dev] server failed: ${error instanceof Error ? error.message : error}`);
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`[dev] http://${host}:${port}`);
});
