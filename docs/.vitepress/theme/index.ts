import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
// import '@vitepress-code-preview/container/dist/style.css'
import DemoPreview, { useComponents } from '../../../packages/container'
import Button from '../components/Button.vue'
import '../components/index.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, DemoPreview)
    useComponents(app, Button, Button.name)
  },
} satisfies Theme
