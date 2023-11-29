---
title: 用法
---

# basic

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

# Use Component

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

# Use File

```md
:::demo src=examples/Input.vue
:::
```

:::demo src=examples/Input.vue
:::

# Support JSX and TSX

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
