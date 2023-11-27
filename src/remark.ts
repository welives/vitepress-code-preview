import os from 'node:os'
import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import hash from 'hash-sum'
import type { Node } from 'unist'

interface ExtraNode extends Node {
  children?: Array<ExtraNode>
  [key: string]: any
}

/**
 * 将markdown文件和哈希值组合成虚拟模块名
 */
const combineVirtualModule = (id: string, key: string, lang: string) =>
  `virtual:${path.basename(id)}.${key}.${lang}`

/**
 * 把markdown中的demo代码转换为组件
 * @param code
 * @param id
 */
export async function transformCodeToComponent(code: string, id: string) {
  // 用来收集markdown中的demo代码块
  const _blocks: Array<Record<string, any>> = []
  // 解析markdown文件
  const parsed = await unified()
    .use(remarkParse) // 实例化parser, 用于生成 mdast
    .use(remarkFrontmatter) // 处理markdown的元信息
    .use(() => (tree: ExtraNode) => {
      let seed = 0
      tree.children?.forEach((node, index) => {
        try {
          if (!node.children || !node.children[0].value) return false
          const hasDemo = node.children[0].value.trim().match(/demo\s*(.*)$/)
          if (hasDemo) {
            const hashKey = hash(`${id}-demo-${seed}`)
            _blocks.push({
              lang: (tree.children![index + 1] as ExtraNode).lang,
              code: (tree.children![index + 1] as ExtraNode).value,
              key: hashKey, // 每个代码块的唯一key
            })
            node.children![0].value += ` virtual-${hashKey}`
            seed++
          }
        } catch (error) {
          console.error('parse markdown error in function transformCodeToComponent')
          return false
        }
      })
      if (_blocks.length === 0) return

      const virtualModules = _blocks
        .map((b) => {
          const moduleName = combineVirtualModule(id, b.key, b.lang)
          return `import Virtual${b.key} from '${moduleName}'`
        })
        .join(os.EOL)
      // 将虚拟模块追加到markdown
      tree.children?.push({
        type: 'html',
        value: `<script setup>${os.EOL}${virtualModules}${os.EOL}</script>`,
      })
    })
    .use(remarkStringify) // 实例化compiler, 用于将经过人为处理后的 mdast 输出为 markdown
    .process(code) // 执行解析

  const blocks = _blocks.map((b) => {
    const moduleName = combineVirtualModule(id, b.key, b.lang)
    Demoblocks.set(b.key, b.code)
    return { lang: b.lang, code: b.code, key: b.key, id: moduleName }
  })

  return { parsedCode: String(parsed), blocks }
}

export const Demoblocks = new Map()
