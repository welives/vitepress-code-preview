import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import CodePreview from '../../../src/components/CodePreview.vue'
import { useComponents } from '../../../src'

export default {
  ...DefaultTheme,
  enhanceApp(ctx: EnhanceAppContext) {
    const { app } = ctx
    useComponents(app, 'CodePreview', CodePreview)
  },
}
