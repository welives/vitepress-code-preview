import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from 'vitepress-demo-preview-container'
import Button from '../components/Button.vue'
import 'vitepress-demo-preview-container/dist/style.css'
import '../components/index.css'

export default {
  ...DefaultTheme,
  enhanceApp(ctx) {
    const { app } = ctx
    useComponents(app, DemoPreview)
    useComponents(app, Button, Button.name)
  },
} satisfies Theme
