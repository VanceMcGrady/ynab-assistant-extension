import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        { src: "src/manifest.json", dest: "." },
        { src: "src/popup/index.html", dest: ".", rename: "index.html" },
        { src: "public/*", dest: "." },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/main.ts"), // Point to main.ts for Vue app
        background: resolve(__dirname, "src/background.ts"),
        contentScript: resolve(__dirname, "src/content/contentScript.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          // All entry points go into a 'js/' subdirectory
          if (chunk.name === "background") return "js/background.js";
          if (chunk.name === "contentScript") return "js/contentScript.js";
          return "js/[name].js"; // This will catch popup.js and any other entry points
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
