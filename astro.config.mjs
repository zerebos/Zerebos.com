import {defineConfig} from "astro/config";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://zerebos.com",
  output: "static",
  integrations: [sitemap()],

  markdown: {
      smartypants: false
  },

  build: {
      format: "directory"
  },

  adapter: cloudflare()
});