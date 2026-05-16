import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Roadmap, Block, Topic, Resource, TopicStatus, RoadmapColor, RoadmapStatus } from '@/types'
import { roadmapInterpretacaoTextos } from '@/data/roadmaps/interpretacao-textos'
import { useAuthStore } from '@/stores/auth'
import { api } from '@/services/api'

export const useRoadmapStore = defineStore('roadmap', () => {
  const roadmaps = ref<Record<string, Roadmap>>({})
  const activeRoadmapId = ref<string>('interpretacao-textos')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const activeRoadmap = computed(() => {
    return roadmaps.value[activeRoadmapId.value] || roadmapInterpretacaoTextos
  })

  async function initRoadmap() {
    const authStore = useAuthStore()
    isLoading.value = true
    error.value = null

    try {
      if (!authStore.isLoggedIn) {
        roadmaps.value = { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }
        return
      }

      const data = await api.get('/api/roadmaps')
      const roadmapMap: Record<string, Roadmap> = {}

      data.forEach((rm: any) => {
        roadmapMap[rm.id] = {
          id: rm.id,
          title: rm.title,
          description: rm.description,
          blocks: (rm.blocks || []).map((block: any) => ({
            id: block.id,
            order: block.order,
            title: block.title,
            priority: block.priority || 'normal',
            topics: (block.topics || []).map((topic: any) => ({
              id: topic.id,
              order: topic.order,
              title: topic.title,
              description: topic.description,
              status: topic.status || 'nao_iniciado',
              resources: topic.resources || [],
              notes: topic.notes,
              questoesSolvidas: topic.questoesSolvidas || 0,
              acertoPercent: topic.acertoPercent || 0
            }))
          })),
          status: rm.status || 'ativo',
          createdAt: rm.createdAt,
          updatedAt: rm.updatedAt,
          category: rm.category || '',
          tags: rm.tags || [],
          visibility: rm.visibility || 'private',
          color: rm.color,
          rating: rm.rating,
          order: rm.order
        }
      })

      roadmaps.value = Object.keys(roadmapMap).length > 0
        ? roadmapMap
        : { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }

      if (!roadmaps.value[activeRoadmapId.value]) {
        activeRoadmapId.value = Object.keys(roadmaps.value)[0] || 'interpretacao-textos'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao carregar roadmaps'
      console.error('Erro ao inicializar roadmap:', err)
    } finally {
      isLoading.value = false
    }
  }

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
    const newBlockId = `bloco-${Date.now()}`
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
    activeRoadmap.value.blocks = activeRoadmap.value.blocks.filter(b => b.id !== blockId)
    activeRoadmap.value.updatedAt = new Date().toISOString()
  }

  function addTopic(blockId: string, title: string) {
    const block = blockById(blockId)
    if (block) {
      const newTopicId = `topico-${Date.now()}`
      const newTopic: Topic = {
        id: newTopicId,
        order: block.topics.length + 1,
        title,
        status: 'nao_iniciado',
        resources: [],
        questoesSolvidas: 0,
        acertoPercent: 0
      }
      block.topics.push(newTopic)
      activeRoadmap.value.updatedAt = new Date().toISOString()
      return newTopicId
    }
    return null
  }

  function removeTopic(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      block.topics = block.topics.filter(t => t.id !== topicId)
      activeRoadmap.value.updatedAt = new Date().toISOString()
    }
  }

  function moveBlockUp(blockId: string) {
    const index = activeRoadmap.value.blocks.findIndex(b => b.id === blockId)
    if (index > 0) {
      const temp = activeRoadmap.value.blocks[index - 1]
      activeRoadmap.value.blocks[index - 1] = activeRoadmap.value.blocks[index]
      activeRoadmap.value.blocks[index] = temp
    }
  }

  function moveBlockDown(blockId: string) {
    const index = activeRoadmap.value.blocks.findIndex(b => b.id === blockId)
    if (index < activeRoadmap.value.blocks.length - 1) {
      const temp = activeRoadmap.value.blocks[index + 1]
      activeRoadmap.value.blocks[index + 1] = activeRoadmap.value.blocks[index]
      activeRoadmap.value.blocks[index] = temp
    }
  }

  function moveTopicUp(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      const index = block.topics.findIndex(t => t.id === topicId)
      if (index > 0) {
        const temp = block.topics[index - 1]
        block.topics[index - 1] = block.topics[index]
        block.topics[index] = temp
      }
    }
  }

  function moveTopicDown(blockId: string, topicId: string) {
    const block = blockById(blockId)
    if (block) {
      const index = block.topics.findIndex(t => t.id === topicId)
      if (index < block.topics.length - 1) {
        const temp = block.topics[index + 1]
        block.topics[index + 1] = block.topics[index]
        block.topics[index] = temp
      }
    }
  }

  function moveResourceUp(blockId: string, topicId: string, resourceId: string) {
    const topic = topicById(blockId, topicId)
    if (topic) {
      const index = topic.resources.findIndex(r => r.id === resourceId)
      if (index > 0) {
        const temp = topic.resources[index - 1]
        topic.resources[index - 1] = topic.resources[index]
        topic.resources[index] = temp
      }
    }
  }

  function moveResourceDown(blockId: string, topicId: string, resourceId: string) {
    const topic = topicById(blockId, topicId)
    if (topic) {
      const index = topic.resources.findIndex(r => r.id === resourceId)
      if (index < topic.resources.length - 1) {
        const temp = topic.resources[index + 1]
        topic.resources[index + 1] = topic.resources[index]
        topic.resources[index] = temp
      }
    }
  }

  function updateResourceRating(blockId: string, topicId: string, resourceId: string, rating: number) {
    const topic = topicById(blockId, topicId)
    if (topic) {
      const resource = topic.resources.find(r => r.id === resourceId)
      if (resource) {
        resource.rating = Math.max(1, Math.min(5, rating))
      }
    }
  }

  function markBlockComplete(blockId: string) {
    const block = blockById(blockId)
    if (block) {
      block.topics.forEach(topic => {
        topic.status = 'concluido'
      })
    }
  }

  function markBlockIncomplete(blockId: string) {
    const block = blockById(blockId)
    if (block) {
      block.topics.forEach(topic => {
        topic.status = 'nao_iniciado'
      })
    }
  }

  function setActiveRoadmap(roadmapId: string) {
    if (roadmaps.value[roadmapId]) {
      activeRoadmapId.value = roadmapId
    }
  }

  function addRoadmap(
    title: string,
    description: string,
    category?: string,
    tags?: string[],
    visibility: 'public' | 'private' = 'private'
  ): string | null {
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
    return true
  }

  function updateRoadmap(
    id: string,
    title: string,
    description: string,
    rating?: number,
    status?: RoadmapStatus,
    category?: string,
    tags?: string[],
    visibility?: 'public' | 'private'
  ) {
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

      const ordered: Record<string, Roadmap> = {}
      ids.forEach(key => {
        ordered[key] = roadmaps.value[key]
        ordered[key].order = ids.indexOf(key)
      })
      roadmaps.value = ordered
    }
  }

  function exportRoadmap(id: string): string | null {
    const roadmap = roadmaps.value[id]
    if (!roadmap) return null
    return JSON.stringify(roadmap)
  }

  function importRoadmap(jsonData: string): string | null {
    try {
      const imported = JSON.parse(jsonData)
      const newId = `roadmap-${Date.now()}`
      imported.id = newId
      imported.createdAt = new Date().toISOString()
      imported.updatedAt = new Date().toISOString()
      roadmaps.value[newId] = imported
      activeRoadmapId.value = newId
      return newId
    } catch {
      return null
    }
  }

  function clearRoadmaps() {
    roadmaps.value = { [roadmapInterpretacaoTextos.id]: roadmapInterpretacaoTextos }
    activeRoadmapId.value = 'interpretacao-textos'
  }

  return {
    roadmaps,
    activeRoadmapId,
    activeRoadmap,
    isLoading,
    error,
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
    clearRoadmaps,
    exportRoadmap,
    importRoadmap
  }
})
