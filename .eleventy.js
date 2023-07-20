module.exports = function (eleventyConfig) {
    // Folders to copy to output folder
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("src/scripts.js");
    eleventyConfig.addPassthroughCopy("src/styles.css");

    eleventyConfig.addFilter("percentOf", (percent, of = 255) => {
        percent = percent / 100;
        return of * percent;
    });

    eleventyConfig.addFilter("subtractFrom", (amount, from = 255) => {
        return from - amount;
    });

    eleventyConfig.addFilter("getElementByKey", (array, key, value) => {
        return array.find(e => e[key] === value);
    });

    eleventyConfig.addFilter("numLocale", (str) => {
        return parseInt(str).toLocaleString();
    });

    eleventyConfig.addFilter("stringify", (json, indent = 4) => {
        return JSON.stringify(json, null, indent);
    });

    eleventyConfig.addFilter("date", (dateTime, format = "LL") => {
        const formatter = Intl.DateTimeFormat(format);
        return formatter.format(new Date(dateTime));
    });

    function getPosts(collectionApi) {
        return collectionApi.getFilteredByGlob("./src/projects/*.md");
    }

    eleventyConfig.addCollection("projects", function (collection) {
        return getPosts(collection);
    });

    return {
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",
        dir: {
            input: "src",
            output: "dist",
            data: "data",
            layouts: "layouts"
        }
    }
};