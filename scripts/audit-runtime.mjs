import { chromium } from "playwright";
const browser = await chromium.launch({ headless: true, channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
const events = [];
page.on("console", message => { if (["warning", "error"].includes(message.type())) events.push({ type: message.type(), text: message.text() }); });
page.on("pageerror", error => events.push({ type: "pageerror", text: error.message }));
page.on("response", response => { if (response.status() >= 400) events.push({ type: "http", text: `${response.status()} ${response.url()}` }); });
const response = await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
const bodyAttributes = await page.locator("body").evaluate((body) =>
  Object.fromEntries([...body.attributes].map(({ name, value }) => [name, value])),
);
console.log(JSON.stringify({ status: response?.status(), title: await page.title(), bodyAttributes, events }, null, 2));
await browser.close();
