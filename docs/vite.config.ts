import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '../packages/plugin'

export default defineConfig(async ({ mode }) => {
  return {
    // 执行顺序 1. vite插件解析markdown => 2. markdown插件自定义解析 => 3. blockPlugin解析容器 => 4. codePlugin解析代码块 => 5. transform转换代码
    plugins: [viteDemoPreviewPlugin(), vueJsx()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./.vitepress', import.meta.url)),
      },
    },
  }
})
