# Vite Plugin Async Component

使用语法糖 `/* @async */` 包裹 vue 组件引用，会自动转换为 `defineAsyncComponent` 异步组件。

## Usage

1. Install the plugin:

```bash
npm install vite-plugin-async-component -D
```

2. Add the plugin to your Vite config:

```
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import asyncComponentPlugin from 'vite-plugin-async-component';

export default defineConfig({
  plugins: [vue(), asyncComponentPlugin()]
});
```

3. Use the @async comment blocks in your code:

```
/* @async */
import ComponentA from './index-a.vue';
import ComponentB from './index-b.vue';
/* @endasync */
```

Testing
Run tests using Vitest:

```
npm test
```
