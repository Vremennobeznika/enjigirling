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
