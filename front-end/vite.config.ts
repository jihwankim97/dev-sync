import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["@emotion"],
      },
    }),
  ],
  server: {
    port: 4000,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@emotion/react",
  },
  build: {
    chunkSizeWarningLimit: 3000,
  },
});
