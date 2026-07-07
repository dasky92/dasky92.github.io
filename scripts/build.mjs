#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const DOCS_DIR = path.join(ROOT, "docs");
const TEMPLATES_DIR = path.join(ROOT, "templates");
const ASSETS_DIR = path.join(ROOT, "assets");

const JSON_DOCUMENTS = new Set(["privacy", "terms", "support"]);

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
});

const UI_LABELS = {
  en: {
    home: "Home",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    support: "Support",
    contact: "Contact",
    effectiveDate: "Effective",
    chooseLanguage: "Choose your language",
  },
  "zh-Hans": {
    home: "首页",
    privacy: "隐私政策",
    terms: "用户协议",
    support: "技术支持",
    contact: "联系",
    effectiveDate: "生效日期",
    chooseLanguage: "选择语言",
  },
};

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fff-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "section";
}

function loadTemplate(name) {
  return fs.readFileSync(path.join(TEMPLATES_DIR, name), "utf8");
}

function renderTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}

function parseSections(markdownBody) {
  const lines = markdownBody.split("\n");
  const sections = [];
  let current = null;
  let buffer = [];

  const flush = () => {
    if (!current) return;
    const bodyMd = buffer.join("\n").trim();
    sections.push({
      id: slugify(current.title),
      title: current.title,
      body: bodyMd ? md.render(bodyMd) : "",
    });
    buffer = [];
  };

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flush();
      current = { title: h2[1].trim() };
      continue;
    }
    if (current) {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

function stripLeadingH1(markdownBody) {
  return markdownBody.replace(/^#\s+.+\n+/, "");
}

function assetPrefixFor(app, locale) {
  const depth = 2;
  return "../".repeat(depth);
}

function localePrefixFor(app, locale) {
  return "./";
}

function writeFileEnsuringDir(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildDocumentHtml({
  meta,
  frontmatter,
  sections,
  locale,
  appMeta,
  labels,
}) {
  const template = loadTemplate("document.html");
  const sectionsHtml = sections
    .map(
      (s) =>
        `<section class="doc-section" id="${s.id}"><h2>${escapeHtml(s.title)}</h2>${s.body}</section>`,
    )
    .join("\n");

  const assetPrefix = assetPrefixFor(meta.slug, locale);

  return renderTemplate(template, {
    locale,
    title: frontmatter.title,
    appDisplayName: appMeta.displayName,
    version: frontmatter.version,
    effectiveDate: formatEffectiveDate(frontmatter.effectiveDate),
    effectiveDateLabel: labels.effectiveDate,
    sectionsHtml,
    assetPrefix,
    localePrefix: localePrefixFor(meta.slug, locale),
    homeLabel: labels.home,
    privacyLabel: labels.privacy,
    termsLabel: labels.terms,
    supportLabel: labels.support,
    contactLabel: labels.contact,
    supportEmail: appMeta.supportEmail,
  });
}

function buildLangIndexHtml({ appMeta, labels }) {
  const template = loadTemplate("lang-index.html");
  const localeLinks = appMeta.locales
    .map(
      (loc) =>
        `      <li><a href="${loc.id}/">${escapeHtml(loc.label)}</a></li>`,
    )
    .join("\n");

  const depth = 1;
  const assetPrefix = "../".repeat(depth);

  return renderTemplate(template, {
    appDisplayName: appMeta.displayName,
    chooseLanguageLabel: labels.chooseLanguage,
    localeLinks,
    assetPrefix,
  });
}

function processMarketingHtml(filePath, appMeta, localeId) {
  const html = fs.readFileSync(filePath, "utf8");
  const outDir = path.join(DOCS_DIR, appMeta.slug, localeId);
  writeFileEnsuringDir(path.join(outDir, "index.html"), html);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatEffectiveDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function buildJsonDocument({ frontmatter, sections, appMeta, locale }) {
  const base = {
    app: frontmatter.app,
    locale,
    document: frontmatter.document,
    title: frontmatter.title,
    version: frontmatter.version,
    effectiveDate: formatEffectiveDate(frontmatter.effectiveDate),
    sections: sections.map(({ id, title, body }) => ({ id, title, body })),
  };

  if (frontmatter.document === "support") {
    return {
      ...base,
      contactEmail: appMeta.supportEmail,
      faq: sections.map(({ id, title, body }) => ({ id, title, body })),
    };
  }

  return base;
}

function processMarkdownFile(filePath, appMeta) {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data: frontmatter, content } = matter(raw);
  const locale = frontmatter.locale;
  const document = frontmatter.document;
  const labels = UI_LABELS[locale] ?? UI_LABELS.en;

  const bodyWithoutH1 = stripLeadingH1(content);
  const sections = parseSections(bodyWithoutH1);

  const app = appMeta.slug;
  const outDir = path.join(DOCS_DIR, app, locale);

  const html = buildDocumentHtml({
    meta: appMeta,
    frontmatter,
    sections,
    locale,
    appMeta,
    labels,
  });
  writeFileEnsuringDir(path.join(outDir, `${document}.html`), html);

  if (JSON_DOCUMENTS.has(document)) {
    const json = buildJsonDocument({ frontmatter, sections, appMeta, locale });
    writeFileEnsuringDir(
      path.join(outDir, `${document}.json`),
      JSON.stringify(json, null, 2) + "\n",
    );
  }
}

function buildApp(appSlug) {
  const appDir = path.join(CONTENT_DIR, appSlug);
  const metaPath = path.join(appDir, "meta.json");
  const appMeta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  appMeta.slug = appSlug;

  for (const locale of appMeta.locales) {
    const localeDir = path.join(appDir, locale.id);
    if (!fs.existsSync(localeDir)) continue;

    const mdFiles = fs
      .readdirSync(localeDir)
      .filter((f) => f.endsWith(".md"))
      .sort();

    for (const file of mdFiles) {
      processMarkdownFile(path.join(localeDir, file), appMeta);
    }

    const marketingHtml = path.join(localeDir, "marketing.html");
    if (fs.existsSync(marketingHtml)) {
      processMarketingHtml(marketingHtml, appMeta, locale.id);
    }
  }

  const defaultLocale = appMeta.locales[0]?.id ?? "en";
  const defaultLabels = UI_LABELS[defaultLocale] ?? UI_LABELS.en;
  const langIndexHtml = buildLangIndexHtml({
    appMeta,
    labels: defaultLabels,
  });
  writeFileEnsuringDir(
    path.join(DOCS_DIR, appSlug, "index.html"),
    langIndexHtml,
  );

  console.log(`Built app: ${appSlug}`);
}

function main() {
  if (fs.existsSync(DOCS_DIR)) {
    fs.rmSync(DOCS_DIR, { recursive: true });
  }

  copyDir(ASSETS_DIR, path.join(DOCS_DIR, "assets"));
  writeFileEnsuringDir(path.join(DOCS_DIR, ".nojekyll"), "");

  const apps = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  for (const app of apps) {
    buildApp(app);
  }

  console.log(`Done. Output: ${DOCS_DIR}`);
}

main();
