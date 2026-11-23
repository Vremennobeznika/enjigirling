# Academy recovery checkpoint — 2026-11-23

Branch: `fix/academy-safety-regression-20261123` (based on `main`).

## Verified and committed
- Compared `main` with historical commit `f300c66`.
- Confirmed that `main` had zero `Граница безопасности` paragraphs in three academy HTML files while `f300c66` contained 13 + 12 + 24.
- Restored exactly 49 original safety paragraphs by lesson ID, preserving the newer lesson text, engineering-decision sections and concept checks in `main`.
- Normalized U+2212 mathematical minus to ASCII minus in all three academy JS answer-input parsers.

## Not yet completed / do not claim PASS
- Full independent subject-matter verification of 49 lessons against accessible primary sources.
- Independent safety certification.
- Independent re-solving and auditing of all 98 exercises in this branch.
- Running Node test suite and browser E2E against this branch.
- Auditing paid-standard source links and Q03 wording.
- Final release gate and production deployment.

Do not merge as an attested release. Preserve the working branch and continue with evidence-based tests. No Wikipedia.

## Subsequent saved fixes
- Clarified both Q03 exercise statements: independent standard uncertainties and +1/+1 sensitivity coefficients.
- Added `tests/academy-regression-recovery.cjs` as a regression guard for 49 safety notes, all three U+2212 parsers and Q03 assumptions. **Test added, NOT RUN** in this environment.
- PR #48 is a draft and is not merged into `main`.

## QA continuation
- The production `main` academy HTML/JS files were removed on user request; the academy remains unpublished. `main` CI academy-specific checks now skip when the academy index is absent (commit `7df87f7`).
- Academy PR branch CI now invokes `tests/academy-regression-recovery.cjs`.
- `tests/academy-runtime.cjs` now actually submits U+2212 negative answers in all three JS modules.
- Locally ran a **reconstructed probe based on the archived project with the same normalization and test change**: PASS 422 runtime assertions. This is not an execution of the exact PR branch; branch CI must still run.
- Full primary-source and independent safety review remain BLOCKED. No production release.
