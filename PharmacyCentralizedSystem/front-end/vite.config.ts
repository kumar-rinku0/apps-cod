import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    host: "0.0.0.0",
    allowedHosts: ["at.mindverseai.in", "ph.8bit.co.in"],
    port: 4001,
    proxy: {
      "/api": {
        target: process.env.API_BASE_URL || "http://localhost:4000",

        changeOrigin: true,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["at.mindverseai.in", "ph.8bit.co.in"],
    proxy: {
      "/api": {
        target: process.env.API_BASE_URL || "http://localhost:4000",

        changeOrigin: true,
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
