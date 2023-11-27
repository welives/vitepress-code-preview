<template>
  <div :class="$style['example-tooltip']">
    <div ref="reference" v-on="componentProps">
      <slot />
    </div>
    <div ref="floating" v-show="showFloating" :class="[$style['example-tooltip-content']]">
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import {
  offset,
  flip,
  shift,
  computePosition,
  Placement,
  ReferenceElement,
  FloatingElement,
} from '@floating-ui/vue'
const props = defineProps<{ placement: Placement; content: string }>()
const reference = ref<ReferenceElement>()
const floating = ref<FloatingElement>()
const showFloating = ref(false)

const update = () => {
  computePosition(reference.value!, floating.value!, {
    placement: props.placement,
    middleware: [offset(10), flip(), shift()],
  }).then(({ x, y }) => {
    Object.assign(floating.value!.style, {
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`,
      willChange: 'transform',
      pointerEvents: 'none',
    })
  })
}
const showTooltip = () => {
  showFloating.value = true
  update()
}
const hideTooltip = () => {
  showFloating.value = false
}
const componentProps = {
  mouseenter: showTooltip,
  mouseleave: hideTooltip,
  focus: showTooltip,
  blur: hideTooltip,
}
</script>

<style module>
.example-tooltip {
  position: relative;
}

.example-tooltip-content {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: max-content;
  min-width: 10px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 4px;
  word-wrap: break-word;
  inset: 0 auto auto 0;
  color: #ffffff;
  background: #303133;
  border: 1px solid #303133;
}

html.dark .example-tooltip-content {
  color: #141414;
  background: #e5eaf3;
  border: 1px solid #e5eaf3;
}
</style>
