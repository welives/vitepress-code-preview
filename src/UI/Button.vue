<template>
  <button :class="['mo-button', type ? 'mo-button--' + type : '']">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineOptions({ name: 'MoButton' })
withDefaults(defineProps<{ type?: string }>(), { type: 'default' })
</script>
