# Vue Component library Monorepo example

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

Create the UI library package

```bash
mkdir -p packages/ui-library
cd packages/ui-library
pnpm create vite@latest . --template vue-ts
rm -rf public src/assets/ .vscode
rm src/App.vue src/style.css src/components/HelloWorld.vue index.html README.md main.ts
```

Create composant

```
touch src/components/MyComp.vue
```

`MyComp.vue`

```vue
<template>
  <div style="background-color: blue">My Component</div>
</template>
<script setup lang="ts"></script>
<style scoped></style>
```

Export component

```
touch src/index.ts
```

`index.ts`

```ts
export { default as MyComp } from "./components/MyComp.vue"
```

Update `packages/ui-library/package.json`

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

Update `vite.config.ts`

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

Update root `package.json`

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

Install package at monorepo root:

```bash
cd ../..
pnpm install
```

Create a test application

```bash
mkdir -p apps
cd apps
pnpm create vue@latest
```

Add UI lib

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

Import the component in a view `HomeView.vue`

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
