import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import { visualizer } from "rollup-plugin-visualizer"

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development"

  return {
    base: "/",
    build: {
      sourcemap: isDev ? "inline" : false,
      minify: !isDev,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router") ||
              id.includes("node_modules/scheduler/")
            ) {
              return "vendor-react"
            }
            if (id.includes("node_modules/@supabase/")) {
              return "vendor-supabase"
            }
          },
        },
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      visualizer({
        filename: "stats.html",
        open: false,
        gzipSize: true,
        brotliSize: true,
      }) as any,
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT || "8443"),
    },
    preview: {
      host: "0.0.0.0",
      port: parseInt(process.env.PORT || "8443"),
    },
  }
})
