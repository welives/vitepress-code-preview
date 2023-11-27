import type { Plugin } from 'vite'
import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import { Demoblocks, transformCodeToComponent } from './remark'
export * from './hooks'

/**
 * vite插件, 用来转换markdown中的demo代码
 */
export function viteCodePreviewPlugin(): Plugin {
  let vitePlugin: any
  const options = {
    env: 'vitepress',
    root: '',
  }
  const virtualModRegex = /^virtual:.*\.md\.([a-zA-Z0-9]+)\.(vue|jsx|tsx)$/
  return {
    name: 'vite-plugin-code-preview',
    enforce: 'pre',
    async configResolved(config) {
      const isVitepress = config.plugins.find((p) => p.name === 'vitepress')
      vitePlugin = config.plugins.find((p) => p.name === 'vite:vue')
      options.env = isVitepress ? 'vitepress' : 'vite'
      options.root = config.root
    },
    resolveId(id) {
      // 解析虚拟模块ID,如果请求的模块ID与预期的虚拟模块ID匹配,则返回该ID,否则返回undefined
      if (virtualModRegex.test(id)) return id
    },
    load(id) {
      // 加载虚拟模块的内容,如果请求的模块ID与预期的虚拟模块ID匹配,则生成模块内容并返回,否则返回undefined
      const m = id.trim().match(virtualModRegex)
      if (m) {
        const key = m.length > 1 ? m[1] : ''
        // 返回虚拟模块的源码
        return Demoblocks.get(key)
      }
    },
    async transform(code, id) {
      if (id.endsWith('.md')) {
        const { parsedCode } = await transformCodeToComponent(code, id)
        return { code: parsedCode, map: null }
      }
    },
    async handleHotUpdate(ctx) {
      const { file, server, read } = ctx
      if (file.endsWith('.md')) {
        const content = await read()
        const { parsedCode, blocks } = await transformCodeToComponent(content, file)
        for (const b of blocks) {
          const virtualModule = server.moduleGraph.getModuleById(b.id)
          // 艹, 可算找到能更新虚拟模块的api了
          if (virtualModule) {
            await server.reloadModule(virtualModule)
          }
        }

        return vitePlugin.handleHotUpdate({
          ...ctx,
          read: () => parsedCode,
        })
      }
    },
  }
}

/**
 * markdown插件,用来解析demo代码
 */
export function codePreviewPlugin(md: MarkdownIt) {
  md.use(containerPlugin)
  md.use(codePlugin)
}

/**
 * 自定义容器，也就是用:::demo  ::: 包裹起来的部分
 */
function containerPlugin(md: MarkdownIt) {
  md.use(container, 'demo', {
    validate(params: string) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: MarkdownIt.Token[], idx: number) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      // 开始标签的 nesting 为 1，结束标签的 nesting 为 -1
      if (tokens[idx].nesting === 1) {
        const description = m && m.length > 1 ? m[1] : ''
        // content 就是实际的代码部分
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        const lang = tokens[idx + 1].info
        /**
         * !这个<CodePreview>标签表示之后注册组件时所使用的组件名
         */
        return `<CodePreview lang="${lang}" rawSource="${encodeURIComponent(
          content
        )}"><${description} />`
      }
      // 结束标签
      return '</CodePreview>'
    },
  })
}

/**
 * 解析自定义容器内部的代码块，并用手风琴折叠起来
 */
function codePlugin(md: MarkdownIt) {
  const defaultRender = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    // 判断该 fence 是否在 ::: demo 内
    const prevToken = tokens[idx - 1]
    const isInDemoContainer =
      prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/)
    const lang = token.info.trim()
    // 如果在demo内的话就进行自定义解析
    if (isInDemoContainer) {
      return `
        <template #highlight>
          <div v-pre class="example-source language-${lang}" >
            <span class="lang">${lang}</span>
            ${md.options.highlight?.(token.content, lang, '')}
          </div>
        </template>`
    }
    return defaultRender?.(...args)
  }
}
