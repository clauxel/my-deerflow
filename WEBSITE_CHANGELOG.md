# Website Changelog

## 2026-06-03 - Standalone SEO worker repair

- Updated Worker asset lookup to avoid directory-index redirect loops for sitemap URLs.
- Removed checkout from dynamic sitemap output while keeping checkout pages available for users.
- Expanded the Worker SEO allowlist to include sitemap-listed keyword landing pages where applicable.
- Deployment: pending per-site Worker deploy and live recheck.

## 2026-06-08 16:06:51 CST - SEO/GEO + Build Checklist Repair

Scope: repaired P0/P1 checklist issues for deerflow.site.

Touched files:
  - deerflow/dist/index.html
  - deerflow/dist/pricing/index.html
  - deerflow/dist/robots.txt

Verification: ran the shared SEO/GEO patrol fixer from the latest all-sites checklist input; 9router build also passed after shared route guard changes.

Deploy/Git status: pending commit, push, deploy, and post-deploy checklist rerun.

Follow-ups: re-run the all-sites SEO/GEO + build checklist after production deployment and keep any DNS/account-only blockers in the issue ledger.

## 2026-06-12 exposure rescue pages

- Added AI-readable and human-useful static intent pages for uncovered traffic terms: `DeerFlow AI research agent`.
- Replaced the old hidden SEO answer block with a readable first-packet fallback inside `#root` where an index shell exists.
- Refreshed pricing, checkout fallback, privacy, terms, sitemap, robots, and llms surfaces for the exposure-click rescue checklist.
- Verification pending: rebuild/deploy and rerun the exposure rescue checklist.
