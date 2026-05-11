import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const APP_URL = process.env.APP_URL || "http://127.0.0.1:4173";
const EXECUTABLE_PATH = process.env.PLAYWRIGHT_EXECUTABLE_PATH || "/Applications/Arc.app/Contents/MacOS/Arc";
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ARTIFACT_DIR = path.resolve(SCRIPT_DIR, "../validation_artifacts");

await fs.mkdir(ARTIFACT_DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath: EXECUTABLE_PATH,
  headless: true
});

async function waitForAny(page, labels, timeout = 6000) {
  for (const label of labels) {
    const locator = page.getByText(label, { exact: false }).first();
    try {
      await locator.waitFor({ timeout });
      return locator;
    } catch {
      // try next
    }
  }
  throw new Error(`Could not find any expected text: ${labels.join(", ")}`);
}

async function chooseLanguage(page, languageButton) {
  await waitForAny(page, ["Choose language", "Pilih bahasa", "ভাষা বেছে নিন"]);
  await page.getByText(languageButton, { exact: false }).first().click();
  await page.getByText(/Continue|Teruskan|এগিয়ে যান|Lanjut/, { exact: false }).first().click();
}

async function openManualPicker(page) {
  await waitForAny(page, [
    "Scan the chemical QR first",
    "Imbas QR bahan kimia dahulu",
    "আগে রাসায়নিকের QR স্ক্যান করুন",
    "Pindai QR bahan kimia terlebih dahulu"
  ]);
  await page.getByText(/Choose chemical manually|Pilih bahan kimia secara manual|হাতে রাসায়নিক বেছে নিন|Pilih bahan kimia manual/, { exact: false }).last().click();
  await waitForAny(page, ["Back to QR", "Kembali ke QR", "QR-এ ফিরে যান"]);
}

async function fillIncident(page, prompt) {
  const textbox = page.locator("textarea, input").first();
  await textbox.fill(prompt);
  await page.getByText(/Get emergency response|Dapatkan respons darurat|জরুরি প্রতিক্রিয়া নিন|Dapatkan respons kecemasan/, { exact: false }).first().click();
}

async function captureFlow({ name, languageButton, chemicalLabel, prompt, expectedModeText, expectedFallback }) {
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  await page.goto(APP_URL, { waitUntil: "networkidle" });
  await chooseLanguage(page, languageButton);
  await openManualPicker(page);
  await page.getByText(chemicalLabel, { exact: false }).first().click();
  await waitForAny(page, ["What happened?", "Apa yang berlaku?", "কি হয়েছে?", "Apa yang terjadi?"]);
  await fillIncident(page, prompt);
  const screenshotPath = path.join(ARTIFACT_DIR, `${name}.png`);
  let bodyText = "";
  try {
    await waitForAny(page, [expectedModeText], 35000);
    bodyText = await page.locator("body").innerText();
  } catch (error) {
    bodyText = await page.locator("body").innerText();
    await page.screenshot({ path: screenshotPath, fullPage: true });
    throw new Error(`${error instanceof Error ? error.message : String(error)}\n\nPAGE TEXT\n${bodyText}`);
  }
  await page.screenshot({ path: screenshotPath, fullPage: true });

  if (!bodyText.includes(expectedModeText)) {
    throw new Error(`Expected mode text not found for ${name}`);
  }
  if (expectedFallback && !bodyText.includes(expectedFallback)) {
    throw new Error(`Expected fallback text not found for ${name}`);
  }

  await page.close();
  return {
    name,
    screenshot: screenshotPath,
    mode: expectedModeText,
    fallbackObserved: Boolean(expectedFallback)
  };
}

const results = [];

results.push(
  await captureFlow({
    name: "full_guided_english",
    languageButton: "English",
    chemicalLabel: "Roundup / Glyphosate",
    prompt: "spray went in my eye",
    expectedModeText: "Full guided response"
  })
);

results.push(
  await captureFlow({
    name: "guarded_bangla",
    languageButton: "বাংলা",
    chemicalLabel: "বাস্টা / গ্লুফোসিনেট",
    prompt: "মুখে গেছে",
    expectedModeText: "সতর্ক ন্যূনতম প্রতিক্রিয়া",
    expectedFallback: "এই প্রতিক্রিয়া সতর্ক কেন"
  })
);

await browser.close();

console.log(JSON.stringify(results, null, 2));
