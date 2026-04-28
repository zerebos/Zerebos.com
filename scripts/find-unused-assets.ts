import fs from "node:fs";
import path from "node:path";

type UsageMap = Map<string, Set<string>>;

const PROJECT_ROOT = process.cwd();
const PUBLIC_ASSETS_DIR = path.join(PROJECT_ROOT, "public", "assets");
const ASTRO_ASSETS_DIR = path.join(PROJECT_ROOT, "src", "assets");
const SCAN_DIRS = [
    path.join(PROJECT_ROOT, "src"),
    path.join(PROJECT_ROOT, "public"),
];
const SCAN_ROOT_FILES = [
    "astro.config.mjs",
    "package.json",
    "wrangler.jsonc",
    "example.json",
];
const TEXT_EXTENSIONS = new Set([
    ".astro",
    ".cjs",
    ".css",
    ".html",
    ".js",
    ".json",
    ".jsonc",
    ".md",
    ".mdx",
    ".mjs",
    ".svg",
    ".ts",
    ".tsx",
    ".txt",
    ".webmanifest",
    ".xml",
    ".yaml",
    ".yml",
]);

function toPosix(filePath: string): string {
    return filePath.split(path.sep).join("/");
}

function fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
}

function walkFiles(dirPath: string): string[] {
    if (!fileExists(dirPath)) {
        return [];
    }

    const entries = fs.readdirSync(dirPath, {withFileTypes: true});
    const files: string[] = [];

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

function getAssetFiles(dirPath: string): string[] {
    return walkFiles(dirPath).sort();
}

function getScanFiles(): string[] {
    const files: string[] = [];

    for (const dirPath of SCAN_DIRS) {
        for (const filePath of walkFiles(dirPath)) {
            if (TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
                files.push(filePath);
            }
        }
    }

    for (const relativeFilePath of SCAN_ROOT_FILES) {
        const filePath = path.join(PROJECT_ROOT, relativeFilePath);
        if (fileExists(filePath)) {
            files.push(filePath);
        }
    }

    return [...new Set(files)].sort();
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildAssetPattern(assetFiles: string[]): RegExp | null {
    const extensions = [...new Set(assetFiles.map((filePath) => path.extname(filePath).slice(1).toLowerCase()).filter(Boolean))].sort();

    if (extensions.length === 0) {
        return null;
    }

    return new RegExp(
        String.raw`(?:^|[\s"'\(=:,])((?:\/|\.\.?\/)[^\s"'<>` + "`" + String.raw`),]+?\.(?:${extensions.map(escapeRegExp).join("|")}))(?:[?#][^\s"'<>` + "`" + String.raw`),]*)?`,
        "g"
    );
}

function stripQueryAndHash(value: string): string {
    return value.replace(/[?#].*$/, "");
}

function recordUsage(usageMap: UsageMap, assetPath: string, sourcePath: string): void {
    const usages = usageMap.get(assetPath);
    if (usages) {
        usages.add(sourcePath);
        return;
    }

    usageMap.set(assetPath, new Set([sourcePath]));
}

function scanForUsage(scanFiles: string[], assetFiles: string[]): UsageMap {
    const assetPattern = buildAssetPattern(assetFiles);
    const assetSet = new Set(assetFiles);
    const usageMap: UsageMap = new Map();

    if (!assetPattern) {
        return usageMap;
    }

    for (const scanFilePath of scanFiles) {
        const content = fs.readFileSync(scanFilePath, "utf8");
        const scanFileDir = path.dirname(scanFilePath);
        const relativeSourcePath = toPosix(path.relative(PROJECT_ROOT, scanFilePath));

        for (const match of content.matchAll(assetPattern)) {
            const rawPath = stripQueryAndHash(match[1] ?? "");
            const resolvedPath = rawPath.startsWith("/")
                ? path.join(PROJECT_ROOT, "public", rawPath.replace(/^\/+/, ""))
                : path.resolve(scanFileDir, rawPath);

            if (assetSet.has(resolvedPath)) {
                recordUsage(usageMap, resolvedPath, relativeSourcePath);
            }
        }
    }

    return usageMap;
}

function printGroup(title: string, dirPath: string, usageMap: UsageMap): void {
    const assetFiles = getAssetFiles(dirPath);
    const unusedAssets = assetFiles.filter((filePath) => !usageMap.has(filePath));
    const usedCount = assetFiles.length - unusedAssets.length;

    console.log(`${title}: ${usedCount}/${assetFiles.length} referenced`);

    if (unusedAssets.length === 0) {
        console.log("  none appear unused");
        return;
    }

    console.log(`  ${unusedAssets.length} appear unused:`);
    for (const filePath of unusedAssets) {
        console.log(`  - ${toPosix(path.relative(PROJECT_ROOT, filePath))}`);
    }
}

const publicAssetFiles = getAssetFiles(PUBLIC_ASSETS_DIR);
const astroAssetFiles = getAssetFiles(ASTRO_ASSETS_DIR);
const allAssetFiles = [...publicAssetFiles, ...astroAssetFiles];
const scanFiles = getScanFiles();
const usageMap = scanForUsage(scanFiles, allAssetFiles);

console.log(`Scanned ${scanFiles.length} text files for asset references.`);
console.log("This report is heuristic and only marks files as \"appears unused\".");
printGroup("Public assets", PUBLIC_ASSETS_DIR, usageMap);
printGroup("Astro assets", ASTRO_ASSETS_DIR, usageMap);