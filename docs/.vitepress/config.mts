import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
// import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { demoPreviewPlugin } from '../../packages/plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'code-preview-example',
  description: 'code-preview-example',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: '用法', link: '/guide' }],

    sidebar: [
      {
        text: '用法',
        link: '/guide',
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
})
