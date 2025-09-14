// vite.config.ts or vite.config.js

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // 🧼 Remove or simplify the server config
  server: {
    port: 8080, // Optional — or just remove entirely
    host: true, // Allow any host in dev
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
