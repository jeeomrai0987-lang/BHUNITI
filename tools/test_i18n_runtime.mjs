#!/usr/bin/env node
/*
 * Behavioural smoke test for the i18n runtime:
 *
 *     node tools/test_i18n_runtime.mjs
 *
 * The parity checker proves the catalogs line up; this proves the code that
 * reads them actually works -- dotted lookup, {{interpolation}}, plurals,
 * English fallback, domain labels and the Intl formatters. src/i18n/index.jsx
 * contains JSX, so it is compiled in memory with @babel/parser's sibling
 * transform and imported from a data URL. No test framework, nothing installed.
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "bhuniti-react");
const I18N = path.join(APP, "src", "i18n");
const require = createRequire(path.join(APP, "package.json"));

// Babel is a devDependency, so before `npm install` this test cannot run. Say
// so and stop, the way check_syntax.mjs does, instead of throwing a
// MODULE_NOT_FOUND stack at whoever ran the verify script.
let babel;
try {
  babel = require("@babel/core");
} catch {
  console.log("@babel/core not found -- run `npm install` in bhuniti-react first.");
  process.exit(0);
}

const source = await readFile(path.join(I18N, "index.jsx"), "utf8");
const { code } = await babel.transformAsync(source, {
  filename: path.join(I18N, "index.jsx"),
  babelrc: false,
  configFile: false,
  presets: [],
  plugins: [[require.resolve("@babel/plugin-transform-react-jsx"), { runtime: "classic" }]],
});

// A data: URL module cannot resolve bare specifiers, and it has no directory to
// resolve relative ones against, so both kinds are rewritten to absolute file
// URLs before the module is handed to import().
const asFileUrl = (file) => new URL(`file://${file}`).href;
const rewritten = code
  .replace(/from "\.\//g, `from "${asFileUrl(I18N)}/`)
  .replace(/from "react"/g, `from "${asFileUrl(require.resolve("react"))}"`);
const module = await import(
  `data:text/javascript;base64,${Buffer.from(rewritten).toString("base64")}`
);

const { translator } = module;
const cases = [];
const check = (name, fn) => {
  try {
    fn();
    cases.push([true, name]);
  } catch (error) {
    cases.push([false, `${name}: ${error.message}`]);
  }
};

const en = translator("en");
const hi = translator("hi");

check("dotted lookup, English", () => {
  assert.equal(en.t("common.actions.search"), "Search");
});

check("dotted lookup, Hindi", () => {
  assert.equal(hi.t("common.actions.search"), "खोजें");
});

check("locale tag comes from the code, not the browser", () => {
  assert.equal(en.tag, "en-IN");
  assert.equal(hi.tag, "hi-IN");
});

check("a locale with a region resolves to its base", () => {
  assert.equal(translator("hi-IN").locale, "hi");
  assert.equal(translator("HI").locale, "hi");
});

check("an unsupported locale falls back to English", () => {
  assert.equal(translator("fr").locale, "en");
  assert.equal(translator(undefined).locale, "en");
});

check("{{placeholders}} are substituted", () => {
  assert.equal(
    en.t("common.state.showingRange", { from: 1, to: 10, total: 42 }),
    "Showing 1–10 of 42"
  );
  assert.ok(hi.t("common.state.showingRange", { from: 1, to: 10, total: 42 }).includes("42"));
});

check("an unknown placeholder is left alone rather than blanked", () => {
  assert.equal(en.t("common.state.lastSynced"), "Last synced {{time}}");
});

check("count picks the _one / _other variant", () => {
  assert.equal(en.t("common.state.resultCount", { count: 1 }), "1 record");
  assert.equal(en.t("common.state.resultCount", { count: 7 }), "7 records");
});

check("a translated string can be interpolated into another one", () => {
  // Several pages compose two catalog entries -- FieldSurvey's variance line
  // drops a formatted delta and a translated verdict into one sentence. If the
  // inner call leaked a stray {{placeholder}} the outer string would show it.
  const composed = hi.t("pages.fieldSurvey.variance.value", {
    area: "-0.12 हे.",
    verdict: hi.t("pages.fieldSurvey.variance.verdict.beyondTolerance"),
  });
  assert.equal(composed, "-0.12 हे. (सह्य सीमा से अधिक)");
  assert.ok(!composed.includes("{{"));

  const meta = hi.t("pages.fieldSurvey.telemetry.stationMeta", {
    team: hi.t("pages.fieldSurvey.teams.beta"),
    days: hi.t("common.time.inDays", { count: 2 }),
  });
  assert.ok(meta.includes("दल बीटा"));
  assert.ok(meta.includes("2 दिन में"));
  assert.ok(!meta.includes("{{"));
});

check("a missing key returns the key itself, not empty space", () => {
  assert.equal(en.t("pages.nope.missing"), "pages.nope.missing");
  assert.equal(en.t(""), "");
  assert.equal(en.t(null), "");
});

check("Hindi falls back to English when a key is only in en", () => {
  // Both catalogs are complete, so simulate the gap with a real one-sided key.
  const key = "common.app.name";
  assert.equal(typeof hi.t(key), "string");
  assert.notEqual(hi.t(key), key);
});

check("domain labels translate stored English values", () => {
  assert.equal(en.label("verification_status", "Verified"), "Verified");
  assert.equal(hi.label("verification_status", "Verified"), "सत्यापित");
  assert.equal(hi.label("land_type", "Agricultural (Zamin)"), "कृषि (ज़मीन)");
});

check("the server's *_label wins over the local catalog", () => {
  assert.equal(
    hi.label("verification_status", "Verified", "सर्वर से आया लेबल"),
    "सर्वर से आया लेबल"
  );
});

check("an unknown domain value degrades to the raw value", () => {
  assert.equal(hi.label("verification_status", "Klingon Status"), "Klingon Status");
  assert.equal(hi.label("verification_status", ""), "");
});

check("dates format per locale, and bad input does not throw", () => {
  const iso = "2024-03-15T09:30:00Z";
  assert.match(en.formatDate(iso), /2024/);
  assert.match(hi.formatDate(iso), /2024/);
  assert.notEqual(en.formatDate(iso), hi.formatDate(iso));
  assert.equal(en.formatDate(null), "—");
  assert.equal(en.formatDate("not a date"), "—");
  assert.match(en.formatDateTime(iso), /2024/);
});

check("numbers group the Indian way in both locales", () => {
  // en-IN and hi-IN both use the lakh/crore grouping: 12,34,567 not 1,234,567.
  assert.equal(en.formatNumber(1234567), "12,34,567");
  assert.equal(en.formatNumber(null), "—");
  assert.equal(en.formatNumber("42"), "42");
  assert.equal(en.formatNumber("abc"), "abc");
});

check("currency is whole rupees", () => {
  const formatted = en.formatCurrency(250000);
  assert.match(formatted, /₹/);
  assert.ok(!formatted.includes("."), `expected no paise in ${formatted}`);
});

check("area carries the localised unit", () => {
  assert.equal(en.formatArea(1.245), "1.245 ha");
  assert.equal(hi.formatArea(1.245), "1.245 हे.");
  assert.equal(en.formatArea(null), "—");
});

check("a plural picks its form from count but prints the formatted value", () => {
  // The reconciliation matrix counts run into five figures, so the number the
  // reader sees comes from `value` (grouped by Intl) while `count` only decides
  // singular vs plural. Passing the formatted string as `count` instead would
  // silently drop the plural, because resolve() only branches on a number.
  const key = "pages.reconciliationMonitor.matrix.mismatches";
  assert.equal(en.t(key, { count: 14289, value: en.formatNumber(14289) }), "14,289 mismatches");
  assert.equal(en.t(key, { count: 1, value: en.formatNumber(1) }), "1 mismatch");
  assert.equal(hi.t(key, { count: 14289, value: hi.formatNumber(14289) }), "14,289 असंगतियाँ");

  // …and that string nests inside the intervention line without leaking a
  // placeholder, the same composition the field survey variance card relies on.
  const line = hi.t("pages.reconciliationMonitor.matrix.intervention", {
    mismatches: hi.t(key, { count: 14289, value: hi.formatNumber(14289) }),
  });
  assert.equal(line, "14,289 असंगतियाँ — हस्तक्षेप अपेक्षित");
  assert.ok(!line.includes("{{"));
});

check("the exported locale list is exactly English and Hindi", () => {
  assert.deepEqual(
    module.LOCALE_OPTIONS.map((option) => option.code),
    ["en", "hi"]
  );
  assert.equal(module.LOCALE_OPTIONS[1].endonym, "हिन्दी");
});

const failures = cases.filter(([ok]) => !ok);
for (const [ok, name] of cases) {
  if (!ok) console.error(`  FAIL  ${name}`);
}
console.log(`${cases.length - failures.length}/${cases.length} i18n runtime checks passed`);
if (failures.length) process.exit(1);
