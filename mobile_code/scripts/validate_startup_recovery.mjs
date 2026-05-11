import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const APP_URL = process.env.APP_URL || "http://127.0.0.1:4173";
const EXECUTABLE_PATH = process.env.PLAYWRIGHT_EXECUTABLE_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(SCRIPT_DIR, "../validation_artifacts");

await fs.mkdir(ARTIFACT_DIR, { recursive: true });

async function runScenario(kind) {
  const browser = await chromium.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true
  });
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });

  let healthFailures = 0;
  let catalogFailures = 0;

  await page.route("http://20.242.52.182:8080/health", async (route) => {
    if (kind === "health" && healthFailures === 0) {
      healthFailures += 1;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "backend_unavailable", message: "backend unavailable" } })
      });
      return;
    }
    await route.continue();
  });

  await page.route("http://20.242.52.182:8080/api/catalog", async (route) => {
    if (kind === "catalog" && catalogFailures === 0) {
      catalogFailures += 1;
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: { code: "catalog_unavailable", message: "catalog unavailable" } })
      });
      return;
    }
    await route.continue();
  });

  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await page.getByText(/Something went wrong/, { exact: false }).first().waitFor({ timeout: 15000 });
  const errorScreenshot = path.join(ARTIFACT_DIR, `startup_${kind}_error.png`);
  await page.screenshot({ path: errorScreenshot, fullPage: true });

  await page.getByText(/Retry|Coba lagi|আবার চেষ্টা করুন/, { exact: false }).first().click();
  await page
    .getByText(/Scan the chemical QR first|Imbas QR bahan kimia dahulu|আগে রাসায়নিকের QR স্ক্যান করুন|Pindai QR bahan kimia terlebih dahulu/, {
      exact: false
    })
    .first()
    .waitFor({ timeout: 15000 });
  const recoveredScreenshot = path.join(ARTIFACT_DIR, `startup_${kind}_recovered.png`);
  await page.screenshot({ path: recoveredScreenshot, fullPage: true });

  await browser.close();

  return {
    scenario: kind,
    errorScreenshot,
    recoveredScreenshot
  };
}

const results = [];
results.push(await runScenario("health"));
results.push(await runScenario("catalog"));
console.log(JSON.stringify(results, null, 2));
