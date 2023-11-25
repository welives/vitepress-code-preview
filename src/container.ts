import container from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'

export function codePreviewPlugin(md: MarkdownIt) {
  md.use(containerPlugin)
  md.use(codePlugin)
}

/**
 * 自定义容器，也就是下面这样的
 * ::: demo
 *
 * :::
 */
function containerPlugin(md: MarkdownIt) {
  md.use(container, 'demo', {
    validate(params: string) {
      return !!params.trim().match(/^demo\s*(.*)$/)
    },
    // 把demo代码放到div.demo-wrap里面
    render(tokens: MarkdownIt.Token[], idx: number) {
      // const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/)
      // 开始标签的 nesting 为 1，结束标签的 nesting 为 -1
      if (tokens[idx].nesting === 1) {
        // const description = m && m.length > 1 ? m[1] : ''
        // content 就是实际的代码部分
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        const lang = tokens[idx + 1].info
        const heightRes = tokens[idx].info.trim().match(/height=(\d+)/)
        const height = heightRes ? parseInt(heightRes[1]) : 400
        /**
         * !注意了,这自定义的<CodePreview>标签只是一个占位符,会被注册为这个名字的自定义组件给替换
         */
        return `<CodePreview lang="${lang}" :height="${height}" rawSource="${md.utils.escapeHtml(
          content
        )}">${content}`
      }
      // 结束标签
      return '</CodePreview>'
    },
  })
}

/**
 * 解析自定义容器内部的代码块，也就是下面这样的, 并用手风琴折叠起来
 * ```
 *
 * ```
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
    // 如果在demo内的话就进行自定义渲染
    if (isInDemoContainer) {
      return `
        <template #highlight>
          <div v-pre class="language-${lang}">
            <span class="lang">${lang}</span>
            ${md.options.highlight?.(token.content, lang, '')}
          </div>
        </template>`
    }
    return defaultRender?.(...args)
  }
}
