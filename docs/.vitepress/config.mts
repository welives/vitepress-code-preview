import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'code-preview-example',
  description: 'code-preview-example',
  themeConfig: {
    nav: [{ text: '文档', link: '/guide' }],
    sidebar: [
      {
        text: '快速上手',
        link: '/guide',
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/welives/vitepress-code-preview' }],
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
})
