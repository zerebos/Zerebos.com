const dotenv = require("dotenv");
const cachedFetch = require("@11ty/eleventy-fetch");
const repos = require("./repos");

dotenv.config();

const fetchOptions = {
    headers: {
        "Authorization": process.env.GITHUB_TOKEN
    }
};

module.exports = async function() {
    const repoResults = [];
    for (const repo of repos) {
        repoResults.push(await cachedFetch(`https://api.github.com/repos/${repo.includes("/") ? repo : "rauenzi/" + repo}`, {
            duration: "1h", // 1 day
            type: "json", // also supports "text" or "buffer"
            verbose: true,
            fetchOptions: fetchOptions
        }));
    }

    const langResults = {};
    for (const repo of repos) {
        const fullName = repo.includes("/") ? repo : "rauenzi/" + repo;
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
        const fullName = repo.includes("/") ? repo : "rauenzi/" + repo;
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