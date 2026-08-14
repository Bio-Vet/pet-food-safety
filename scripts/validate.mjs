/**
 * Dependency-free validator for data/items.json.
 * Checks the essentials of schema/items.schema.json plus dataset-level rules
 * (unique ids, unique names). CI runs this on every push and pull request.
 */
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/items.json", import.meta.url), "utf8"));
const errors = [];
const err = (m) => errors.push(m);

const VERDICTS = new Set(["safe", "caution", "danger"]);
const SPECIES = new Set(["dog", "cat", "rabbit_rodent", "bird", "reptile", "ferret"]);

if (!data.meta?.name) err("meta.name missing");
if (!/^\d{4}-\d{2}$/.test(data.meta?.last_review ?? "")) err("meta.last_review must be YYYY-MM");
if (data.meta?.license !== "CC-BY-4.0") err("meta.license must be CC-BY-4.0");

const ids = new Set();
const seenNames = new Map();
for (const it of data.items ?? []) {
	const at = `item "${it.id ?? "?"}"`;
	if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id ?? "")) err(`${at}: bad id`);
	if (ids.has(it.id)) err(`${at}: duplicate id`);
	ids.add(it.id);
	if (!["food", "plant"].includes(it.category)) err(`${at}: bad category`);
	for (const lang of ["en", "ru"]) {
		if (!Array.isArray(it.names?.[lang]) || it.names[lang].length === 0) err(`${at}: names.${lang} empty`);
		if ((it.notes?.[lang] ?? "").length < 20) err(`${at}: notes.${lang} too short`);
		for (const n of it.names?.[lang] ?? []) {
			const key = `${lang}:${n.toLowerCase()}`;
			if (seenNames.has(key)) err(`${at}: name "${n}" (${lang}) already used by "${seenNames.get(key)}"`);
			seenNames.set(key, it.id);
		}
	}
	const verdicts = Object.entries(it.verdicts ?? {});
	if (verdicts.length === 0) err(`${at}: no verdicts`);
	for (const [sp, v] of verdicts) {
		if (!SPECIES.has(sp)) err(`${at}: unknown species "${sp}"`);
		if (!VERDICTS.has(v)) err(`${at}: bad verdict "${v}" for ${sp}`);
	}
	if (!Array.isArray(it.sources) || it.sources.length === 0) err(`${at}: sources required`);
	for (const s of it.sources ?? []) if (!/^https:\/\//.test(s)) err(`${at}: source must be https URL`);
}

if (errors.length) {
	console.error(`✗ ${errors.length} problem(s):`);
	for (const e of errors) console.error("  -", e);
	process.exit(1);
}
console.log(`✓ ${data.items.length} items valid (foods: ${data.items.filter((i) => i.category === "food").length}, plants: ${data.items.filter((i) => i.category === "plant").length})`);
