import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "docs/screenshots";
const outputDir = "docs/screenshots/optimized";

// ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const optimizeImage = async (filePath, outputPath) => {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // resize only if it's wider than 800px
    const width = metadata.width > 800 ? 800 : metadata.width;

    await image
      .resize({ width })
      .png({
        compressionLevel: 9, // 0–9 (higher = smaller file, slower)
        quality: 80, // 0–100 (affects alpha channel precision)
        adaptiveFiltering: true
      })
      .toFile(outputPath);

    console.log(`✅ Optimized: ${path.basename(filePath)} → ${outputPath}`);
  } catch (err) {
    console.error(`❌ Failed to optimize ${filePath}:`, err);
  }
};

const run = async () => {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".png"));

  if (files.length === 0) {
    console.log("No PNG files found in", inputDir);
    return;
  }

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file);
    await optimizeImage(inputPath, outputPath);
  }

  console.log("\n✨ All images optimized!");
};

run();
