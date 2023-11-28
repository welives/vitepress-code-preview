import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'
import type MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'
import { cacheCode, cacheFile, markdownToComponent } from './remark'

interface PreviewPluginOptions {
  docRoot: string
  componentName?: string
}

/**
 * vite插件, 用来转换markdown中的demo代码
 */
export function viteDemoPreviewPlugin(): Plugin {
  // 用来收集已挂载的vite插件,因为在HMR那里需要手动更新
  let vitePlugin: any
  const options = {
    mode: 'vitepress',
    root: '',
  }
  // 用来匹配虚拟模块
  const virtualModRegex = /^virtual:.*\.md\.([a-zA-Z0-9]+)\.(vue|jsx|tsx)$/
  return {
    name: 'vite-plugin-demo-preview',
    enforce: 'pre',
    async configResolved(config) {
      const isVitepress = config.plugins.find((p) => p.name === 'vitepress')
      vitePlugin = config.plugins.find((p) => p.name === 'vite:vue')
      options.mode = isVitepress ? 'vitepress' : 'vite'
      options.root = path.resolve(config.root) // 提前抹平系统差异
    },
    // 解析虚拟模块ID,如果请求的模块ID与预期的虚拟模块ID匹配,则返回该ID,否则返回undefined
    resolveId(id) {
      if (virtualModRegex.test(id)) return id
    },
    // 加载虚拟模块的内容,如果请求的模块ID与预期的虚拟模块ID匹配,则生成模块内容并返回,否则返回undefined
    load(id) {
      const m = id.trim().match(virtualModRegex)
      if (m) {
        const key = m.length > 1 ? m[1] : ''
        // 返回虚拟模块的源码
        return cacheCode.get(key)
      }
    },
    // 把markdown中的demo代码块转换成组件
    async transform(code, id) {
      if (!id.endsWith('.md')) return
      const { parsedCode } = await markdownToComponent(code, path.resolve(id), options.root)
      return { code: parsedCode, map: null }
    },
    // 自定义HMR更新
    async handleHotUpdate(ctx) {
      const { file, server, read } = ctx
      const manualUpdateRegex = /\.(md|vue|jsx|tsx)$/
      if (!manualUpdateRegex.test(file)) return
      // 正向更新,通过markdown文件更新内部代码块
      if (file.endsWith('.md')) {
        const content = await read()
        const { parsedCode, blocks } = await markdownToComponent(
          content,
          path.resolve(file),
          options.root
        )
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
      } else {
        // 反向更新,通过被引用的组件来更新markdown
        const fileName = path.relative(options.root, file)
        for (const [key, value] of cacheFile.entries()) {
          if (fileName === value) {
            const markdownPath = path.resolve(options.root, key) // 组合完整的markdown文件路径
            const content = fs.readFileSync(markdownPath, 'utf-8')
            const { parsedCode, blocks } = await markdownToComponent(
              content,
              markdownPath,
              options.root
            )
            for (const b of blocks) {
              const virtualModule = server.moduleGraph.getModuleById(b.id)
              if (virtualModule) {
                await server.reloadModule(virtualModule)
              }
            }
            return vitePlugin.handleHotUpdate({
              ...ctx,
              read: () => parsedCode,
            })
          }
        }
      }
    },
  }
}

/**
 * markdown插件,用来解析demo代码
 */
export function demoPreviewPlugin(md: MarkdownIt, options: PreviewPluginOptions = { docRoot: '' }) {
  options.componentName = options.componentName || 'DemoPreview'
  md.use(createDemoContainer, options)
  md.use(renderDemoCode)
}

/**
 * 自定义容器，也就是用:::demo  ::: 包裹起来的部分
 */
function createDemoContainer(md: MarkdownIt, options: PreviewPluginOptions) {
  const { componentName = 'DemoPreview', docRoot } = options
  md.use(container, 'demo', {
    validate(params: string) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens: MarkdownIt.Token[], idx: number) {
      const m = tokens[idx].info.trim().match(/^demo\s*(src=.*\s)?(virtual-([a-zA-Z0-9]+))?$/)
      // 开始标签的 nesting 为 1，结束标签的 nesting 为 -1
      if (tokens[idx].nesting === 1) {
        const virtualId = m && m.length > 2 ? m[2] : ''
        const sourceFile = m && m.length > 1 ? m[1]?.split('=')[1].trim() : ''
        let source = ''
        let lang = ''
        if (sourceFile) {
          lang = path.extname(sourceFile).slice(1)
          source = fs.readFileSync(path.resolve(docRoot, sourceFile), 'utf-8')
          if (!source) throw new Error(`Incorrect source file: ${sourceFile}`)
        } else {
          lang = tokens[idx + 1].info
          source = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        }
        // 这个componentName表示之后注册组件时所使用的组件名
        return `<${componentName} :isFile="${!!sourceFile}" hlSource="${encodeURIComponent(
          md.options.highlight?.(source, lang, '') ?? ''
        )}" lang="${lang}" source="${encodeURIComponent(source)}"><${virtualId} />`
      }
      // 结束标签
      return `</${componentName}>`
    },
  })
}

/**
 * 解析渲染自定义容器内部的代码块
 */
function renderDemoCode(md: MarkdownIt) {
  // 这个 fence 就类似 ```vue ... ``` 代码块中的那个vue标识
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
