import {
  existsSync,
  mkdirSync,
  statSync,
  copyFileSync,
  readFileSync,
  writeFileSync
} from "fs";
import { dirname, resolve } from "path";

const filesToCopy = [
  {
    from: "node_modules/apexcharts/dist/apexcharts.min.js",
    to: "./app/frontend/public/ext/apexcharts.js"
  },
  {
    from: "node_modules/dompurify/dist/purify.min.js",
    to: "./app/frontend/public/ext/purify.js",
    stripSourceMap: true
  },
  {
    from: "node_modules/i18next/dist/umd/i18next.min.js",
    to: "./app/frontend/public/ext/i18next.js"
  }
];

function ensureDir(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

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

function copyFile(from, to, stripSourceMap = false) {
  ensureDir(dirname(to));

  if (shouldCopy(from, to)) {
    copyFileSync(from, to);

    if (stripSourceMap) {
      try {
        let content = readFileSync(to, "utf8");
        content = content.replace(/\/\/# sourceMappingURL=.*\n?$/, "");
        writeFileSync(to, content, "utf8");
        console.log(`Copied and stripped source map: ${from} → ${to}`);
      } catch (err) {
        console.warn(`Failed to strip source map from ${to}:`, err.message);
      }
    } else {
      console.log(`Copied: ${from} → ${to}`);
    }
  } else {
    console.log(`Skipped (up to date): ${to}`);
  }
}

filesToCopy.forEach(({ from, to, stripSourceMap }) => {
  const sourcePath = resolve(from);
  const destPath = resolve(to);
  try {
    copyFile(sourcePath, destPath, stripSourceMap);
  } catch (err) {
    console.error(`Failed to copy ${from}:`, err.message);
  }
});
