import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = path.resolve("public/images/club/united");
const outputDirectory = path.resolve("public/media/club/united");
const selectedFiles = [
  "IMG_5631.jpeg",
  "IMG_5632.jpeg",
  "IMG_5633.jpeg",
  "IMG_5646.jpeg",
  "IMG_5649.jpeg",
  "IMG_5667.jpeg",
  "IMG_5655.jpeg",
  "IMG_5656.jpeg",
  "IMG_5662.jpeg",
  "IMG_5664.jpeg",
  "IMG_5666.jpeg",
  "IMG_5672.jpeg",
];

await fs.mkdir(outputDirectory, { recursive: true });

for (const file of selectedFiles) {
  const outputName = file.replace(/\.jpe?g$/i, "").toLowerCase().replace("_", "-") + ".webp";
  await sharp(path.join(sourceDirectory, file))
    .rotate()
    .resize({ width: 1800, height: 1800, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(outputDirectory, outputName));
  console.log(`${file} -> ${outputName}`);
}
