import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // Installable + offline app shell. generateSW precaches the hashed build
    // assets; autoUpdate swaps in new versions without a prompt.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        name: "Ruang — your quiet space",
        short_name: "Ruang",
        description: "Your quiet space — activities, habits, savings & journal.",
        display: "standalone",
        start_url: "/",
        background_color: "#0F0B0D",
        theme_color: "#0F0B0D",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
});
