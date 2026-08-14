/**
 * Generates BioVet's site checker format (src/data/food-check.json) from this
 * dataset — the repo is the upstream source of truth, the site consumes it.
 *
 * Usage: node scripts/build-biovet-site.mjs [path/to/current/food-check.json]
 * The current site file (optional) is only used to carry over presentation
 * icons; verdicts, names and notes always come from the dataset.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../data/items.json", import.meta.url), "utf8"));
const prevPath = process.argv[2];
const prev = prevPath && existsSync(prevPath) ? JSON.parse(readFileSync(prevPath, "utf8")) : { items: [], plants: [] };

const SPECIES = { dog: "sobaka", cat: "koshka", rabbit_rodent: "gryzun", bird: "ptitsa", reptile: "reptiliya" };

const iconByName = new Map();
for (const it of [...(prev.items ?? []), ...(prev.plants ?? [])]) {
	if (it.icon) for (const n of it.names) iconByName.set(n, it.icon);
}

const convert = (it) => {
	const out = { names: it.names.ru };
	for (const [en, ruKey] of Object.entries(SPECIES)) {
		if (it.verdicts[en]) out[ruKey] = it.verdicts[en] === "caution" ? "caution" : it.verdicts[en];
	}
	out.icon = iconByName.get(it.names.ru[0]) ?? (it.category === "plant" ? "flower" : "utensils");
	out.note = it.notes.ru;
	const own = (it.sources ?? []).find((s) => s.startsWith("https://bio.vet/"));
	out.url = own ? own.replace("https://bio.vet", "") : "/chto-delat/";
	return out;
};

const result = {
	_comment: "GENERATED from github.com/xpressmike/pet-food-safety — edit there, not here. Rebuild: node scripts/build-biovet-site.mjs",
	items: data.items.filter((i) => i.category === "food").map(convert),
	plants: data.items.filter((i) => i.category === "plant").map(convert),
};

const outPath = new URL("../dist-food-check.json", import.meta.url);
writeFileSync(outPath, JSON.stringify(result, null, 1), "utf8");
console.log(`✓ dist-food-check.json: ${result.items.length} foods + ${result.plants.length} plants`);
