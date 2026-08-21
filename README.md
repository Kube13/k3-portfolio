# K3 Portfolio

Career-first portfolio for K3, positioned around:

`Data Analyst & Automation Engineer · Product Builder`

The site also includes secondary freelance website-development positioning, bilingual English/Burmese copy, Wisp product motion, case-study evidence, concept website demos, and a lightweight geometric sakura visual system built with CSS and reusable SVG components.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS/PostCSS
- Static export for Cloudflare Pages

## Requirements

- Node.js 22.13.0 or newer
- npm

The repository includes `.nvmrc` with `22.13.0`.

## Local Development

```bash
npm ci
npm run dev
```

Open the local URL printed by Next.js.

## Production Build

```bash
npm run build
```

The production build exports static files to:

```text
out/
```

Run the validation suite with:

```bash
npm test
```

This builds the site and checks that the main routes, SEO files, CV, and certificate assets are exported.

## Main Routes

- `/`
- `/services`
- `/websites`
- `/case-studies/wisp`
- `/case-studies/personal-intelligence-lab`
- `/demos/cafe`
- `/demos/restaurant`
- `/demos/law-firm`
- `/demos/shop`
- `/robots.txt`
- `/sitemap.xml`

## SEO

Metadata is defined with the Next.js metadata API. The default canonical base is:

```text
https://k3labs.me
```

The production canonical is `https://k3labs.me`. To override it for a preview environment, set this build-time environment variable in Cloudflare Pages:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

No environment variables are required for the site to build.

## Cloudflare Pages Deployment

Use GitHub repository:

```text
Kube13/k3-portfolio
```

Cloudflare Pages settings:

- Framework preset: Next.js
- Root directory: `/`
- Build command: `npm run build`
- Output directory: `out`
- Node version: `22.13.0`
- Environment variables: none required; set `NEXT_PUBLIC_SITE_URL` only when intentionally overriding the production canonical for a preview

The site is static and does not require Workers, D1, R2, server functions, or secrets.

## Public Assets

The public repository intentionally includes:

- `public/k3-cv.html`
- `public/datacamp-python-data-associate.pdf`
- `public/favicon.svg`
- `public/og-image.svg`

Generated directories such as `node_modules`, `.next`, `out`, `.npm-cache`, `.sites-runtime`, and `.wrangler` are ignored.
