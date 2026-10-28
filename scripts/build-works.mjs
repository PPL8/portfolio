import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const worksDir = path.join(root, "content", "works");
const outFile = path.join(root, "data", "works.js");
const files = (await readdir(worksDir)).filter((name) => name.endsWith(".json")).sort();
const all = [];
const ids = new Set();

for (const file of files) {
  const fullPath = path.join(worksDir, file);
  const item = JSON.parse(await readFile(fullPath, "utf8"));
  if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`Invalid work object: ${file}`);
  for (const field of ["id", "title", "mediaType", "category", "imagePath"]) {
    if (typeof item[field] !== "string" || !item[field].trim()) throw new Error(`Missing ${field} in ${file}`);
  }
  if (!["art", "video", "animation"].includes(item.mediaType)) throw new Error(`Unsupported mediaType in ${file}: ${item.mediaType}`);
  if (ids.has(item.id)) throw new Error(`Duplicate work id: ${item.id}`);
  ids.add(item.id);
  item.order = Number.isFinite(Number(item.order)) ? Number(item.order) : 100;
  item.published = item.published !== false;
  item.featured = item.featured !== false;
  item.tags = Array.isArray(item.tags) ? item.tags : [];
  all.push(item);
}

const sortWorks = (a, b) => (a.order - b.order) || a.title.localeCompare(b.title, "ko");
const published = all.filter((item) => item.published);
const result = {
  art: published.filter((item) => item.mediaType === "art").sort(sortWorks),
  video: published.filter((item) => item.mediaType === "video").sort(sortWorks),
  animation: published.filter((item) => item.mediaType === "animation").sort(sortWorks),
};
await mkdir(path.dirname(outFile), { recursive: true });
const payload = "/* Generated from content/works/*.json. Do not edit manually. */\nwindow.PORTFOLIO_WORKS = " + JSON.stringify(result, null, 2) + ";\n";
await writeFile(outFile, payload, "utf8");
console.log(`Validated ${all.length} works; publishing ${published.length} (${result.art.length} illustration, ${result.video.length} video, ${result.animation.length} animation).`);
