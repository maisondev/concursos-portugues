import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)
  const message = ref('')
  const requestCount = ref(0)

  function show(msg: string = '') {
    requestCount.value++
    message.value = msg
    isLoading.value = true
  }

  function hide() {
    requestCount.value--
    if (requestCount.value <= 0) {
      requestCount.value = 0
      isLoading.value = false
      message.value = ''
    }
  }

  return {
    isLoading,
    message,
    show,
    hide
  }
})
