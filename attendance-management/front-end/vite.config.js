import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["at.8bit.co.in", "at.rajdeep.shop"],
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
});
