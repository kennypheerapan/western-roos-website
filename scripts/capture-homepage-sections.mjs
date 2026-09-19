import fs from "node:fs/promises";
import { chromium } from "playwright";

const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
const page = await browser.newPage();
await fs.mkdir("test-results/sections", { recursive: true });

const sections = {
  hero: ".hero",
  news: ".news-section",
  beyond: ".beyond-section",
  gallery: ".gallery-grid",
  join: ".join-section",
};

for (const [viewport, width, height] of [
  ["mobile-375", 375, 812],
  ["mobile-430", 430, 932],
  ["tablet", 768, 1024],
  ["desktop", 1920, 1080],
  ["large-desktop", 2560, 1440],
]) {
  await page.setViewportSize({ width, height });
  await page.goto("http://127.0.0.1:3000", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (const [name, selector] of Object.entries(sections)) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({ path: `test-results/sections/${viewport}-${name}.png` });
  }
}

await browser.close();
console.log("Captured homepage section review images.");
