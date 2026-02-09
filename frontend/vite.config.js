import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      // Files that should be cached for offline use
      includeAssets: [
        "favicon.ico",
        "icons/icon-192.png",
        "icons/icon-512.png"
      ],

      manifest: {
        name: "AI Cattle & Buffalo Breed Identification",
        short_name: "BreedAI",
        description:
          "Offline-first AI system for cattle and buffalo breed identification for BPA registration",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#1b5e20",
        orientation: "portrait",
        lang: "en",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },

      workbox: {
        // Cache UI & translation files
        globPatterns: ["**/*.{js,css,html,svg,json,png}"],

        runtimeCaching: [
          {
            // Cache API calls (network first)
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10
            }
          },
          {
            // Cache images
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ],

  // Development server configuration
  server: {
    port: 5173,
    open: true
  },

  // Build optimization
  build: {
    outDir: "dist",
    sourcemap: false
  }
});
