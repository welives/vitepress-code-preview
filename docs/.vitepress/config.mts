import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'
import { demoPreviewPlugin } from '@vitepress-code-preview/plugin'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: 'code-preview-example',
  description: 'code-preview-example',
  base: '/vitepress-code-preview',
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'keywords', content: 'Vite,VitePress,Vue,JSX,TSX,demo,preview,示例,预览' }],
    ['meta', { name: 'author', content: 'welives' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/vitepress-code-preview/favicon.ico' }],
  ],
  themeConfig: {
    search: {
      provider: 'local',
    },
    logo: '/logo.svg',
    outline: 'deep',
    nav: [{ text: '文档', link: '/guide' }],
    sidebar: [
      {
        text: '快速上手',
        link: '/guide',
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/welives/vitepress-code-preview' }],
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
    footer: {
      message: 'MIT License',
      copyright: 'Copyright © 2023-present welives',
    },
  },
  markdown: {
    lineNumbers: true,
    config: (md) => {
      const docRoot = fileURLToPath(new URL('../', import.meta.url))
      md.use(demoPreviewPlugin, { docRoot })
    },
  },
})
