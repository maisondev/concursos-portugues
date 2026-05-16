import { computed } from 'vue'
import { syncManager } from '@/services/sync'

export function useSync() {
  const isSyncing = syncManager.isSyncing
  const hasPending = computed(() => syncManager.hasPendingChanges())
  const pendingCount = computed(() => syncManager.pendingCount())

  const syncStatus = computed(() => {
    if (isSyncing.value) {
      return {
        text: 'Sincronizando...',
        color: 'blue',
        icon: 'cloud-upload'
      }
    }

    if (hasPending.value) {
      return {
        text: `${pendingCount.value} mudança${pendingCount.value > 1 ? 's' : ''} aguardando`,
        color: 'amber',
        icon: 'exclamation-triangle'
      }
    }

    return {
      text: 'Tudo sincronizado',
      color: 'green',
      icon: 'check-circle'
    }
  })

  return {
    isSyncing,
    hasPending,
    pendingCount,
    syncStatus
  }
}
