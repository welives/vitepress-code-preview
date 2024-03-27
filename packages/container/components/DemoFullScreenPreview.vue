<template>
  <ClientOnly v-if="modelValue">
    <Teleport to="body">
      <div :class="[$style.modal]">
      </div>
      <div :class="[$style.content]">
        <slot />
      </div>
      <div :class="[$style.close]" @click="close">
        <Close />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang='ts'>
import Close from './icons/Close.vue'

withDefaults(defineProps<{
  modelValue: boolean
}>(), {})
const emit = defineEmits(['update:modelValue'])
const close = () => {
  emit('update:modelValue', false)
}
</script>

<style module>
body:has(.modal) {
  overflow: hidden;
}
.modal {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3000;
  overflow: hidden;
}
.content {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3001;
}
.close {
  position: fixed;
  top: 50%;
  right: 12px;
  z-index: 3002;
  cursor: pointer;
  transform: translateY(-50%);
  color: #ddd;
}
</style>
