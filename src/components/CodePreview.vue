<template>
  <ClientOnly>
    <div ref="demoblock" :class="$style.example">
      <div :class="$style['example-showcase']">
        <slot />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
const props = defineProps<{
  rawSource: string
  lang: string
  height: number
}>()
console.log(props)
const demoblock = ref(null)
</script>

<style module>
.example {
  border: 1px solid #ccc;
  border-radius: 2px;
}
.example-showcase {
  background-color: #f5f5f5;
}
</style>
