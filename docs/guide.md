---
title: 指南
---

## 🎉 简介

本插件基于 `vitepress`、 `markdown-it` 和 `unified` 实现，它可以帮助你在编写文档的时候，对嵌入的 Vue 示例代码增加演示功能，支持的 Vue 组件形式有 SFC, JSX, TSX

## 🏄‍♂️ 插件包

| Package                                                                                              | Version (click for changelogs)                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [@vitepress-code-preview/container](https://www.npmjs.com/package/@vitepress-code-preview/container) | [![container version](https://badgen.net/npm/v/@vitepress-code-preview/container)](https://github.com/welives/vitepress-code-preview/blob/main/packages/container/CHANGELOG.md) |
| [@vitepress-code-preview/plugin](https://www.npmjs.com/package/@vitepress-code-preview/plugin)       | [![plugin version](https://badgen.net/npm/v/@vitepress-code-preview/plugin)](https://github.com/welives/vitepress-code-preview/blob/main/packages/plugin/CHANGELOG.md)          |

## ⚙ 安装

```sh
pnpm add @vitepress-code-preview/container @vitepress-code-preview/plugin
```

## 🚀 引入

- ① 编辑 `docs/vite.config.ts`，注册 Vite 插件，如果需要支持 JSX 组件，请安装 `@vitejs/plugin-vue-jsx`

```ts
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
export default defineConfig({
  plugins: [viteDemoPreviewPlugin(), vueJsx()],
})
```

- ② 编辑 `docs/.vitepress/config.ts`，注册 markdown 插件

```ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

export default defineConfig({
  markdown: {
    config(md) {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
})
```

- ③ 编辑 `docs/.vitepress/theme/index.ts`，注册组件容器

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    useComponents(ctx.app, DemoPreview)
  },
} satisfies Theme
```

## 使用示例

### 💡 基础用法

在`demo`容器中直接编写`vue`代码

````md
:::demo

```vue
你的代码
```

:::
````

:::demo

```vue
<template>
  <div>{{ title }}</div>
</template>
<script lang="ts" setup>
import { ref, defineComponent } from 'vue'
const title = ref('this is basic demo12')
</script>
```

:::

### 💪 支持 JSX 和 TSX

````md
:::demo

```jsx
你的代码
```

:::
````

:::demo

```jsx
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const title = ref('this is jsx demo')
    return () => <div>{title.value}</div>
  },
})
```

:::

### ✨ 使用其他已注册的组件

假设我们有一个第三方的`Button`组件已经在`.vitepress/theme/index.ts`中注册过了，那么就可以在`demo`容器中使用它

```ts
// ...
export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    // ...
    useComponents(app, Button, Button.name)
  },
} satisfies Theme
```

````md
:::demo

```vue
<template>
  <MoButton>默认按钮</MoButton>
  <MoButton type="primary">主要按钮</MoButton>
  <MoButton type="success">成功按钮</MoButton>
  <MoButton type="info">信息按钮</MoButton>
  <MoButton type="warning">警告按钮</MoButton>
  <MoButton type="danger">危险按钮</MoButton>
</template>
```

:::
````

:::demo

```vue
<template>
  <MoButton>默认按钮</MoButton>
  <MoButton type="primary">主要按钮</MoButton>
  <MoButton type="success">成功按钮</MoButton>
  <MoButton type="info">信息按钮</MoButton>
  <MoButton type="warning">警告按钮</MoButton>
  <MoButton type="danger">危险按钮</MoButton>
</template>

<script>
import { ref, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const title = ref('默认按钮')
    return { title }
  },
})
</script>
```

:::

### ⚡ 直接引入组件文件

如果你的示例代码比较多，在 markdown 中直接写会比较麻烦，那么可以引入一个单独的组件文件，引入的路径是以`docs`目录作为根目录

```md
:::demo src=examples/Input.vue
:::
```

:::demo src=examples/Input.vue
:::
