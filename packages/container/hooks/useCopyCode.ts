import { ref } from 'vue'

export function useCopyCode(code: string) {
  const state = ref(false)

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    state.value = true
    setTimeout(() => {
      state.value = false
    }, 2 * 1000)
  }

  return {
    copyTip: state,
    copyCode,
  }
}
