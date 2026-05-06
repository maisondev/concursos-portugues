<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoadmapStore } from '@/stores/roadmap'
import { useProgressStore } from '@/stores/progress'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'

const router = useRouter()
const roadmapStore = useRoadmapStore()
const progressStore = useProgressStore()

defineProps<{
  roadmapId: string
}>()

const showAddModal = ref(false)
const newBlockTitle = ref('')
const newBlockPriority = ref<'normal' | 'alta' | 'maxima'>('normal')

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
      roadmapId: 'interpretacao-textos',
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
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <div class="max-w-5xl mx-auto p-4 space-y-8">
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
        <span class="font-medium text-gray-900 dark:text-white">{{ roadmapStore.activeRoadmap.title }}</span>
      </div>

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

      <!-- Blocks Grid -->
      <div class="space-y-3">
        <div
          v-for="(block, idx) in roadmapStore.activeRoadmap.blocks"
          :key="block.id"
          class="group p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0 cursor-pointer" @click="navigateToBlock(block.id)">
              <!-- Title and Priority -->
              <div class="flex items-center gap-3 mb-2">
                <span class="text-lg font-semibold text-gray-500 dark:text-gray-400">{{ idx + 1 }}.</span>
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
            </div>

            <!-- Actions -->
            <div class="flex flex-col items-end gap-2">
              <!-- Move buttons -->
              <div class="flex gap-1">
                <AppButton
                  v-if="idx > 0"
                  variant="ghost"
                  size="sm"
                  @click.stop="moveBlockUp(block.id)"
                  title="Mover módulo para cima"
                >
                  <AppIcon name="chevron-up" size="sm" />
                </AppButton>
                <AppButton
                  v-if="idx < roadmapStore.activeRoadmap.blocks.length - 1"
                  variant="ghost"
                  size="sm"
                  @click.stop="moveBlockDown(block.id)"
                  title="Mover módulo para baixo"
                >
                  <AppIcon name="chevron-down" size="sm" />
                </AppButton>
              </div>

              <!-- Open arrow -->
              <AppIcon name="arrow-right" size="md" class="text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
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
    </div>
  </div>
</template>
