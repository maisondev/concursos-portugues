import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Roadmap, Block, Topic, Resource, TopicStatus } from '@/types'
import { roadmapInterpretacaoTextos } from '@/data/roadmaps/interpretacao-textos'

const STORAGE_KEY = 'concursos-portugues-roadmaps-v1'

export const useRoadmapStore = defineStore('roadmap', () => {
  const roadmaps = ref<Record<string, Roadmap>>({})

  function initRoadmap() {
    const stored = localStorage.getItem(STORAGE_KEY)
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
    return roadmaps.value['interpretacao-textos'] || roadmapInterpretacaoTextos
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

  function persistToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmaps.value))
  }

  watch(() => roadmaps.value, persistToStorage, { deep: true })

  return {
    roadmaps,
    activeRoadmap,
    initRoadmap,
    blockById,
    topicById,
    updateTopicStatus,
    updateTopicQuestoes,
    addResource,
    removeResource,
    updateTopicNotes,
    toggleResourceViewed,
    persistToStorage
  }
})
