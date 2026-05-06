<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import type { Topic } from '@/types'
import TopicList from '@/components/organisms/TopicList.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'

interface Props {
  roadmapId: string
  blockId: string
}

const props = defineProps<Props>()
const router = useRouter()
const roadmapStore = useRoadmapStore()
const progressStore = useProgressStore()

roadmapStore.setActiveRoadmap(props.roadmapId)

const block = computed(() => roadmapStore.blockById(props.blockId))
const showAddTopicModal = ref(false)
const newTopicTitle = ref('')

function openTopic(topic: Topic) {
  router.push({
    name: 'topic-resources',
    params: {
      roadmapId: props.roadmapId,
      blockId: props.blockId,
      topicId: topic.id
    }
  })
}

function updateTopicStatus(blockId: string, topicId: string, status: string) {
  roadmapStore.updateTopicStatus(blockId, topicId, status as any)
}

function addNewTopic() {
  if (!block.value || !newTopicTitle.value.trim()) {
    alert('Digite um título para o tópico')
    return
  }

  const topicId = roadmapStore.addTopic(block.value.id, newTopicTitle.value.trim())
  newTopicTitle.value = ''
  showAddTopicModal.value = false

  if (topicId) {
    router.push({
      name: 'topic-resources',
      params: {
        roadmapId: props.roadmapId,
        blockId: block.value.id,
        topicId
      }
    })
  }
}

function moveTopicUp(blockId: string, topicId: string) {
  roadmapStore.moveTopicUp(blockId, topicId)
}

function moveTopicDown(blockId: string, topicId: string) {
  roadmapStore.moveTopicDown(blockId, topicId)
}

function updateTopicTitle(blockId: string, topicId: string, newTitle: string) {
  roadmapStore.updateTopicTitle(blockId, topicId, newTitle)
}

function deleteTopic(blockId: string, topicId: string) {
  roadmapStore.removeTopic(blockId, topicId)
}

const priorityColor = computed(() => {
  if (!block.value) return 'gray'
  if (block.value.priority === 'maxima') return 'purple'
  if (block.value.priority === 'alta') return 'yellow'
  return 'blue'
})
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-[120rem] mx-auto p-4 2xl:px-8 min-[2560px]:px-12 min-[3840px]:max-w-[160rem] min-[3840px]:px-16 space-y-6">
      <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <button
          @click="router.push('/')"
          class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          <AppIcon name="home" size="sm" />
          Início
        </button>
        <span class="text-gray-400">•</span>
        <button
          @click="router.push({ name: 'roadmap', params: { roadmapId } })"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {{ roadmapStore.activeRoadmap.title }}
        </button>
        <span class="text-gray-400">•</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ block?.title }}</span>
      </div>

      <div v-if="block">
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

        <div class="mt-4">
          <AppProgressBar :value="progressStore.blockProgressPercent(block.id)" show-label />
        </div>
      </div>

      <div v-if="block" class="space-y-4">
        <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="font-semibold text-gray-900 dark:text-white">Tópicos ({{ block.topics.length }})</h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">Clique em um tópico para abrir a página de recursos.</p>
          </div>
          <AppButton variant="secondary" size="sm" @click="showAddTopicModal = true">
            + Novo Tópico
          </AppButton>
        </div>

        <TopicList
          :topics="block.topics"
          :block-id="block.id"
          @update:topic-status="updateTopicStatus"
          @update:topic-title="updateTopicTitle"
          @delete:topic="deleteTopic"
          @open-topic="openTopic"
          @move-topic-up="moveTopicUp"
          @move-topic-down="moveTopicDown"
        />
      </div>
    </div>

    <AppModal
      :open="showAddTopicModal"
      title="Adicionar Novo Tópico"
      submit-label="Criar"
      cancel-label="Cancelar"
      @submit="addNewTopic"
      @cancel="showAddTopicModal = false"
    >
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Título do Tópico
        </label>
        <input
          v-model="newTopicTitle"
          type="text"
          placeholder="Ex: Novo tópico de coesão"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          @keyup.enter="addNewTopic"
        />
      </div>
    </AppModal>
  </div>
</template>
