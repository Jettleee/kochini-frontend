import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:preview` produces a single self-contained HTML file (hash routing)
// for sharing a clickable demo. The normal build is a standard SPA for nginx/Docker.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === "preview" ? [viteSingleFile()] : [])],
  build: { outDir: mode === "preview" ? "dist-preview" : "dist" },
}));
