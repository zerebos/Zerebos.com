import {defineConfig} from "astro/config";

export default defineConfig({
    site: "https://zerebos.com",
    output: "static",
    build: {
        format: "directory"
    }
});
