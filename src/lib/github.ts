import fs from "node:fs";
import path from "node:path";
import repos from "../data/repos";
import {GITHUB_USERNAME} from "./config";

const CACHE_DIR = path.resolve(".cache/github");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

export interface GitHubRepo {
    id: number;
    full_name: string;
    name: string;
    description: string | null;
    default_branch: string;
    pushed_at: string;
    stargazers_count: number;
    watchers_count: number;
    subscribers_count: number;
    forks_count: number;
    forks: number;
    open_issues: number;
    open_issues_count: number;
    size: number;
    language: string | null;
    topics: string[];
    license: {key: string; name: string; spdx_id: string;} | null;
    html_url: string;
}

export interface GitHubData {
    repos: string[];
    projects: GitHubRepo[];
    languages: Record<string, Record<string, number>>;
    branches: Record<string, string[]>;
    stats: {
        repos: number;
        branches: number;
        stars: number;
        issues: number;
        forks: number;
        watchers: number;
        subscribers: number;
        size: number;
        topics: number;
        languages: number;
        licenses: number;
    };
}

let gitHubDataPromise: Promise<GitHubData> | null = null;

function cacheRead<T>(key: string): T | null {
    try {
        const file = path.join(CACHE_DIR, `${key}.json`);
        const stat = fs.statSync(file);
        if (Date.now() - stat.mtimeMs > CACHE_TTL_MS) return null;
        return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
    }
    catch {
        return null;
    }
}

function cacheWrite(key: string, data: unknown): void {
    try {
        fs.mkdirSync(CACHE_DIR, {recursive: true});
        fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(data));
    }
    catch {
        // Non-fatal: if we can't write cache, next build will re-fetch
    }
}

async function githubFetch<T>(url: string, cacheKey: string): Promise<T | null> {
    const cached = cacheRead<T>(cacheKey);
    if (cached !== null) return cached;

    const token = process.env.GITHUB_TOKEN ?? "";
    const headers: HeadersInit = {"User-Agent": `@${GITHUB_USERNAME}/Zerebos.com`};
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
        const resp = await fetch(url, {headers});
        if (!resp.ok) return null;
        const data = (await resp.json()) as T;
        cacheWrite(cacheKey, data);
        return data;
    }
    catch {
        return null;
    }
}

function fullName(repo: string): string {
    return repo.includes("/") ? repo : `${GITHUB_USERNAME}/${repo}`;
}

function normalizeLanguagePercentages(raw: Record<string, number>): Record<string, number> | null {
    const sum = Object.values(raw).reduce((a, b) => a + b, 0);
    if (sum === 0) return null;

    const normalized: Record<string, number> = {};
    for (const lang in raw) {
        normalized[lang] = Math.round((raw[lang] / sum) * 100 * 100) / 100;
    }

    return normalized;
}

async function buildGitHubData(): Promise<GitHubData> {
    const repoNames = repos.map(fullName);

    const repoResults = (await Promise.all(
        repoNames.map(async (name) => {
            const data = await githubFetch<GitHubRepo>(
                `https://api.github.com/repos/${name}`,
                `repo-${name.replace("/", "-")}`
            );
            return data;
        })
    )).filter((repo): repo is GitHubRepo => repo !== null);

    const languageEntries = await Promise.all(
        repoNames.map(async (name) => {
            const raw = await githubFetch<Record<string, number>>(
                `https://api.github.com/repos/${name}/languages`,
                `langs-${name.replace("/", "-")}`
            );
            if (!raw) return null;

            const normalized = normalizeLanguagePercentages(raw);
            if (!normalized) return null;

            return [name, normalized] as const;
        })
    );

    const langResults: Record<string, Record<string, number>> = Object.fromEntries(
        languageEntries.filter((entry): entry is readonly [string, Record<string, number>] => entry !== null)
    );

    const branchEntries = await Promise.all(
        repoNames.map(async (name) => {
            const data = await githubFetch<Array<{name: string;}>>(
                `https://api.github.com/repos/${name}/branches`,
                `branches-${name.replace("/", "-")}`
            );
            if (!data) return null;
            return [name, data.map((branch) => branch.name)] as const;
        })
    );

    const branchResults: Record<string, string[]> = Object.fromEntries(
        branchEntries.filter((entry): entry is readonly [string, string[]] => entry !== null)
    );

    return {
        repos,
        projects: repoResults,
        languages: langResults,
        branches: branchResults,
        stats: {
            repos: repoResults.length,
            branches: Object.values(branchResults).reduce((a, b) => a + b.length, 0),
            stars: repoResults.reduce((a, b) => a + b.stargazers_count, 0),
            issues: repoResults.reduce((a, b) => a + b.open_issues_count, 0),
            forks: repoResults.reduce((a, b) => a + b.forks_count, 0),
            watchers: repoResults.reduce((a, b) => a + b.watchers_count, 0),
            subscribers: repoResults.reduce((a, b) => a + b.subscribers_count, 0),
            size: repoResults.reduce((a, b) => a + b.size, 0),
            topics: new Set(repoResults.flatMap((r) => r.topics)).size,
            languages: new Set(repoResults.map((r) => r.language).filter(Boolean)).size,
            licenses: new Set(repoResults.map((r) => r.license?.key ?? "None")).size,
        },
    };
}

export async function getGitHubData(): Promise<GitHubData> {
    if (!gitHubDataPromise) {
        gitHubDataPromise = buildGitHubData();
    }

    return gitHubDataPromise;
}
