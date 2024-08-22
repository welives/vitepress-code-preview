import os from 'os'
import fs from 'fs'
import path from 'path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkFrontmatter from 'remark-frontmatter'
import remarkStringify from 'remark-stringify'
import type { Node } from 'unist'
import hash from 'hash-sum'

interface ExtraNode extends Node {
  children?: Array<ExtraNode>
  [key: string]: any
}
// 因为一个markdown文件就相当于一个SFC组件,所以只能存在一个setup,这个正则就是用来尝试找出是否已有setup
const ScriptSetupRegex = /^<script\s(.*\s)?setup(\s.*)?>([\s\S]*)<\/script>$/

/**
 * 将markdown文件和哈希值组合成虚拟模块名
 * @param id 模块id
 * @param key 代码块哈希值
 * @param lang 代码块所属语言
 */
const combineVirtualModule = (id: string, key: string, lang: string) =>
  `virtual:${path.basename(id)}.${key}.${lang}`

/**
 * 把markdown中的demo代码转换为组件
 * @param code markdown的原始内容
 * @param id 模块id
 * @param root docs文档根目录
 */
export async function markdownToComponent(code: string, id: string, root: string) {
  // 用来收集markdown中的demo代码块
  const _blocks: { lang: string; code: string; key: string }[] = []
  // 解析markdown文件
  const parsed = await unified()
    .use(remarkParse) // 实例化parser, 用于生成 mdast
    .use(remarkFrontmatter) // 处理markdown的元信息
    .use(() => (tree: ExtraNode) => {
      let seed = 0
      const scriptSetup = { index: -1, content: '' }
      tree.children?.forEach((node, index) => {
        try {
          // 判断是否已经存在 script setup 标签, 注释的忽略不处理
          if (node.type === 'html') {
            const m = node.value.trim().match(ScriptSetupRegex)
            if (!m) return false
            scriptSetup.index = index
            scriptSetup.content = m[3] ?? ''
          }
          if (!node.children || !node.children[0].value) return false
          // 判断demo容器是否为内联代码块的模式
          const hasDemo = node.children[0].value.trim() === ':::demo'
          const nextNodeIsCode = hasDemo && tree.children![index + 1].type === 'code'
          // 下一个节点如果是内联代码块的话
          if (nextNodeIsCode) {
            const hashKey = hash(`${id}-demo-${seed}`)
            _blocks.push({
              lang: tree.children![index + 1].lang,
              code: tree.children![index + 1].value,
              key: hashKey, // 每个代码块的唯一key
            })
            node.children[0].value += ` Virtual-${hashKey}`
            seed++
          }
          // 判断demo容器是否为引入文件的模式
          const hasSrc = node.children[0].value.trim().match(/^:::demo\s*(src=.*)\s*:::$/)
          if (hasSrc) {
            const markdownId = path.relative(root, id)
            const sourceFile = hasSrc && hasSrc.length > 1 ? hasSrc[1]?.split('=')[1].trim() : ''
            // 记录当前markdown使用了哪些组件
            handleCacheFile(markdownId, path.join(sourceFile))
            const lang = path.extname(sourceFile).slice(1)
            const source = fs.readFileSync(path.resolve(root, sourceFile), 'utf-8')
            const hashKey = hash(`${id}-demo-${seed}`)
            _blocks.push({
              lang,
              code: source,
              key: hashKey,
            })
            node.children[0].value = `:::demo src=${sourceFile} Virtual-${hashKey}${os.EOL}:::`
            seed++
          }
        } catch (error) {
          console.error(`parse markdown error in function markdownToComponent 👇\n ${error}`)
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
      // 如果之前已经有一个 setup 的话,那就把虚拟模块塞进去
      if (scriptSetup.index !== -1) {
        const node = tree.children![scriptSetup.index]
        node.value = node.value.replace(ScriptSetupRegex, (m: string, ...args: string[]) => {
          return `<script ${args[0] ?? ''} setup ${args[1] ?? ''}>${os.EOL}${virtualModules}${os.EOL
            }${args[2] ?? ''}</script>`
        })
      } else {
        // 如果没有setup的话,就新增一个用来将虚拟模块追加到markdown
        tree.children?.push({
          type: 'html',
          value: `<script setup>${os.EOL}${virtualModules}${os.EOL}</script>`,
        })
      }
    })
    .use(remarkStringify) // 实例化compiler, 用于将经过人为处理后的 mdast 输出为 markdown
    .process(code) // 执行解析

  const blocks = _blocks.map((b) => {
    const moduleName = combineVirtualModule(id, b.key, b.lang)
    cacheCode.set(b.key, b.code)
    return { ...b, id: moduleName }
  })
  return { parsedCode: String(parsed), blocks }
}

/**
 * 将markdown文件和所引用的组件关系缓存起来
 * @param mdId markdown 文件
 * @param file 组件
 */
function handleCacheFile(mdId: string, file: string) {
  const prev: string[] = cacheFile.get(mdId) ?? []
  const files = Array.from(new Set([...prev.filter(Boolean), file]))
  cacheFile.set(mdId, files)
}

export const cacheCode = new Map<string, string>()
export const cacheFile = new Map<string, string[]>()
