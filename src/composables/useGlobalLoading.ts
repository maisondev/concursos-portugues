import { useLoadingStore } from '@/stores/loading'
import { computed } from 'vue'

export function useGlobalLoading() {
  const loadingStore = useLoadingStore()

  async function withLoading<T>(
    promise: Promise<T>,
    message: string = ''
  ): Promise<T> {
    loadingStore.show(message)
    try {
      return await promise
    } finally {
      loadingStore.hide()
    }
  }

  return {
    isLoading: computed(() => loadingStore.isLoading),
    loadingMessage: computed(() => loadingStore.message),
    show: (message?: string) => loadingStore.show(message),
    hide: () => loadingStore.hide(),
    withLoading
  }
}
