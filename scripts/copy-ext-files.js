// scripts/copy-vendor-files.js

import { existsSync, mkdirSync, statSync, copyFileSync } from "fs";
import { dirname, resolve } from "path";

// Define files to copy
const filesToCopy = [
  {
    from: "node_modules/apexcharts/dist/apexcharts.min.js",
    to: "./app/frontend/public/ext/apexcharts.js"
  },
  {
    from: "node_modules/dompurify/dist/purify.min.js",
    to: "./app/frontend/public/ext/purify.js"
  }
];

// Ensure target directory exists
function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Compare file modification times
function shouldCopy(source, destination) {
  try {
    const srcStat = statSync(source);
    const destStat = statSync(destination);
    return srcStat.mtime > destStat.mtime;
  } catch (err) {
    if (err.code === "ENOENT") return true;
    throw err;
  }
}

// Copy file if needed
function copyFile(from, to) {
  ensureDir(dirname(to));

  if (shouldCopy(from, to)) {
    copyFileSync(from, to);
    console.log(`Copied: ${from} → ${to}`);
  } else {
    console.log(`Skipped (up to date): ${to}`);
  }
}

// Run for all files
filesToCopy.forEach(({ from, to }) => {
  const sourcePath = resolve(from);
  const destPath = resolve(to);
  try {
    copyFile(sourcePath, destPath);
  } catch (err) {
    console.error(`Failed to copy ${from}:`, err.message);
  }
});
