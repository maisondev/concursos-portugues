<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import AppConfirmModal from '@/components/atoms/AppConfirmModal.vue'
import { PencilIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const roadmapStore = useRoadmapStore()
const progressStore = useProgressStore()

const props = defineProps<{
  roadmapId: string
}>()

const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const newBlockTitle = ref('')
const newBlockPriority = ref<'normal' | 'alta' | 'maxima'>('normal')
const editingBlockId = ref<string | null>(null)
const editBlockTitle = ref('')
const editBlockPriority = ref<'normal' | 'alta' | 'maxima'>('normal')

// Filter state
const filterModuleName = ref('')
const filterModuleStatus = ref<'all' | 'notStarted' | 'inProgress' | 'completed'>('all')

// Computed property for filtered blocks
const filteredBlocks = computed(() => {
  let blocks = roadmapStore.activeRoadmap.blocks
  
  // Filter by name
  if (filterModuleName.value.trim()) {
    const searchTerm = filterModuleName.value.toLowerCase().trim()
    blocks = blocks.filter(block => 
      block.title.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filter by status
  if (filterModuleStatus.value !== 'all') {
    blocks = blocks.filter(block => {
      const progress = progressStore.blockProgressPercent(block.id)
      if (filterModuleStatus.value === 'notStarted') return progress === 0
      if (filterModuleStatus.value === 'inProgress') return progress > 0 && progress < 100
      if (filterModuleStatus.value === 'completed') return progress === 100
      return true
    })
  }
  
  return blocks
})

function addNewBlock() {
  if (!newBlockTitle.value.trim()) {
    alert('Digite um título para o módulo')
    return
  }

  roadmapStore.addBlock(newBlockTitle.value.trim(), newBlockPriority.value)
  newBlockTitle.value = ''
  newBlockPriority.value = 'normal'
  showAddModal.value = false
}

const priorityLabels = {
  normal: 'Normal',
  alta: 'Alta',
  maxima: 'Máxima ⭐'
}

const priorityColors = {
  normal: 'gray',
  alta: 'yellow',
  maxima: 'purple'
} as const

function navigateToBlock(blockId: string) {
  router.push({
    name: 'block-detail',
    params: {
      roadmapId: props.roadmapId,
      blockId
    }
  })
}

function moveBlockUp(blockId: string) {
  roadmapStore.moveBlockUp(blockId)
}

function moveBlockDown(blockId: string) {
  roadmapStore.moveBlockDown(blockId)
}

function toggleBlockCompletion(blockId: string) {
  const progress = progressStore.blockProgressPercent(blockId)
  if (progress === 100) {
    roadmapStore.markBlockIncomplete(blockId)
  } else {
    roadmapStore.markBlockComplete(blockId)
  }
}

function openEditModal(blockId: string) {
  const block = roadmapStore.blockById(blockId)
  if (block) {
    editingBlockId.value = blockId
    editBlockTitle.value = block.title
    editBlockPriority.value = block.priority
    showEditModal.value = true
  }
}

function saveBlockEdit() {
  if (editingBlockId.value && editBlockTitle.value.trim()) {
    roadmapStore.updateBlock(editingBlockId.value, editBlockTitle.value.trim(), editBlockPriority.value)
    showEditModal.value = false
    editingBlockId.value = null
  }
}

function confirmDeleteBlock(blockId: string) {
  editingBlockId.value = blockId
  showDeleteConfirm.value = true
}

function deleteBlock() {
  if (editingBlockId.value) {
    roadmapStore.removeBlock(editingBlockId.value)
    showDeleteConfirm.value = false
    editingBlockId.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
      <div class="max-w-[120rem] mx-auto p-4 2xl:px-8 min-[2560px]:px-12 min-[3840px]:max-w-[160rem] min-[3840px]:px-16 space-y-8">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 mb-6 overflow-x-auto pb-2" aria-label="Breadcrumb">
        <ol class="flex items-center gap-1 whitespace-nowrap">
          <li>
            <button
              @click="router.push('/')"
              class="inline-flex items-center gap-1 px-2 py-1 rounded text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex-shrink-0"
            >
              <AppIcon name="home" size="sm" />
              <span class="hidden sm:inline">Início</span>
            </button>
          </li>
          <li class="text-gray-400 dark:text-gray-600 flex-shrink-0">
            <AppIcon name="chevron-right" size="sm" />
          </li>
          <li class="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate flex-shrink-0 max-w-xs sm:max-w-none">
            {{ roadmapStore.activeRoadmap.title }}
          </li>
        </ol>
      </nav>

      <!-- Header -->
      <div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {{ roadmapStore.activeRoadmap.title }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          {{ roadmapStore.activeRoadmap.description }}
        </p>
      </div>

      <!-- Overall Progress -->
      <div class="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso Geral do Roadmap</p>
          <AppButton variant="secondary" size="sm" @click="showAddModal = true">
            + Adicionar Módulo
          </AppButton>
        </div>
        <AppProgressBar :value="progressStore.overallPercent" show-label />
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <!-- Filters -->
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div class="relative flex-1 sm:flex-initial">
            <input
              v-model="filterModuleName"
              type="text"
              placeholder="Buscar módulos..."
              class="w-full sm:w-64 px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <AppIcon name="search" size="sm" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            v-model="filterModuleStatus"
            class="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="all">Todos os status</option>
            <option value="notStarted">Não iniciados</option>
            <option value="inProgress">Em andamento</option>
            <option value="completed">Concluídos</option>
          </select>
        </div>
      </div>

      <!-- Results count -->
      <div v-if="filterModuleName || filterModuleStatus !== 'all'" class="text-sm text-gray-600 dark:text-gray-400">
        {{ filteredBlocks.length }} {{ filteredBlocks.length === 1 ? 'módulo encontrado' : 'módulos encontrados' }}
      </div>

      <!-- Blocks Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[2560px]:grid-cols-5 min-[3840px]:grid-cols-6 gap-4 min-[2560px]:gap-5 min-[3840px]:gap-6">
        <div
          v-for="(block, idx) in filteredBlocks"
          :key="block.id"
          class="group min-h-[17rem] border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow flex flex-col overflow-hidden"
        >
          <button
            type="button"
            class="flex-1 min-w-0 p-4 text-left"
            @click="navigateToBlock(block.id)"
          >
              <!-- Title and Priority -->
              <div class="flex items-center gap-3 mb-2">
                <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">{{ block.order }}.</span>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white break-words">
                    {{ block.title }}
                  </h3>
                  <p class="text-xs text-gray-600 dark:text-gray-400">
                    {{ block.topics.length }} tópicos
                  </p>
                </div>
              </div>

              <!-- Badges -->
              <div class="flex gap-2 mb-3 flex-wrap">
                <AppBadge :color="priorityColors[block.priority]" size="sm">
                  {{ priorityLabels[block.priority] }}
                </AppBadge>
              </div>

              <!-- Progress Bar -->
              <AppProgressBar
                :value="progressStore.blockProgressPercent(block.id)"
                :color="block.priority === 'maxima' ? 'blue' : block.priority === 'alta' ? 'yellow' : 'green'"
              />

              <!-- Stats -->
              <div class="mt-2 flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>{{ block.topics.filter(t => t.status === 'concluido').length }}/{{ block.topics.length }} concluídos</span>
                <span>{{ progressStore.blockProgressPercent(block.id) }}%</span>
              </div>
          </button>

          <!-- Actions -->
          <div class="border-t border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 px-4 py-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div class="flex flex-wrap items-center gap-2">
              <!-- Complete button -->
              <AppButton
                :variant="progressStore.blockProgressPercent(block.id) === 100 ? 'secondary' : 'ghost'"
                size="sm"
                @click="(e) => { e.stopPropagation(); toggleBlockCompletion(block.id) }"
                :title="progressStore.blockProgressPercent(block.id) === 100 ? 'Desmarcar como concluído' : 'Marcar como concluído'"
              >
                <AppIcon :name="progressStore.blockProgressPercent(block.id) === 100 ? 'check-circle' : 'check'" size="sm" />
              </AppButton>

              <!-- Edit button -->
              <AppButton
                variant="ghost"
                size="sm"
                @click="(e) => { e.stopPropagation(); openEditModal(block.id) }"
                title="Editar módulo"
              >
                <PencilIcon class="w-4 h-4" />
              </AppButton>

              <!-- Delete button -->
              <AppButton
                variant="ghost"
                size="sm"
                @click="(e) => { e.stopPropagation(); confirmDeleteBlock(block.id) }"
                title="Deletar módulo"
              >
                <AppIcon name="trash" size="sm" class="text-red-500" />
              </AppButton>
              </div>

              <!-- Move buttons -->
              <div class="flex items-center gap-1">
                <AppButton
                  v-if="roadmapStore.activeRoadmap.blocks.findIndex(b => b.id === block.id) > 0"
                  variant="ghost"
                  size="sm"
                  @click="(e) => { e.stopPropagation(); moveBlockUp(block.id) }"
                  title="Mover módulo para cima"
                >
                  <AppIcon name="chevron-up" size="sm" />
                </AppButton>
                <AppButton
                  v-if="roadmapStore.activeRoadmap.blocks.findIndex(b => b.id === block.id) < roadmapStore.activeRoadmap.blocks.length - 1"
                  variant="ghost"
                  size="sm"
                  @click="(e) => { e.stopPropagation(); moveBlockDown(block.id) }"
                  title="Mover módulo para baixo"
                >
                  <AppIcon name="chevron-down" size="sm" />
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div v-if="filteredBlocks.length === 0" class="text-center py-12">
        <p class="text-gray-600 dark:text-gray-400">
          Nenhum módulo encontrado para os filtros selecionados.
        </p>
        <AppButton
          variant="ghost"
          size="sm"
          @click="() => { filterModuleName = ''; filterModuleStatus = 'all' }"
          class="mt-3"
        >
          Limpar filtros
        </AppButton>
      </div>

      <!-- Modal para adicionar novo módulo -->
      <AppModal
        :open="showAddModal"
        title="Adicionar Novo Módulo"
        submit-label="Criar"
        cancel-label="Cancelar"
        @submit="addNewBlock"
        @cancel="showAddModal = false"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Módulo
            </label>
            <input
              v-model="newBlockTitle"
              type="text"
              placeholder="Ex: Módulo 17 - Novo Tópico"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              @keyup.enter="addNewBlock"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prioridade
            </label>
            <select
              v-model="newBlockPriority"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="maxima">Máxima ⭐</option>
            </select>
          </div>
        </div>
      </AppModal>

      <!-- Modal para editar módulo -->
      <AppModal
        :open="showEditModal"
        title="Editar Módulo"
        submit-label="Salvar"
        cancel-label="Cancelar"
        @submit="saveBlockEdit"
        @cancel="showEditModal = false"
      >
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Módulo
            </label>
            <input
              v-model="editBlockTitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              @keyup.enter="saveBlockEdit"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prioridade
            </label>
            <select
              v-model="editBlockPriority"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="maxima">Máxima ⭐</option>
            </select>
          </div>
        </div>
      </AppModal>

      <!-- Modal para confirmar exclusão -->
      <AppConfirmModal
        :open="showDeleteConfirm"
        title="Deletar Módulo"
        message="Tem certeza que deseja deletar este módulo? Todos os tópicos e recursos serão removidos."
        submit-label="Deletar"
        cancel-label="Cancelar"
        @submit="deleteBlock"
        @cancel="showDeleteConfirm = false"
      />
    </div>
  </div>
</template>
