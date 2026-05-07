# DeerFlow AI

Conversion-focused SaaS site for `deerflow.site`, built with Vite, React, Cloudflare Workers, Cloudflare Pages, and Creem hosted checkout.

## What is included

- Product-first homepage with an interactive DeerFlow mission planner.
- Useful inner pages for DeerFlow AI, Docker, GitHub, Reddit, ByteDance, DeerFlow 2.0 GitHub, and Deer Flow vs OpenClaw.
- Pricing defaults to the middle Flow plan and annual billing.
- Annual billing applies a 50% discount versus the monthly run-rate.
- Creem checkout opens in a centered popup while the original page stays visible behind a blurred overlay.
- Cloudflare Worker API routes for runtime, analytics, checkout, sitemap, and robots.
- Cloudflare Pages static output with prerendered indexable pages.
- GitHub Actions for Workers and Pages deployments.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run cloudflare:deploy
npm run pages:deploy
```

The Worker expects the Creem live API key as a Cloudflare secret named `API_PROD_KEY`.
