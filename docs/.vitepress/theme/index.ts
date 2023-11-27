import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import CodePreview from '../../../src/components/CodePreview.vue'
import { useComponents } from '../../../src'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, CodePreview)
  },
} satisfies Theme
