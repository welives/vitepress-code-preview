import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { demoPreviewPlugin } from '../../src/index'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'demo-preview-playground',
  description: 'demo-preview-playground',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }],
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      demoPreviewPlugin(md, { docRoot })
    },
  },
})
