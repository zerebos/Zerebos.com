import "dotenv/config";
import cachedFetch from "@11ty/eleventy-fetch";
import repos from "./repos.js";


const fetchOptions = {
    headers: {
        "Authorization": `Bearer ${process.env.GITHUB_TOKEN || ""}`,
        "User-Agent": "@zerebos/Zerebos.com",
    }
};

// console.log(process.env);

export default async function () {
    const repoResults = [];
    for (const repo of repos) {
        try {
            const resp = await cachedFetch(`https://api.github.com/repos/${repo.includes("/") ? repo : "zerebos/" + repo}`, {
                duration: "1d", // 1 day
                type: "json", // also supports "text" or "buffer"
                verbose: true,
                fetchOptions: fetchOptions
            });
            repoResults.push(resp);
        }
        catch (e) {}
    }

    const langResults = {};
    for (const repo of repos) {
        const fullName = repo.includes("/") ? repo : "zerebos/" + repo;
        try {
            const temp = await cachedFetch(`https://api.github.com/repos/${fullName}/languages`, {
                duration: "1d", // 1 day
                type: "json", // also supports "text" or "buffer"
                verbose: true,
                fetchOptions: fetchOptions
            });
            const current = Object.assign({}, temp);
            // console.log(current);

            const sum = Object.values(current).reduce((prev, current) => prev + current, 0);
            for (const lang in current) {
                const portion = current[lang];
                const decimal = portion / sum;
                // console.log({portion, sum});
                current[lang] = Math.round(decimal * 100 * 100) / 100;
            }

            langResults[fullName] = current;
            // console.log(current);
            // console.log("")
        } catch {}
    }

    const branchResults = {};
    for (const repo of repos) {
        const fullName = repo.includes("/") ? repo : "zerebos/" + repo;
        try {
            const current = await cachedFetch(`https://api.github.com/repos/${fullName}/branches`, {
                duration: "1d", // 1 day
                type: "json", // also supports "text" or "buffer"
                verbose: true,
                fetchOptions: fetchOptions
            });

            branchResults[fullName] = current.map(b => b.name);
        } catch {}
    }

    return {
        repos: repos,
        languages: langResults,
        branches: branchResults,
        projects: repoResults,
        stats: {
            repos: repoResults.length,
            branches: Object.values(branchResults).reduce((prev, current) => prev + current.length, 0),
            stars: repoResults.reduce((prev, current) => prev + current.stargazers_count, 0),
            issues: repoResults.reduce((prev, current) => prev + current.open_issues_count, 0),
            forks: repoResults.reduce((prev, current) => prev + current.forks_count, 0),
            watchers: repoResults.reduce((prev, current) => prev + current.watchers_count, 0),
            subscribers: repoResults.reduce((prev, current) => prev + current.subscribers_count, 0),
            size: repoResults.reduce((prev, current) => prev + current.size, 0),
            topics: (new Set(repoResults.reduce((prev, current) => [...prev, ...current.topics], []))).size,
            languages: (new Set(repoResults.reduce((prev, current) => [...prev, current.language], []))).size,
            licenses: (new Set(repoResults.reduce((prev, current) => [...prev, current.license ? current.license.key : "None"], []))).size,
        }
    };
};