# pet-food-safety

**Vet-reviewed dataset: which foods and plants are safe, risky or dangerous for pets** — dogs, cats, rabbits & rodents, birds and reptiles.

![items](https://img.shields.io/badge/items-68-a1c44c) ![license](https://img.shields.io/badge/data-CC--BY--4.0-blue) ![reviewed](https://img.shields.io/badge/vet--reviewed-2026--08-4f7d1b)

Most "toxic foods for pets" lists online are copied from one another with no
medical review. This dataset is different: **every entry has been reviewed by
licensed veterinarians of the [BioVet](https://bio.vet) clinic network**
(20 round-the-clock clinics, Moscow) and is used in production by the live
checker at [bio.vet/mozhno-li](https://bio.vet/mozhno-li/).

## What's inside

One file — [`data/items.json`](data/items.json):

- **68 entries**: 39 foods, 29 house/garden plants
- **Per-species verdicts** (`safe` / `caution` / `danger`) for dogs, cats,
  rabbits & rodents, birds, reptiles
- **Bilingual**: names and notes in English and Russian
- **Mechanism of toxicity** where established (theobromine, xylitol, persin,
  grayanotoxins, colchicine, taxines…)
- **Sources** for every entry (ASPCA, Merck Veterinary Manual, FDA, clinical
  articles by BioVet veterinarians)

```json
{
  "id": "grapes-raisins",
  "category": "food",
  "names": { "en": ["grapes", "raisins"], "ru": ["виноград", "изюм"] },
  "verdicts": { "dog": "danger", "cat": "danger", "rabbit_rodent": "caution", "bird": "safe" },
  "toxin": "Unidentified nephrotoxin (tartaric acid suspected)",
  "notes": { "en": "Even a small amount can cause acute kidney failure…", "ru": "…" },
  "sources": ["https://www.aspca.org/…", "https://bio.vet/…"]
}
```

## Usage

```js
const { items } = await fetch(
  "https://cdn.jsdelivr.net/gh/xpressmike/pet-food-safety@main/data/items.json"
).then((r) => r.json());

const grape = items.find((i) => i.names.en.includes("grapes"));
console.log(grape.verdicts.dog); // "danger"
```

Or clone and validate locally:

```bash
node scripts/validate.mjs
```

## Verdict levels

| Level | Meaning |
|---|---|
| `safe` | Generally safe in moderation for a healthy animal |
| `caution` | Only with the restrictions described in notes — or better avoided |
| `danger` | Do not give; if ingested, contact a veterinarian |

A missing species key means the combination was not assessed — treat as
unknown, not as safe.

## Contributing

Pull requests are welcome — new items, new species verdicts, translations.
Two hard rules (see [CONTRIBUTING.md](CONTRIBUTING.md)):

1. every claim needs a **source** (peer-reviewed, ASPCA, Merck, FDA…);
2. entries are merged only after **review by BioVet veterinarians** — that is
   what keeps the "vet-reviewed" label honest.

## License & attribution

- **Data** (`data/`): [CC BY 4.0](LICENSE) — free to use, share and adapt
  **with attribution**: "Data: BioVet veterinary clinic network,
  [bio.vet](https://bio.vet)".
- **Code** (`scripts/`, `schema/`): [MIT](LICENSE-CODE).

## Disclaimer

Educational reference — not a substitute for veterinary care. If your pet has
eaten something dangerous, contact a veterinarian immediately. In Moscow:
[BioVet, 20 clinics, 24/7](https://bio.vet/kontakty/).
