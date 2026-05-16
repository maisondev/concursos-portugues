import { ref } from 'vue'
import { api } from './api'

export type SyncAction = {
  id: string
  type: 'create' | 'update' | 'delete'
  resource: 'roadmap' | 'block' | 'topic' | 'resource' | 'log' | 'teacher'
  resourceId: string
  parentId?: string
  data: any
  attempts: number
  maxAttempts: number
  createdAt: number
}

class SyncManager {
  private queue = ref<SyncAction[]>([])
  private syncing = ref(false)
  private syncTimer: NodeJS.Timeout | null = null
  private debounceDelay = 2000 // 2 segundos

  public isSyncing = this.syncing
  public pendingCount = () => this.queue.value.length

  constructor() {
    this.loadQueue()
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem('roadmap-sync-queue-v1')
      if (stored) {
        this.queue.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Erro ao carregar fila de sincronização:', err)
    }
  }

  private saveQueue() {
    localStorage.setItem('roadmap-sync-queue-v1', JSON.stringify(this.queue.value))
  }

  addAction(action: Omit<SyncAction, 'id' | 'attempts' | 'createdAt'>) {
    const newAction: SyncAction = {
      ...action,
      id: `sync-${Date.now()}-${Math.random()}`,
      attempts: 0,
      createdAt: Date.now()
    }

    this.queue.value.push(newAction)
    this.saveQueue()

    console.log(`[SYNC] ➕ Ação adicionada à fila:`, {
      tipo: action.type,
      recurso: action.resource,
      id: newAction.id,
      filaAtual: this.queue.value.length
    })

    this.scheduleSyncWithDebounce()

    return newAction.id
  }

  private scheduleSyncWithDebounce() {
    // Cancelar timer anterior
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
      console.log(`[SYNC] ⏱️  Timer anterior cancelado`)
    }

    // Agendar novo sync
    console.log(`[SYNC] ⏱️  Agendando sync em ${this.debounceDelay}ms`)
    this.syncTimer = setTimeout(() => {
      console.log(`[SYNC] ⏰ Debounce expirou! Iniciando sincronização...`)
      this.sync()
    }, this.debounceDelay)
  }

  async sync() {
    if (this.syncing.value || this.queue.value.length === 0) {
      console.log(`[SYNC] ⚠️  Sync ignorado:`, {
        jaEstaSincronizando: this.syncing.value,
        filaVazia: this.queue.value.length === 0
      })
      return
    }

    this.syncing.value = true
    console.log(`[SYNC] 🔄 Iniciando sincronização de ${this.queue.value.length} ação(ões)`)

    const actionsToSync = [...this.queue.value]

    for (const action of actionsToSync) {
      try {
        console.log(`[SYNC] 📤 Sincronizando:`, action.type, action.resource, action.resourceId)
        await this.executeSyncAction(action)
        console.log(`[SYNC] ✅ Sucesso:`, action.id)

        // Remover da fila após sucesso
        this.queue.value = this.queue.value.filter(a => a.id !== action.id)
      } catch (err) {
        action.attempts++
        console.error(`[SYNC] ❌ Erro na ação ${action.id} (tentativa ${action.attempts}/${action.maxAttempts}):`, err)

        // Se excedeu tentativas, remover
        if (action.attempts >= action.maxAttempts) {
          console.error(`[SYNC] 💥 Ação ${action.id} falhou permanentemente após ${action.maxAttempts} tentativas`)
          this.queue.value = this.queue.value.filter(a => a.id !== action.id)
        }
      }
    }

    this.saveQueue()
    this.syncing.value = false
    console.log(`[SYNC] ✨ Sincronização concluída. Fila atual: ${this.queue.value.length} ação(ões)`)
  }

  private async executeSyncAction(action: SyncAction) {
    const { type, resource, resourceId, parentId, data } = action

    console.log(`[SYNC] 🔗 Executando:`, {
      tipo: type,
      recurso: resource,
      dados: data
    })

    switch (true) {
      case resource === 'roadmap' && type === 'create':
        console.log(`[SYNC] 📍 POST /api/roadmaps`)
        return api.post('/api/roadmaps', data)

      case resource === 'roadmap' && type === 'update':
        return api.put(`/api/roadmaps/${resourceId}`, data)

      case resource === 'roadmap' && type === 'delete':
        return api.delete(`/api/roadmaps/${resourceId}`)

      case resource === 'block' && type === 'create':
        return api.post(`/api/roadmaps/${parentId}/blocks`, data)

      case resource === 'block' && type === 'update':
        return api.put(`/api/roadmaps/${parentId}/blocks/${resourceId}`, data)

      case resource === 'block' && type === 'delete':
        return api.delete(`/api/roadmaps/${parentId}/blocks/${resourceId}`)

      case resource === 'topic' && type === 'create':
        return api.post(`/api/topics/${parentId}`, data)

      case resource === 'topic' && type === 'update':
        return api.put(`/api/topics/${resourceId}`, data)

      case resource === 'topic' && type === 'delete':
        return api.delete(`/api/topics/${resourceId}`)

      case resource === 'resource' && type === 'create':
        return api.post(`/api/resources/${parentId}`, data)

      case resource === 'resource' && type === 'update':
        return api.put(`/api/resources/${resourceId}`, data)

      case resource === 'resource' && type === 'delete':
        return api.delete(`/api/resources/${resourceId}`)

      case resource === 'log' && type === 'create':
      case resource === 'log' && type === 'update':
        return api.post('/api/logs', data)

      case resource === 'log' && type === 'delete':
        return api.delete(`/api/logs/${resourceId}`)

      case resource === 'teacher' && type === 'create':
        return api.post('/api/teachers', data)

      case resource === 'teacher' && type === 'update':
        return api.put(`/api/teachers/${resourceId}`, data)

      case resource === 'teacher' && type === 'delete':
        return api.delete(`/api/teachers/${resourceId}`)

      default:
        throw new Error(`Ação desconhecida: ${resource}/${type}`)
    }
  }

  clearQueue() {
    this.queue.value = []
    this.saveQueue()
  }

  hasPendingChanges(): boolean {
    return this.queue.value.length > 0
  }

  getPendingChanges(): SyncAction[] {
    return this.queue.value
  }
}

export const syncManager = new SyncManager()
