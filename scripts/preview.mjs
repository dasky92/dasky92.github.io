#!/usr/bin/env node
/**
 * Local preview for docs/ — supports both *.html and extensionless paths,
 * and directory indexes. Avoids the relative-link traps of clean-URL rewrites.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "docs");
const PORT = Number(process.env.PORT || 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function safeJoin(root, urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const cleaned = path.normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const full = path.join(root, cleaned);
  if (!full.startsWith(root)) return null;
  return full;
}

function tryFile(filePath) {
  try {
    const st = fs.statSync(filePath);
    if (st.isFile()) return filePath;
  } catch {
    /* miss */
  }
  return null;
}

function resolve(urlPath) {
  let target = safeJoin(ROOT, urlPath);
  if (!target) return null;

  let hit = tryFile(target);
  if (hit) return hit;

  if (urlPath.endsWith("/")) {
    hit = tryFile(path.join(target, "index.html"));
    if (hit) return hit;
  } else {
    hit = tryFile(path.join(target, "index.html"));
    if (hit) return hit;
    hit = tryFile(`${target}.html`);
    if (hit) return hit;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url === "/" ? "/index.html" : req.url || "/";
  const file = resolve(urlPath);
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`404 Not Found: ${urlPath}\n`);
    return;
  }
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, () => {
  console.log(`Preview http://localhost:${PORT}/  (root: ${ROOT})`);
});
