# dasky92.github.io

Static site for app legal documents, support pages, and marketing landing pages.

Published at: **https://dasky92.github.io**

## Structure

```
content/{app}/{locale}/*.md   # Source (edit these)
docs/                         # Build output (committed for review)
scripts/build.mjs             # md → html + json
```

## Quick start

```bash
cd pages
npm ci
npm run build      # generates docs/
npm run dev        # build + local preview
```

## Verde URL reference

Base: `https://dasky92.github.io/verde`

| Purpose | English | 简体中文 |
|---------|---------|----------|
| Language picker | [/verde/](https://dasky92.github.io/verde/) | same |
| Marketing (human) | [/verde/en/](https://dasky92.github.io/verde/en/) | [/verde/zh-Hans/](https://dasky92.github.io/verde/zh-Hans/) |
| Privacy (App Store / human) | [/verde/en/privacy.html](https://dasky92.github.io/verde/en/privacy.html) | [/verde/zh-Hans/privacy.html](https://dasky92.github.io/verde/zh-Hans/privacy.html) |
| Terms (human) | [/verde/en/terms.html](https://dasky92.github.io/verde/en/terms.html) | [/verde/zh-Hans/terms.html](https://dasky92.github.io/verde/zh-Hans/terms.html) |
| Support (App Store / human) | [/verde/en/support.html](https://dasky92.github.io/verde/en/support.html) | [/verde/zh-Hans/support.html](https://dasky92.github.io/verde/zh-Hans/support.html) |

### App in-app JSON (remote fetch)

| Document | English | 简体中文 |
|----------|---------|----------|
| Privacy | `.../verde/en/privacy.json` | `.../verde/zh-Hans/privacy.json` |
| Terms | `.../verde/en/terms.json` | `.../verde/zh-Hans/terms.json` |
| Support | `.../verde/en/support.json` | `.../verde/zh-Hans/support.json` |
| Marketing | **No JSON** — human-only landing page | same |

## Document types

| File | HTML | JSON | Audience |
|------|------|------|----------|
| `privacy.md` | yes | yes | App Store, users, in-app legal |
| `terms.md` | yes | yes | Users, in-app legal consent |
| `support.md` | yes | yes | App Store Support URL, in-app help |
| `marketing.md` | yes (as `index.html`) | no | Humans / sharing / landing |

## Editing workflow

1. Edit markdown under `content/{app}/{locale}/`
2. Bump `version` and `effectiveDate` in front matter when content changes materially
3. Run `npm run build`
4. Commit both `content/` and `docs/`
5. Push to `main` — GitHub Actions deploys automatically

## Adding a new app

1. Create `content/{slug}/meta.json` (copy from `verde/meta.json`)
2. Add `content/{slug}/{locale}/*.md` files
3. Run `npm run build`

## Adding a locale

1. Add locale to `meta.json` → `locales`
2. Create `content/{app}/{locale}/` with all document markdown files
3. Add UI labels to `UI_LABELS` in `scripts/build.mjs` if needed

## Versioning

- Use semantic versioning in front matter (`version: "1.0.0"`)
- Material legal changes → bump minor or major and update `effectiveDate`
- App legal consent should compare against `version` field in JSON

## Deployment

- Repository: `dasky92.github.io`
- GitHub Pages source: **GitHub Actions** (see `.github/workflows/pages.yml`)
- First-time setup: Repo Settings → Pages → Build and deployment → Source: **GitHub Actions**

## Local preview

```bash
npm run build
npx serve docs
# open http://localhost:3000/verde/en/
```

## Relationship to offlinePlayer

This directory is a **nested git repo** inside the main `offlinePlayer` project. The main repo ignores `pages/` via `.gitignore`. Commit and push from within `pages/`:

```bash
cd pages
git add .
git commit -m "Update Verde legal pages"
git push origin main
```
