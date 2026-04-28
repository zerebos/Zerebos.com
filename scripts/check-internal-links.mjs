import fs from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();
const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const SITE_ORIGIN = "https://zerebos.local";
const HTML_ID_CACHE = new Map();

function fail(message) {
    console.error(message);
    process.exit(1);
}

function toPosix(filePath) {
    return filePath.split(path.sep).join("/");
}

function walkFiles(dirPath) {
    const entries = fs.readdirSync(dirPath, {withFileTypes: true});
    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            files.push(...walkFiles(entryPath));
            continue;
        }

        if (entry.isFile()) {
            files.push(entryPath);
        }
    }

    return files;
}

function pathExists(filePath) {
    return fs.existsSync(filePath);
}

function getHtmlFiles() {
    if (!pathExists(DIST_DIR)) {
        fail("dist/ does not exist. Run `bun run build` first or use `bun run check:links`.");
    }

    return walkFiles(DIST_DIR)
        .filter((filePath) => filePath.endsWith(".html"))
        .sort();
}

function distHtmlToRoute(filePath) {
    const relativePath = toPosix(path.relative(DIST_DIR, filePath));

    if (relativePath === "index.html") {
        return "/";
    }

    if (relativePath.endsWith("/index.html")) {
        return `/${relativePath.slice(0, -"/index.html".length)}`;
    }

    return `/${relativePath.slice(0, -".html".length)}`;
}

function resolveDistTarget(pathname) {
    const normalizedPath = pathname === "/" ? "" : pathname.replace(/^\/+/, "");
    const directPath = path.join(DIST_DIR, normalizedPath);

    if (normalizedPath === "") {
        const rootIndex = path.join(DIST_DIR, "index.html");
        return pathExists(rootIndex)
            ? {exists: true, filePath: rootIndex, isHtml: true}
            : {exists: false, filePath: rootIndex, isHtml: true};
    }

    if (pathExists(directPath)) {
        const stat = fs.statSync(directPath);
        if (stat.isFile()) {
            return {exists: true, filePath: directPath, isHtml: directPath.endsWith(".html")};
        }

        if (stat.isDirectory()) {
            const indexPath = path.join(directPath, "index.html");
            if (pathExists(indexPath)) {
                return {exists: true, filePath: indexPath, isHtml: true};
            }
        }
    }

    const htmlPath = path.join(DIST_DIR, `${normalizedPath}.html`);
    if (pathExists(htmlPath)) {
        return {exists: true, filePath: htmlPath, isHtml: true};
    }

    const indexPath = path.join(DIST_DIR, normalizedPath, "index.html");
    if (pathExists(indexPath)) {
        return {exists: true, filePath: indexPath, isHtml: true};
    }

    return {exists: false, filePath: directPath, isHtml: false};
}

function getHtmlIds(filePath) {
    if (HTML_ID_CACHE.has(filePath)) {
        return HTML_ID_CACHE.get(filePath);
    }

    const html = fs.readFileSync(filePath, "utf8");
    const ids = new Set();
    const idPattern = /\s(?:id|name)=(?:"([^"]+)"|'([^']+)')/g;

    for (const match of html.matchAll(idPattern)) {
        const value = match[1] ?? match[2];
        if (value) {
            ids.add(value);
        }
    }

    HTML_ID_CACHE.set(filePath, ids);
    return ids;
}

function shouldSkipReference(rawValue) {
    if (!rawValue) {
        return true;
    }

    const value = rawValue.trim();
    if (!value) {
        return true;
    }

    if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(value)) {
        return true;
    }

    if (/^(?:mailto:|tel:|data:|javascript:)/i.test(value)) {
        return true;
    }

    return false;
}

function parseAttributes(rawAttributes) {
    const attributes = new Map();
    const attributePattern = /\b([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g;

    for (const match of rawAttributes.matchAll(attributePattern)) {
        const name = match[1].toLowerCase();
        const value = match[2] ?? match[3] ?? "";
        attributes.set(name, value);
    }

    return attributes;
}

function addReference(references, attribute, value) {
    if (!shouldSkipReference(value)) {
        references.push({attribute, value});
    }
}

function addSrcSetReferences(references, value) {
    for (const candidate of value.split(",")) {
        const [source] = candidate.trim().split(/\s+/, 1);
        addReference(references, "srcset", source);
    }
}

function extractReferences(html) {
    const references = [];
    const tagPattern = /<([a-z][\w:-]*)(\s[^>]*?)?>/gi;

    for (const match of html.matchAll(tagPattern)) {
        const tagName = match[1].toLowerCase();
        const rawAttributes = match[2] ?? "";
        const attributes = parseAttributes(rawAttributes);

        if (tagName === "a" || tagName === "link") {
            const href = attributes.get("href");
            if (href) {
                addReference(references, "href", href);
            }
            continue;
        }

        if (tagName === "img" || tagName === "script" || tagName === "source" || tagName === "video" || tagName === "audio") {
            const src = attributes.get("src");
            if (src) {
                addReference(references, "src", src);
            }

            const poster = attributes.get("poster");
            if (poster) {
                addReference(references, "poster", poster);
            }

            const srcSet = attributes.get("srcset");
            if (srcSet) {
                addSrcSetReferences(references, srcSet);
            }

            continue;
        }

        if (tagName === "meta") {
            const content = attributes.get("content");
            if (content && /^(?:\/|\.\.?\/)/.test(content.trim())) {
                addReference(references, "content", content);
            }
        }
    }

    return references;
}

function checkReference(pageFilePath, pageRoute, reference, failures) {
    const rawValue = reference.value.trim();

    if (rawValue.startsWith("#")) {
        const fragment = decodeURIComponent(rawValue.slice(1));
        if (!fragment) {
            return;
        }

        const ids = getHtmlIds(pageFilePath);
        if (!ids.has(fragment)) {
            failures.push({
                pageRoute,
                attribute: reference.attribute,
                value: rawValue,
                reason: `missing anchor #${fragment} on ${pageRoute}`,
            });
        }
        return;
    }

    const resolvedUrl = new URL(rawValue, new URL(pageRoute, SITE_ORIGIN));
    const targetPath = decodeURIComponent(resolvedUrl.pathname);
    const target = resolveDistTarget(targetPath);

    if (!target.exists) {
        failures.push({
            pageRoute,
            attribute: reference.attribute,
            value: rawValue,
            reason: `missing file for ${targetPath}`,
        });
        return;
    }

    if (resolvedUrl.hash && target.isHtml) {
        const fragment = decodeURIComponent(resolvedUrl.hash.slice(1));
        if (!fragment) {
            return;
        }

        const ids = getHtmlIds(target.filePath);
        if (!ids.has(fragment)) {
            failures.push({
                pageRoute,
                attribute: reference.attribute,
                value: rawValue,
                reason: `missing anchor #${fragment} on ${distHtmlToRoute(target.filePath)}`,
            });
        }
    }
}

const htmlFiles = getHtmlFiles();
let checkedReferences = 0;
const failures = [];

for (const htmlFilePath of htmlFiles) {
    const pageRoute = distHtmlToRoute(htmlFilePath);
    const html = fs.readFileSync(htmlFilePath, "utf8");
    const references = extractReferences(html);

    for (const reference of references) {
        checkedReferences += 1;
        checkReference(htmlFilePath, pageRoute, reference, failures);
    }
}

if (failures.length > 0) {
    console.error(`Found ${failures.length} broken internal reference${failures.length === 1 ? "" : "s"} across ${htmlFiles.length} HTML files.`);
    for (const failure of failures) {
        console.error(`- ${failure.pageRoute} [${failure.attribute}] ${failure.value} -> ${failure.reason}`);
    }
    process.exit(1);
}

console.log(`Checked ${checkedReferences} internal references across ${htmlFiles.length} HTML files.`);
console.log("No broken internal references found.");