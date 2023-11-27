---
title: demo-preview-playground
---

# test

:::demo

```vue
<template>
  <div>demo12</div>
</template>
```

:::

:::demo

```vue
<template>
  <div>{{ title }}</div>
</template>

<script>
import { ref, defineComponent } from 'vue'
export default defineComponent({
  setup() {
    const title = ref('this is demo223')
    return { title }
  },
})
</script>
```

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
