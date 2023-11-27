import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview from '../../../src/components/DemoPreview.vue'
import { useComponents } from '../../../src'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, DemoPreview)
  },
} satisfies Theme
