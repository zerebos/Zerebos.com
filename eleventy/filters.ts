import type {EleventyConfig} from "11ty.ts";


export default function templates(eleventyConfig: EleventyConfig) {
    eleventyConfig.addFilter("percentOf", (percent: number, of = 255) => {
        percent = percent / 100;
        const result = of * percent;
        return result.toString();
    });

    eleventyConfig.addFilter("subtractFrom", (amount: number, from = 255) => {
        const result = from - amount;
        return result.toString();
    });

    eleventyConfig.addFilter("getElementByKey", (array: never[], key: string, value: unknown) => {
        return array.find(e => e[key] === value) ?? "";
    });

    eleventyConfig.addFilter("numLocale", (str: string) => {
        return parseInt(str).toLocaleString();
    });

    eleventyConfig.addFilter("stringify", (json: unknown, indent = 4) => {
        return JSON.stringify(json, null, indent);
    });

    eleventyConfig.addFilter("date", (dateTime: string | Date, format = "en-US", opts = {}) => {
        if (!dateTime) return "";
        const date = new Date(dateTime);
        if (format === "YYYY-MM-DD") {
            return date.toISOString().split("T")[0];
        }
        return date.toLocaleDateString(format, opts);
    });

    eleventyConfig.addFilter("absolute", function (url: string, base = "https://zerebos.com") {
        const filter = eleventyConfig.getFilter("htmlBaseUrl");
        return filter.apply(this, [url, base]);
    });
}