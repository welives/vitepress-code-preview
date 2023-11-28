import type { App, Component } from 'vue'

export function useComponents(app: App, component: Component, name = 'DemoPreview') {
  app.component(name, component)
}
