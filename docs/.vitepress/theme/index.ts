import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview from '../../../packages/container/components/DemoPreview.vue'
import { useComponents } from '../../../packages/container'
import Button from '../../../src/Button.vue'
import '../../../src/index.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, DemoPreview)
    useComponents(app, Button, Button.name)
  },
} satisfies Theme
