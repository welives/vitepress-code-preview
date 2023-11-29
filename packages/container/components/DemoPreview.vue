<template>
  <ClientOnly>
    <section :class="[$style.example]">
      <div :class="$style['example-showcase']">
        <slot />
      </div>
      <div :class="$style['example-divider--horizontal']"></div>
      <div :class="$style['example-actions']">
        <Tooltip placement="bottom" :content="locale['edit-in-playground']">
          <Playground v-if="lang === 'vue'" style="cursor: pointer" :code="decodedSource" />
        </Tooltip>
        <div :class="$style['example-actions--right']">
          <Tooltip placement="bottom" :content="locale['copy-code']">
            <Copy style="cursor: pointer" @click="copyCode" />
          </Tooltip>
          <Tooltip placement="bottom" :content="locale['view-source']">
            <Code style="cursor: pointer" @click="toggleExpanded" />
          </Tooltip>
        </div>
        <span v-show="copyTip" :class="$style['example-actions-tip']">{{
          locale['copy-success']
        }}</span>
      </div>
      <CollapseTransition>
        <div v-show="isExpanded" :class="$style['example-source-wrapper']">
          <template v-if="isFile">
            <div :class="`example-source language-${lang}`">
              <span class="lang">{{ lang }}</span>
              <div v-html="decodedHlSource"></div>
            </div>
          </template>
          <slot v-else name="highlight" />
        </div>
      </CollapseTransition>
      <Transition name="el-fade-in-linear">
        <div v-show="isExpanded" :class="$style['example-control']" @click="toggleExpanded">
          <EpCaretTop :class="$style['control-icon']" />
          <span :class="$style['control-text']">{{ locale['hide-source'] }}</span>
        </div>
      </Transition>
    </section>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { ref, defineProps, computed } from 'vue'
import CollapseTransition from './CollapseTransition.vue'
import Tooltip from './Tooltip.vue'
import Playground from './icons/SfcPlayground.vue'
import Copy from './icons/Copy.vue'
import Code from './icons/Code.vue'
import EpCaretTop from './icons/EpCaretTop.vue'
import { useCopyCode } from '../hooks/useCopyCode'
import '../style/transition.css'

interface DemoProps {
  lang: string // 源码类型
  source: string // 转码后的源码内容
  isFile: boolean // 是否为引入文件的模式
  hlSource?: string // 转码后的markdown高亮源码
}

defineOptions({
  name: 'DemoPreview',
})
const props = withDefaults(defineProps<DemoProps>(), {
  lang: 'vue',
  isFile: false,
  hlSource: '',
})
const data = useData()
const locale = computed(() => {
  return (
    data.theme.value.codePreview?.[data.localeIndex.value] ?? {
      'view-source': '查看源代码',
      'hide-source': '隐藏源代码',
      'edit-in-playground': '在 Playground 中编辑',
      'copy-code': '复制代码',
      'copy-success': '复制成功',
    }
  )
})
const decodedSource = computed(() => decodeURIComponent(props.source))
const decodedHlSource = computed(() => decodeURIComponent(props.hlSource))
const isExpanded = ref(false)
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
const { copyTip, copyCode } = useCopyCode(decodedSource.value)
</script>

<style module>
:global(.vp-doc .example-source[class*='language-']) {
  margin: 0;
  border-radius: 0;
}
:global(.example-source[class*='language-'] code) {
  padding: 0 1rem;
}
.example {
  border: 1px solid var(--vp-c-divider);
  border-radius: 1px;
  margin: 20px 0 50px;
}
.example-showcase {
  padding: 1rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
}

.example-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
}
.example-actions {
  position: relative;
  display: flex;
  height: 40px;
  padding: 0 8px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px dashed var(--vp-c-divider);
}

.example-actions--right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.example-source-wrapper {
  overflow: hidden;
  border-top: 1px dashed var(--vp-c-divider);
  transition: 0.3s;
}
.example-control {
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--vp-c-divider);
  height: 44px;
  box-sizing: border-box;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  position: sticky;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
}

.example-control .control-icon {
  font-size: 18px;
}

.example-control .control-text {
  margin-left: 10px;
  font-size: 14px;
}

.example-control:hover {
  color: var(--vp-c-brand);
}
.example-actions-tip {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  font-size: 14px;
  color: var(--vp-c-green-3);
}
</style>
