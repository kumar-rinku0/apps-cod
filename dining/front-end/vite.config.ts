import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["at.mindverseai.in", "ct.8bit.co.in"],
    proxy: {
      "/api": {
        target: process.env.API_BASE_URL || "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: process.env.API_BASE_URL || "http://localhost:8000",
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
