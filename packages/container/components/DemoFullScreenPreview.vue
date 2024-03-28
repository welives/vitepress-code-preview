<template>
  <ClientOnly v-if="modelValue">
    <Teleport to="body">
      <div :class="[$style['example-modal']]"></div>
      <section :class="$style.example">
        <div :class="$style['example-showcase']">
          <slot />
        </div>
      </section>
      <div :class="[$style['example-close']]" @click="close">
        <Close />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import Close from './icons/Close.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
  }>(),
  {}
)
const emit = defineEmits(['update:modelValue'])
const close = () => {
  emit('update:modelValue', false)
}
</script>

<style module>
body:has(.example-modal) {
  overflow: hidden;
}
.example-modal {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3000;
  overflow: hidden;
}
.example {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 3001;
  background-color: var(--preview-bg);
  opacity: 0.95;
}
.example-showcase {
  padding: 0.5rem;
  color: var(--preview-text-1);
  background-color: var(--preview-bg);
}
.example-close {
  position: fixed;
  top: 50%;
  right: 0;
  z-index: 3002;
  cursor: pointer;
  transform: translateY(-50%);
  color: rgba(245, 34, 45, 0.9);
}
.example-close:hover {
  color: rgba(245, 34, 45, 1);
}
</style>
