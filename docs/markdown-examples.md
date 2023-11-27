---
title: code-preview
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
    const title = ref('this is jsx demo3334')
    return () => <div>{title.value}</div>
  },
})
```

:::
