# Contributing

Thanks for helping make pet nutrition data safer and more accessible!

## Adding or changing an entry

1. Edit `data/items.json` following the shape in `schema/items.schema.json`.
2. **Every factual claim needs a source** — link peer-reviewed literature or
   recognized references (ASPCA Animal Poison Control, Merck Veterinary
   Manual, FDA, Pet Poison Helpline). Blog posts and AI-generated pages are
   not sources.
3. Run the validator: `node scripts/validate.mjs` (CI runs it too).
4. Open a pull request describing **what changed and why**, with the source
   quoted or summarized.

## Review gate

This dataset is labeled *vet-reviewed*, and we keep that label honest:
every PR that changes verdicts or notes is reviewed by licensed veterinarians
of the BioVet clinic network before merge. This can take a few days.

## Scope

- In scope: common human foods, treats, house and garden plants, per-species
  safety verdicts, mechanisms, typical symptoms.
- Out of scope (for now): medications, household chemicals, dosage
  calculators, breed-specific advice.

## Translations

`names` and `notes` are bilingual (en/ru). PRs adding further languages are
welcome — add a language key consistently across ALL items in one PR.
