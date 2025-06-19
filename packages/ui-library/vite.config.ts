import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"
import vuetify from "vite-plugin-vuetify"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Enabled by default
    dts({
      tsconfigPath: "tsconfig.app.json", // Point to your package's tsconfig
    }),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "UiLib",
      fileName: (format) => `ui-lib.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue", /^vuetify(\/.*)?$/],
      output: {
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
        },
      },
    },
  },
  resolve: {
    dedupe: ["vue", "vuetify"], // Ensure single instance
  },
})
