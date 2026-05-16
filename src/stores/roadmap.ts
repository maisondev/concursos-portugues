import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Roadmap, Block, Topic, Resource, TopicStatus, RoadmapColor, RoadmapStatus } from '@/types'
import { roadmapInterpretacaoTextos } from '@/data/roadmaps/interpretacao-textos'
import { useAuthStore } from '@/stores/auth'

const STORAGE_KEY_PREFIX = 'roadmap-roadmaps-v1'

function getStorageKey(email?: string): string {
  if (!email) {
    return `${STORAGE_KEY_PREFIX}-guest`
  }
  return `${STORAGE_KEY_PREFIX}-${email}`
}

export const useRoadmapStore = defineStore('roadmap', () => {
  const roadmaps = ref<Record<string, Roadmap>>({})
  const activeRoadmapId = ref<string>('interpretacao-textos')

  function initRoadmap() {
    const authStore = useAuthStore()
    const storageKey = getStorageKey(authStore.username || undefined)
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      try {
        roadmaps.value = JSON.parse(stored)
      } catch {
        roadmaps.value = { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }
      }
    } else {
      roadmaps.value = { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }
    }
  }

  const activeRoadmap = computed(() => {
    return roadmaps.value[activeRoadmapId.value] || roadmapInterpretacaoTextos
  })

  function blockById(blockId: string): Block | undefined {
    return activeRoadmap.value.blocks.find(b => b.id === blockId)
  }

  function topicById(blockId: string, topicId: string): Topic | undefined {
    const block = blockById(blockId)
    return block?.topics.find(t => t.id === topicId)
  }

  function updateTopicStatus(blockId: string, topicId: string, status: TopicStatus) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.status = status
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateTopicQuestoes(blockId: string, topicId: string, qty: number, acerto: number) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.questoesSolvidas = qty
        topic.acertoPercent = acerto
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function addResource(blockId: string, topicId: string, resource: Resource) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.resources.push(resource)
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function removeResource(blockId: string, topicId: string, resourceId: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.resources = topic.resources.filter(r => r.id !== resourceId)
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateResource(blockId: string, topicId: string, resourceId: string, updates: Partial<Resource>) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        const resource = topic.resources.find(r => r.id === resourceId)
        if (resource) {
          Object.assign(resource, updates)
          activeRoadmap.value.updatedAt = new Date().toISOString()
        }
      }
    }
  }

  function updateTopicNotes(blockId: string, topicId: string, notes: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.notes = notes
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function updateTopicTitle(blockId: string, topicId: string, title: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        topic.title = title
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function toggleResourceViewed(blockId: string, topicId: string, resourceId: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        const resource = topic.resources.find(r => r.id === resourceId)
        if (resource) {
          resource.viewed = !resource.viewed
          resource.viewedAt = new Date().toISOString()
          activeRoadmap.value.updatedAt = new Date().toISOString()
        }
      }
    }
  }

  function addBlock(title: string, priority: 'normal' | 'alta' | 'maxima' = 'normal') {
    const newBlockId = `bloco-${activeRoadmap.value.blocks.length + 1}`
    const newBlock: Block = {
      id: newBlockId,
      order: activeRoadmap.value.blocks.length + 1,
      title,
      priority,
      topics: []
    }
    activeRoadmap.value.blocks.push(newBlock)
    activeRoadmap.value.updatedAt = new Date().toISOString()
    return newBlockId
  }

  function updateBlock(blockId: string, title: string, priority: 'normal' | 'alta' | 'maxima') {
    const block = blockById(blockId)
    if (block) {
      block.title = title
      block.priority = priority
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function removeBlock(blockId: string) {
    const index = activeRoadmap.value.blocks.findIndex(b => b.id === blockId)
    if (index >= 0) {
      activeRoadmap.value.blocks.splice(index, 1)
      // Reordenar os blocos restantes
      activeRoadmap.value.blocks.forEach((block, idx) => {
        block.order = idx + 1
      })
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function addTopic(blockId: string, title: string) {
    const block = blockById(blockId)
    if (block) {
      const topicNumber = block.topics.length + 1
      const newTopic: Topic = {
        id: `${block.order}.${topicNumber}`,
        title,
        status: 'nao_iniciado',
        resources: [],
        notes: '',
        questoesSolvidas: 0,
        acertoPercent: null
      }
      block.topics.push(newTopic)
      activeRoadmap.value.updatedAt = new Date().toISOString()
      return newTopic.id
    }
    return null
  }

  function removeTopic(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      const index = block.topics.findIndex(t => t.id === topicId)
      if (index >= 0) {
        block.topics.splice(index, 1)
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  // Reordenação
  function moveBlockUp(blockId: string) {
    const index = activeRoadmap.value.blocks.findIndex(b => b.id === blockId)
    if (index > 0) {
      const temp = activeRoadmap.value.blocks[index]
      activeRoadmap.value.blocks[index] = activeRoadmap.value.blocks[index - 1]
      activeRoadmap.value.blocks[index - 1] = temp
      // Atualizar números de ordem
      activeRoadmap.value.blocks.forEach((block, idx) => {
        block.order = idx + 1
      })
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function moveBlockDown(blockId: string) {
    const index = activeRoadmap.value.blocks.findIndex(b => b.id === blockId)
    if (index < activeRoadmap.value.blocks.length - 1) {
      const temp = activeRoadmap.value.blocks[index]
      activeRoadmap.value.blocks[index] = activeRoadmap.value.blocks[index + 1]
      activeRoadmap.value.blocks[index + 1] = temp
      // Atualizar números de ordem
      activeRoadmap.value.blocks.forEach((block, idx) => {
        block.order = idx + 1
      })
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function moveTopicUp(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      const index = block.topics.findIndex(t => t.id === topicId)
      if (index > 0) {
        const temp = block.topics[index]
        block.topics[index] = block.topics[index - 1]
        block.topics[index - 1] = temp
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function moveTopicDown(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      const index = block.topics.findIndex(t => t.id === topicId)
      if (index < block.topics.length - 1) {
        const temp = block.topics[index]
        block.topics[index] = block.topics[index + 1]
        block.topics[index + 1] = temp
        activeRoadmap.value.updatedAt = new Date().toISOString()
      }
    }
  }

  function moveResourceUp(blockId: string, topicId: string, resourceId: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        const index = topic.resources.findIndex(r => r.id === resourceId)
        if (index > 0) {
          const temp = topic.resources[index]
          topic.resources[index] = topic.resources[index - 1]
          topic.resources[index - 1] = temp
          activeRoadmap.value.updatedAt = new Date().toISOString()
        }
      }
    }
  }

  function moveResourceDown(blockId: string, topicId: string, resourceId: string) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        const index = topic.resources.findIndex(r => r.id === resourceId)
        if (index < topic.resources.length - 1) {
          const temp = topic.resources[index]
          topic.resources[index] = topic.resources[index + 1]
          topic.resources[index + 1] = temp
          activeRoadmap.value.updatedAt = new Date().toISOString()
        }
      }
    }
  }

  function updateResourceRating(blockId: string, topicId: string, resourceId: string, rating: number) {
    const block = blockById(blockId)
    if (block) {
      const topic = block.topics.find(t => t.id === topicId)
      if (topic) {
        const resource = topic.resources.find(r => r.id === resourceId)
        if (resource) {
          resource.rating = Math.max(0, Math.min(5, rating))
          activeRoadmap.value.updatedAt = new Date().toISOString()
        }
      }
    }
  }

  function markBlockComplete(blockId: string) {
    const block = blockById(blockId)
    if (block) {
      block.topics.forEach(t => {
        t.status = 'concluido'
      })
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function markBlockIncomplete(blockId: string) {
    const block = blockById(blockId)
    if (block) {
      block.topics.forEach(t => {
        t.status = 'nao_iniciado'
      })
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function setActiveRoadmap(id: string) {
    if (roadmaps.value[id]) {
      activeRoadmapId.value = id
    }
  }

  function addRoadmap(title: string, description: string, category?: string, tags?: string[], visibility: 'public' | 'private' = 'private'): string | null {
    const authStore = useAuthStore()
    if (!authStore.isLoggedIn && Object.keys(roadmaps.value).length >= 7) {
      return null
    }
    const newId = `roadmap-${Date.now()}`
    const newRoadmap: Roadmap = {
      id: newId,
      title,
      description,
      blocks: [],
      status: 'ativo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: category || '',
      tags: tags || [],
      visibility
    }
    roadmaps.value[newId] = newRoadmap
    activeRoadmapId.value = newId
    activeRoadmap.value.updatedAt = new Date().toISOString()
    return newId
  }

  function removeRoadmap(id: string) {
    if (Object.keys(roadmaps.value).length <= 1) {
      return false
    }
    delete roadmaps.value[id]
    if (activeRoadmapId.value === id) {
      const remaining = Object.keys(roadmaps.value)[0]
      if (remaining) {
        activeRoadmapId.value = remaining
      }
    }
    activeRoadmap.value.updatedAt = new Date().toISOString()
    return true
  }

  function updateRoadmap(id: string, title: string, description: string, rating?: number, status?: RoadmapStatus, category?: string, tags?: string[], visibility?: 'public' | 'private') {
    const roadmap = roadmaps.value[id]
    if (roadmap) {
      roadmap.title = title
      roadmap.description = description
      if (rating !== undefined) {
        roadmap.rating = rating
      }
      if (status !== undefined) {
        roadmap.status = status
      }
      if (category !== undefined) {
        roadmap.category = category
      }
      if (tags !== undefined) {
        roadmap.tags = tags
      }
      if (visibility !== undefined) {
        roadmap.visibility = visibility
      }
      roadmap.updatedAt = new Date().toISOString()
    }
  }

  function updateRoadmapColor(id: string, color: RoadmapColor) {
    const roadmap = roadmaps.value[id]
    if (roadmap) {
      roadmap.color = color
      roadmap.updatedAt = new Date().toISOString()
    }
  }

  function moveRoadmapUp(id: string) {
    const ids = Object.keys(roadmaps.value)
    const currentIndex = ids.indexOf(id)
    if (currentIndex > 0) {
      const temp = ids[currentIndex - 1]
      ids[currentIndex - 1] = ids[currentIndex]
      ids[currentIndex] = temp

      // Reorder roadmaps based on new order
      const ordered: Record<string, Roadmap> = {}
      ids.forEach(key => {
        ordered[key] = roadmaps.value[key]
        ordered[key].order = ids.indexOf(key)
      })
      roadmaps.value = ordered
    }
  }

  function moveRoadmapDown(id: string) {
    const ids = Object.keys(roadmaps.value)
    const currentIndex = ids.indexOf(id)
    if (currentIndex < ids.length - 1) {
      const temp = ids[currentIndex + 1]
      ids[currentIndex + 1] = ids[currentIndex]
      ids[currentIndex] = temp

      // Reorder roadmaps based on new order
      const ordered: Record<string, Roadmap> = {}
      ids.forEach(key => {
        ordered[key] = roadmaps.value[key]
        ordered[key].order = ids.indexOf(key)
      })
      roadmaps.value = ordered
    }
  }

  function persistToStorage() {
    const authStore = useAuthStore()
    const storageKey = getStorageKey(authStore.username || undefined)
    localStorage.setItem(storageKey, JSON.stringify(roadmaps.value))
  }

  function clearRoadmaps() {
    roadmaps.value = { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }
    activeRoadmapId.value = 'interpretacao-textos'
  }

  watch(() => roadmaps.value, persistToStorage, { deep: true })

  return {
    roadmaps,
    activeRoadmapId,
    activeRoadmap,
    initRoadmap,
    blockById,
    topicById,
    updateTopicStatus,
    updateTopicQuestoes,
    addResource,
    removeResource,
    updateResource,
    updateTopicNotes,
    updateTopicTitle,
    toggleResourceViewed,
    addBlock,
    updateBlock,
    removeBlock,
    addTopic,
    removeTopic,
    moveBlockUp,
    moveBlockDown,
    moveTopicUp,
    moveTopicDown,
    moveResourceUp,
    moveResourceDown,
    updateResourceRating,
    markBlockComplete,
    markBlockIncomplete,
    setActiveRoadmap,
    addRoadmap,
    removeRoadmap,
    updateRoadmap,
    updateRoadmapColor,
    moveRoadmapUp,
    moveRoadmapDown,
    persistToStorage,
    clearRoadmaps,
    exportRoadmap,
    importRoadmap
  }

  function exportRoadmap(id: string): string {
    const roadmap = roadmaps.value[id]
    if (!roadmap) return ''
    
    const exportData = {
      title: roadmap.title,
      description: roadmap.description,
      category: roadmap.category || '',
      tags: roadmap.tags || [],
      visibility: roadmap.visibility || 'private',
      blocks: roadmap.blocks,
      exportedAt: new Date().toISOString()
    }
    
    return JSON.stringify(exportData, null, 2)
  }

  function importRoadmap(jsonData: string): string | null {
    try {
      const importData = JSON.parse(jsonData)
      
      // Validar estrutura básica
      if (!importData.title || !importData.description) {
        throw new Error('Dados inválidos: título e descrição são obrigatórios')
      }
      
      return addRoadmap(
        importData.title,
        importData.description,
        importData.category,
        importData.tags,
        importData.visibility || 'private'
      )
    } catch (error) {
      console.error('Erro ao importar roadmap:', error)
      return null
    }
  }
})
