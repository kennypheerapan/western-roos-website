import { chromium } from "playwright";
import fs from "node:fs";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const report = [];
  fs.mkdirSync("test-results", { recursive: true });
  for (const [name, width, height] of [
    ["mobile-375", 375, 812],
    ["mobile-430", 430, 932],
    ["tablet", 768, 1024],
    ["laptop", 1366, 900],
    ["desktop", 1920, 1080],
    ["large-desktop", 2560, 1440],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005'), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    if (overflow) throw new Error(name + " horizontal overflow");
    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(image => image.decode());
    }
    await page.waitForLoadState("networkidle");
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.getAttribute("src")),
      );
    if (brokenImages.length)
      throw new Error(`${name} broken images: ${brokenImages.join(", ")}`);
    if ((await page.locator(".club-life-home .event-empty").count()) !== 1)
      throw new Error(`${name} missing Club Life empty state`);
    await page.screenshot({
      path: "test-results/" + name + ".png",
      fullPage: true,
    });
    report.push({
      viewport: name,
      width,
      height,
      horizontalOverflow: overflow,
    });
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Menu" }).click();
  if (
    (await page
      .getByRole("button", { name: "Close" })
      .getAttribute("aria-expanded")) !== "true"
  )
    throw new Error("Menu did not open");
  await page.keyboard.press("Escape");
  if (
    (await page
      .getByRole("button", { name: "Menu" })
      .getAttribute("aria-expanded")) !== "false"
  )
    throw new Error("Escape did not close menu");
  await page.getByRole("button", { name: "Menu" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Pathways", exact: true })
    .click();
  await page.waitForURL("**/clubs");
  if (
    (await page
      .getByRole("button", { name: "Menu" })
      .getAttribute("aria-expanded")) !== "false"
  )
    throw new Error("Navigation did not close menu");
  await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005'));
  const links = await page
    .locator('a[href^="/"]')
    .evaluateAll((els) => [
      ...new Set(els.map((e) => e.getAttribute("href").split("#")[0])),
    ]);
  for (const href of links) {
    const response = await page.request.get((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005') + href);
    if (!response.ok()) throw new Error(href + " " + response.status());
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  if (
    (await page
      .locator(".hero-content")
      .evaluate((el) => getComputedStyle(el).animationName)) !== "none"
  )
    throw new Error("Reduced motion failed");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addStyleTag({ content: "html{font-size:200%}" });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  ) {
    console.log(
      await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((e) => e.scrollWidth > e.clientWidth + 1)
          .map((e) => ({
            tag: e.tagName,
            cls: e.className,
            width: e.clientWidth,
            scroll: e.scrollWidth,
            overflow: getComputedStyle(e).overflow,
          }))
          .slice(0, 30),
      ),
    );
    throw new Error("200% text horizontal overflow");
  }
  if (errors.length) throw new Error(errors.join("\n"));
  fs.writeFileSync(
    "test-results/report.json",
    JSON.stringify(
      {
        viewports: report,
        mobileMenu: "passed",
        escape: "passed",
        navigation: "passed",
        internalLinks: links.length,
        reducedMotion: "passed",
        textZoom: "passed",
        consoleErrors: errors,
      },
      null,
      2,
    ),
  );
  await browser.close();
  console.log(
    "PASS: responsive viewports, menu, Escape, navigation, links, reduced motion and text zoom.",
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
