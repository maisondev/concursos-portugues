<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import { selectLocalPath, isLocalPathValid } from '@/composables/useFileSystem'
import type { Topic } from '@/types'
import TopicList from '@/components/organisms/TopicList.vue'
import ResourceCard from '@/components/molecules/ResourceCard.vue'
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

const block = roadmapStore.blockById(props.blockId)
const selectedTopic = ref<Topic | null>(null)
const resourceLabel = ref('')
const resourceUrl = ref('')
const resourceType = ref<'youtube' | 'drive' | 'document' | 'link' | 'local'>('youtube')
const isSelectingLocalPath = ref(false)
const showAddTopicModal = ref(false)
const newTopicTitle = ref('')

function selectTopic(topic: Topic) {
  selectedTopic.value = topic
}

function updateTopicStatus(blockId: string, topicId: string, status: string) {
  roadmapStore.updateTopicStatus(blockId, topicId, status as any)
}

function addResource() {
  if (!selectedTopic.value || !resourceLabel.value) {
    alert('Preencha o label')
    return
  }

  if (resourceType.value !== 'local' && !resourceUrl.value) {
    alert('Preencha a URL')
    return
  }

  const resource = {
    id: Math.random().toString(36).substr(2, 9),
    type: resourceType.value,
    label: resourceLabel.value,
    ...(resourceType.value === 'local' ? { localPath: resourceUrl.value } : { url: resourceUrl.value }),
    addedAt: new Date().toISOString(),
    viewed: false
  }

  roadmapStore.addResource(props.blockId, selectedTopic.value.id, resource)
  resourceLabel.value = ''
  resourceUrl.value = ''
  resourceType.value = 'youtube'
  isSelectingLocalPath.value = false
}

async function selectLocalFolder() {
  isSelectingLocalPath.value = true
  const path = await selectLocalPath()
  if (path) {
    resourceUrl.value = path
  }
  isSelectingLocalPath.value = false
}

function addNewTopic() {
  if (!newTopicTitle.value.trim()) {
    alert('Digite um título para o tópico')
    return
  }

  const topicId = roadmapStore.addTopic(block!.id, newTopicTitle.value.trim())
  if (topicId) {
    newTopicTitle.value = ''
    showAddTopicModal.value = false
    // Selecionar o novo tópico automaticamente
    const newTopic = roadmapStore.topicById(block!.id, topicId)
    if (newTopic) {
      selectTopic(newTopic)
    }
  }
}

function removeResource(topicId: string, resourceId: string) {
  roadmapStore.removeResource(props.blockId, topicId, resourceId)
}

function toggleResourceViewed(topicId: string, resourceId: string) {
  roadmapStore.toggleResourceViewed(props.blockId, topicId, resourceId)
}

function moveResourceUp(topicId: string, resourceId: string) {
  roadmapStore.moveResourceUp(props.blockId, topicId, resourceId)
}

function moveResourceDown(topicId: string, resourceId: string) {
  roadmapStore.moveResourceDown(props.blockId, topicId, resourceId)
}

function updateResourceRating(topicId: string, resourceId: string, rating: number) {
  roadmapStore.updateResourceRating(props.blockId, topicId, resourceId, rating)
}

function moveTopicUp(blockId: string, topicId: string) {
  roadmapStore.moveTopicUp(blockId, topicId)
}

function moveTopicDown(blockId: string, topicId: string) {
  roadmapStore.moveTopicDown(blockId, topicId)
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
      <!-- Breadcrumb Navigation -->
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
          @click="router.push({ name: 'roadmap', params: { roadmapId: 'interpretacao-textos' } })"
          class="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Roadmap
        </button>
        <span class="text-gray-400">•</span>
        <span class="font-medium text-gray-900 dark:text-white">{{ block?.title }}</span>
      </div>

      <!-- Header -->
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

        <!-- Progress Bar -->
        <div class="mt-4">
          <AppProgressBar :value="progressStore.blockProgressPercent(block.id)" show-label />
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="block" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Topics List -->
        <div class="lg:col-span-2">
          <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 mb-4 flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Tópicos ({{ block.topics.length }})</h3>
            <AppButton variant="secondary" size="sm" @click="showAddTopicModal = true">
              + Novo Tópico
            </AppButton>
          </div>
          <TopicList
            :topics="block.topics"
            :block-id="block.id"
            @update:topic-status="updateTopicStatus"
            @open-topic="selectTopic"
            @move-topic-up="moveTopicUp"
            @move-topic-down="moveTopicDown"
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
                v-for="(resource, index) in selectedTopic.resources.sort((a, b) => (b.rating || 0) - (a.rating || 0))"
                :key="resource.id"
                :resource="resource"
                :can-move="true"
                :index="index"
                :total="selectedTopic.resources.length"
                removable
                @remove="removeResource(selectedTopic.id, resource.id)"
                @toggleViewed="toggleResourceViewed(selectedTopic.id, resource.id)"
                @moveUp="moveResourceUp(selectedTopic.id, resource.id)"
                @moveDown="moveResourceDown(selectedTopic.id, resource.id)"
                @updateRating="(rating) => updateResourceRating(selectedTopic.id, resource.id, rating)"
              />
            </div>

            <!-- Add Resource Form -->
            <div class="space-y-2 pt-4 border-t border-gray-300 dark:border-gray-700">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Adicionar Recurso</h4>

              <select
                v-model="resourceType"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              >
                <option value="youtube">▶️ YouTube</option>
                <option value="drive">📁 Google Drive</option>
                <option value="document">📄 Documento (URL)</option>
                <option value="link">🔗 Link</option>
                <option value="local">💾 Arquivo Local (HD)</option>
              </select>

              <input
                v-model="resourceLabel"
                type="text"
                placeholder="Título/Descrição"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />

              <!-- URL Input (for non-local resources) -->
              <input
                v-if="resourceType !== 'local'"
                v-model="resourceUrl"
                type="url"
                :placeholder="`URL do ${resourceType}`"
                class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              />

              <!-- Local Path Input (for local resources) -->
              <div v-else class="space-y-2">
                <input
                  v-model="resourceUrl"
                  type="text"
                  placeholder="Caminho será preenchido automaticamente"
                  readonly
                  class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white opacity-70"
                />
                <AppButton
                  variant="secondary"
                  size="sm"
                  @click="selectLocalFolder"
                  :loading="isSelectingLocalPath"
                  class="w-full"
                >
                  📂 {{ isSelectingLocalPath ? 'Selecionando...' : 'Selecionar Pasta' }}
                </AppButton>
                <p v-if="resourceUrl" class="text-xs text-green-600 dark:text-green-400">
                  ✓ Caminho selecionado: {{ resourceUrl }}
                </p>
              </div>

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

    <!-- Modal para adicionar novo tópico -->
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
