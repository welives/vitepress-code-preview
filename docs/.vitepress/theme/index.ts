import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview from '../../../src/components/DemoPreview.vue'
import { useComponents } from '../../../src'
import Button from '../../../src/UI/Button.vue'
import '../../../src/UI/index.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, DemoPreview)
    useComponents(app, Button, Button.name)
  },
} satisfies Theme
