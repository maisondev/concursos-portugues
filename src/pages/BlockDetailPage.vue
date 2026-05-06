<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import type { Topic } from '@/types'
import TopicList from '@/components/organisms/TopicList.vue'
import ResourceCard from '@/components/molecules/ResourceCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'

interface Props {
  roadmapId: string
  blockId: string
}

const props = defineProps<Props>()
const router = useRouter()
const roadmapStore = useRoadmapStore()
const progressStore = useProgressStore()

const block = roadmapStore.blockById(props.blockId)
const selectedTopic = ref<Topic | null>(null)
const resourceLabel = ref('')
const resourceUrl = ref('')
const resourceType = ref<'youtube' | 'drive' | 'document' | 'link'>('youtube')

function selectTopic(topic: Topic) {
  selectedTopic.value = topic
}

function updateTopicStatus(blockId: string, topicId: string, status: string) {
  roadmapStore.updateTopicStatus(blockId, topicId, status as any)
}

function addResource() {
  if (!selectedTopic.value || !resourceLabel.value || !resourceUrl.value) {
    alert('Preencha label e URL')
    return
  }

  const resource = {
    id: Math.random().toString(36).substr(2, 9),
    type: resourceType.value,
    label: resourceLabel.value,
    url: resourceUrl.value,
    addedAt: new Date().toISOString(),
    viewed: false
  }

  roadmapStore.addResource(props.blockId, selectedTopic.value.id, resource)
  resourceLabel.value = ''
  resourceUrl.value = ''
  resourceType.value = 'youtube'
}

function removeResource(topicId: string, resourceId: string) {
  roadmapStore.removeResource(props.blockId, topicId, resourceId)
}

function toggleResourceViewed(topicId: string, resourceId: string) {
  roadmapStore.toggleResourceViewed(props.blockId, topicId, resourceId)
}

const priorityColor = computed(() => {
  if (!block) return 'gray'
  if (block.priority === 'maxima') return 'purple'
  if (block.priority === 'alta') return 'yellow'
  return 'blue'
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto p-4 space-y-6">
      <!-- Header -->
      <div v-if="block">
        <button
          @click="router.back()"
          class="text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          ← Voltar
        </button>

        <div class="flex items-start justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ block.title }}</h1>
            <AppBadge :color="priorityColor" class="mt-2">
              {{ block.priority === 'maxima' ? 'Prioridade Máxima ⭐' : block.priority === 'alta' ? 'Alta Prioridade' : 'Prioridade Normal' }}
            </AppBadge>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600 dark:text-gray-400">Progresso</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ progressStore.blockProgressPercent(block.id) }}%
            </p>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mt-4">
          <AppProgressBar :value="progressStore.blockProgressPercent(block.id)" show-label />
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="block" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Topics List -->
        <div class="lg:col-span-2">
          <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4">
            <h3 class="font-semibold text-gray-900 dark:text-white">Tópicos ({{ block.topics.length }})</h3>
          </div>
          <TopicList
            :topics="block.topics"
            :block-id="block.id"
            @update:topic-status="updateTopicStatus"
            @open-topic="selectTopic"
          />
        </div>

        <!-- Resources Panel -->
        <div class="lg:col-span-1">
          <div v-if="selectedTopic" class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 sticky top-4 space-y-4">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ selectedTopic.title }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ selectedTopic.resources.length }} recursos</p>
            </div>

            <!-- Resources -->
            <div v-if="selectedTopic.resources.length > 0" class="space-y-2">
              <ResourceCard
                v-for="resource in selectedTopic.resources"
                :key="resource.id"
                :resource="resource"
                removable
                @remove="removeResource(selectedTopic.id, resource.id)"
                @toggleViewed="toggleResourceViewed(selectedTopic.id, resource.id)"
              />
            </div>

            <!-- Add Resource Form -->
            <div class="space-y-2 pt-4 border-t border-gray-300 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Adicionar Recurso</h4>
              <input
                v-model="resourceLabel"
                type="text"
                placeholder="Título/Descrição"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <input
                v-model="resourceUrl"
                type="url"
                placeholder="URL"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />
              <select
                v-model="resourceType"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="youtube">YouTube</option>
                <option value="drive">Google Drive</option>
                <option value="document">Documento</option>
                <option value="link">Link</option>
              </select>
              <AppButton variant="primary" size="sm" @click="addResource" class="w-full">
                + Adicionar
              </AppButton>
            </div>

            <!-- Notes -->
            <div class="pt-4 border-t border-gray-300 dark:border-gray-700">
              <label class="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Anotações Pessoais
              </label>
              <textarea
                :value="selectedTopic.notes"
                @input="roadmapStore.updateTopicNotes(block.id, selectedTopic.id, ($event.target as HTMLTextAreaElement).value)"
                rows="4"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                placeholder="Suas anotações aqui..."
              />
            </div>
          </div>

          <div v-else class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
            <p class="text-gray-600 dark:text-gray-400">Clique em um tópico para ver/editar recursos</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
