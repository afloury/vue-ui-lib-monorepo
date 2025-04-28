# Vue & Vuetify Component Library Monorepo Example

## Description

This repository demonstrates how to build and structure a custom Vue component library with Vuetify integration inside a monorepo, using pnpm workspaces. I created this project because finding up-to-date, working examples for this setup—especially handling Vuetify as a peer dependency in a monorepo structure—proved challenging across platforms like StackOverflow and Reddit.

After spending time building a proof of concept for my company, I'm sharing this simplified but practical example. The repository showcases:

- A working monorepo structure for a Vue 3 component library
- Proper Vuetify integration as a peer dependency in the UI library
- Configuration of `vite-plugin-vuetify` for correct component building
- A demo web application consuming the library components
- Working example of a custom component using Vuetify's button component
- Complete setup to avoid dependency duplication and conflicts in consumer apps

This setup ensures that both the library and consuming applications share the same Vuetify instance, preventing potential conflicts and maintaining consistent behavior.

Looking for a simpler version without Vuetify? Check out the [simple-vue-ui-lib tag](https://github.com/afloury/vue-ui-lib-monorepo/releases/tag/simple-vue-ui-lib), which contains a minimal working example with just Vue components.

The repository serves as a step-by-step guide for developers looking to create their own component libraries, especially those building on top of Vuetify while maintaining a clean monorepo structure.

## How to reproduce

Follow these steps to create your own monorepo Vue component library and test application.

### 1. Create the Monorepo

```bash
mkdir monorepo
cd monorepo
pnpm init
```

Add a `pnpm-workspace.yaml` at the root:

```yaml
packages:
	- 'packages/*'
	- 'apps/*'
```

### 2. Create the UI Library Package

```bash
mkdir -p packages/ui-library
cd packages/ui-library
pnpm create vite@latest . --template vue-ts
rm -rf public src/assets/ .vscode
rm src/App.vue src/style.css src/components/HelloWorld.vue index.html README.md main.ts
```

### 3. Create a Component

```
touch src/components/MyComp.vue
```

`src/components/MyComp.vue`:

```vue
<template>
  <div style="background-color: blue">My Component</div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

### 4. Export the Component

```
touch src/index.ts
```

`src/index.ts`:

```ts
export { default as MyComp } from "./components/MyComp.vue"
```

### 5. Update package.json for the UI Library

`packages/ui-library/package.json`:

```json
{
  "name": "@monorepo/ui-library",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/ui-lib.cjs.js",
  "module": "dist/ui-lib.es.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "dev": "vite build --watch",
    "build": "vue-tsc -b && vite build"
  },
  "peerDependencies": {
    "vue": "^3.5.13"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.2.2",
    "@vue/tsconfig": "^0.7.0",
    "typescript": "~5.7.2",
    "vite": "^6.3.1",
    "vite-plugin-dts": "^3.3.1",
    "vue-tsc": "^2.2.8"
  }
}
```

### 6. Update Vite Config

`packages/ui-library/vite.config.ts`:

```ts
// https://vite.dev/config/
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
    vue(),
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
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    dedupe: ["vue"], // Ensure single instance
  },
})
```

### 7. Update Root package.json

`package.json` at the monorepo root:

```json
{
  "name": "@monorepo/vue-ui-lib-monorepo",
  "version": "1.0.0",
  "description": "Example of monorepo for custom Vue UI library",
  "engines": {
    "node": ">=18",
    "pnpm": ">=8"
  },
  "scripts": {
    "dev": "pnpm run -r --parallel --aggregate-output dev",
    "build": "pnpm run -r --parallel --aggregate-output build"
  },
  "keywords": ["Monorepo", "Vue", "UI Library"]
}
```

### 8. Install Packages at Monorepo Root

```bash
cd ../..
pnpm install
```

### 9. Create a Test Application

```bash
mkdir -p apps
cd apps
pnpm create vue@latest
```

Add your UI library in `apps/web-app/package.json`:

```json
"dependencies": {
	"vue": "^3.5.13",
	"vue-router": "^4.5.0",
	"@monorepo/ui-library": "workspace:^"
},
```

```
cd ..
pnpm install
pnpm dev
```

### 10. Import the Component in a View

In `HomeView.vue`:

```vue
<script setup lang="ts">
import TheWelcome from "../components/TheWelcome.vue"
import { MyComp } from "@monorepo/ui-library"
</script>

<template>
  <main>
    <!-- <TheWelcome /> -->
    <MyComp />
  </main>
</template>
```

### Notes

- This example uses pnpm workspaces for efficient monorepo management.
- The UI library is set up to use Vue 3 as a peer dependency, which helps avoid version conflicts in consumer applications.
- Further commits will demonstrate how to add Vuetify as a peer dependency and share more advanced configuration tips.

## Add Vuetify

### 1. Install Vuetify inside the Web App

```bash
pnpm i vuetify
```

### 2. Update main.ts

```typescript
import { createApp } from "vue"

// Vuetify
import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"

// Components
import App from "./App.vue"

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).mount("#app")
```

### 3. Install vite-plugin-vuetify inside the UI Library to build vuetify components

```bash
cd packages/ui-library
pnpm i -D vite-plugin-vuetify
```

### 4. Update vite.config.ts inside the UI Library

`packages/ui-library/vite.config.ts`:

```ts
// https://vite.dev/config/
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
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
      external: ["vue", "vuetify"],
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
```

### 5. You can now create a custom component that uses Vuetify

```vue
<template>
  <div>
    <v-row noGutters>Vuetify custom component from UI library</v-row>
    <v-btn
      class="mt-4 text-none font-weight-bold"
      color="red"
      variant="outlined"
      rounded="lg"
      >Btn from library</v-btn
    >
  </div>
</template>
```

### 6. then export it in you index.ts

```ts
export { default as MyCustomBtn } from "./components/MyCustomBtn.vue"
```

### 7. So you can use it in you Web App

```vue
<script setup lang="ts">
import { MyComp, MyCustomBtn } from "@monorepo/ui-library"
</script>

<template>
  <div>
    <MyComp class="ma-4" />
    <v-btn class="ma-4" color="primary">btn from app</v-btn>
    <MyCustomBtn class="ma-4" />
  </div>
</template>
```
