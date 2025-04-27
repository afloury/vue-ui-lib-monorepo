# Vue Component library Monorepo example

## Description

I created this repository as a practical example of how to build and structure a custom Vue component library inside a monorepo, using pnpm workspaces. At my workplace, I needed to develop a UI library in Vue 3, with most components based on Vuetify and custom styles to match our company’s design system. However, I found that up-to-date, working examples for this setup—especially with monorepos and peer dependencies—were hard to find on StackOverflow, Reddit, and elsewhere.

After spending a few days building a proof of concept for my company, I decided to share a simplified version here. This project provides a step-by-step guide to help others quickly set up a similar monorepo structure, export Vue components, and configure peer dependencies (like Vuetify) to avoid duplication and conflicts in consumer apps.

The initial commit includes a minimal working example with a single Vue component. I plan to add further commits showing how to configure Vuetify as a peer dependency and other best practices.

## How to reproduce

Follow these steps to create your own monorepo Vue component library and test application.

1. Create the Monorepo

## Steps to create

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

2. Create the UI Library Package

```bash
mkdir -p packages/ui-library
cd packages/ui-library
pnpm create vite@latest . --template vue-ts
rm -rf public src/assets/ .vscode
rm src/App.vue src/style.css src/components/HelloWorld.vue index.html README.md main.ts
```

3. Create a Component

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

4. Export the Component

```
touch src/index.ts
```

`src/index.ts`:

```ts
export { default as MyComp } from "./components/MyComp.vue"
```

5. Update package.json for the UI Library

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

6. Update Vite Config

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

7. Update Root package.json

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

8. Install Packages at Monorepo Root

```bash
cd ../..
pnpm install
```

9. Create a Test Application

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

10. Import the Component in a View

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
