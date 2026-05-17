import { useGlobalLoading } from '@/composables/useGlobalLoading'

export function useApiWithLoading() {
  const { withLoading } = useGlobalLoading()

  async function fetchWithLoading<T>(
    url: string,
    options?: RequestInit,
    loadingMessage: string = 'Carregando...'
  ): Promise<T> {
    return withLoading(
      fetch(url, options).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      }),
      loadingMessage
    )
  }

  return {
    fetchWithLoading
  }
}
