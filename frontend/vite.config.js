import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "./dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core libraries
          react: ["react", "react-dom"],

          // Heavy libs
          recharts: ["recharts"],
          icons: ["lucide-react"],

          // Radix group (ShadCN base)
          radix: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "@radix-ui/react-popover",
            "@radix-ui/react-label",
          ],

          // Zustand if reused in multiple places
          zustand: ["zustand"],

          // ShadCN UI primitives (split out from index.js)
          ui: [
            "@/components/ui/card",
            "@/components/ui/select",
            "@/components/ui/label",
            "@/components/ui/skeleton",
            "@/components/ui/checkbox",
            "@/components/ui/sidebar",
            "@/components/ui/chart",
            "@/components/ui/input",
            "@/components/ui/button",
            "@/components/ui/dialog",
          ],
        },
      },
    },
  },
});
