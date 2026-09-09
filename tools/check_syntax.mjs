#!/usr/bin/env node
/*
 * Parse every source file and report syntax errors:
 *
 *     node tools/check_syntax.mjs
 *
 * `node --check` cannot do this -- it rejects JSX outright -- and a full
 * `vite build` needs platform-native esbuild/rollup binaries, which are not
 * always installable. @babel/parser is pure JavaScript and arrives with
 * @vitejs/plugin-react, so this works anywhere `npm install` has run.
 *
 * It checks that each file parses as an ES module with JSX, and that nothing
 * imports a path that does not exist on disk. It is not a type checker.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const APP = path.join(ROOT, "bhuniti-react");
const SRC = path.join(APP, "src");

const require = createRequire(path.join(APP, "package.json"));

let parser;
try {
  parser = require("@babel/parser");
} catch {
  console.error(
    "@babel/parser not found -- run `npm install` in bhuniti-react first."
  );
  process.exit(2);
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (/\.(js|jsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

async function exists(candidate) {
  try {
    await stat(candidate);
    return true;
  } catch {
    return false;
  }
}

/** Vite's default resolution order for an extensionless relative import. */
const EXTENSIONS = ["", ".js", ".jsx", ".json", "/index.js", "/index.jsx"];

const files = (await walk(SRC)).concat([
  path.join(APP, "vite.config.js"),
  path.join(APP, "tailwind.config.js"),
  path.join(APP, "postcss.config.js"),
]);

const errors = [];
let parsed = 0;
let checkedImports = 0;

for (const file of files) {
  if (!(await exists(file))) continue;
  const relative = path.relative(APP, file);
  const source = await readFile(file, "utf8");

  let ast;
  try {
    ast = parser.parse(source, {
      sourceType: "module",
      sourceFilename: relative,
      plugins: ["jsx", "importMeta", "topLevelAwait", "dynamicImport"],
    });
    parsed += 1;
  } catch (error) {
    errors.push(`${relative}: ${error.message}`);
    continue;
  }

  // Relative imports only: bare specifiers are npm packages, and resolving
  // those properly means reading every package.json "exports" map.
  const specifiers = [];
  for (const node of ast.program.body) {
    if (node.type === "ImportDeclaration") specifiers.push(node.source);
    else if (
      (node.type === "ExportNamedDeclaration" || node.type === "ExportAllDeclaration") &&
      node.source
    ) {
      specifiers.push(node.source);
    }
  }

  for (const node of specifiers) {
    const specifier = node.value;
    if (!specifier.startsWith(".")) continue;
    if (/\.(css|svg|png|jpe?g|webp|gif)$/.test(specifier)) {
      // Vite handles asset imports; just confirm the file is really there.
      const asset = path.resolve(path.dirname(file), specifier);
      checkedImports += 1;
      if (!(await exists(asset))) {
        errors.push(`${relative}:${node.loc.start.line}: missing asset ${specifier}`);
      }
      continue;
    }
    const base = path.resolve(path.dirname(file), specifier);
    let found = false;
    for (const extension of EXTENSIONS) {
      if (await exists(base + extension)) {
        found = true;
        break;
      }
    }
    checkedImports += 1;
    if (!found) {
      errors.push(`${relative}:${node.loc.start.line}: cannot resolve "${specifier}"`);
    }
  }
}

console.log(`parsed ${parsed} files, resolved ${checkedImports} relative imports`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}
console.log("syntax OK");
