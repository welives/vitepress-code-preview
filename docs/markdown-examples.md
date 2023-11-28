---
title: demo-preview-playground
---

# test

:::demo

```vue
<template>
  <div>demo</div>
</template>
```

:::

:::demo

```vue
<template>
  <MoButton>{{ title }}</MoButton>
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

:::demo src=examples/Input.vue
:::

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

<style>
body { color: red; }
</style>

<script setup>
console.log('vitepress-theme-demoblock setup1')
</script>

<!-- <script setup>
console.log('vitepress-theme-demoblock setup2')
</script> -->

<script>
console.log('vitepress-theme-demoblock')
</script>
