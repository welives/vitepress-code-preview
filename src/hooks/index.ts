import type { App, Component } from 'vue'
export * from './useNamespace'
export * from './useCopyCode'

export function useComponents(app: App, component: Component, name = 'CodePreview') {
  app.component(name, component)
}
