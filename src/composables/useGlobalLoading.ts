import { ref } from 'vue'

const isLoading = ref(false)
const loadingMessage = ref('')

export function useGlobalLoading() {
  function show(message: string = '') {
    isLoading.value = true
    loadingMessage.value = message
  }

  function hide() {
    isLoading.value = false
    loadingMessage.value = ''
  }

  async function withLoading<T>(
    promise: Promise<T>,
    message: string = ''
  ): Promise<T> {
    show(message)
    try {
      return await promise
    } finally {
      hide()
    }
  }

  return {
    isLoading,
    loadingMessage,
    show,
    hide,
    withLoading
  }
}
