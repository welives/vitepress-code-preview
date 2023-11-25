import type { Plugin } from 'vite'
import type { App, Component } from 'vue'
export * from './container'

export function viteCodePreviewPlugin(): Plugin {
  let vuePlugin: any
  const options = {
    env: 'vitepress',
    root: '',
  }
  return {
    name: 'vite-plugin-code-preview',
    enforce: 'pre',
    // 在解析 Vite 配置后调用
    async configResolved(config) {
      const isVitepress = config.plugins.find((p) => p.name === 'vitepress')
      vuePlugin = config.plugins.find((p) => p.name === 'vite:vue')
      options.env = isVitepress ? 'vitepress' : 'vite'
      options.root = config.root
    },
    async transform(code, id) {
      if (!id.endsWith('.md')) return
      return code
    },
  }
}

export function useComponents(app: App, name: string, component: Component) {
  app.component(name, component)
}
