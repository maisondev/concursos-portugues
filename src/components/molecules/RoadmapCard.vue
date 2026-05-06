<script setup lang="ts">
import { ref } from 'vue'
import type { Roadmap } from '@/types'
import { PencilIcon, ChevronUpIcon, ChevronDownIcon, StarIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import AppButton from '@/components/atoms/AppButton.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppModal from '@/components/atoms/AppModal.vue'

interface Props {
  roadmap: Roadmap
  roadmapId: string
  stats: {
    blocks: number
    topics: number
    percent: number
  }
  canMoveUp?: boolean
  canMoveDown?: boolean
  isEditing?: boolean
}

interface Emits {
  navigate: []
  moveUp: []
  moveDown: []
  edit: []
  updateRating: [rating: number]
  delete: []
}

withDefaults(defineProps<Props>(), {
  canMoveUp: false,
  canMoveDown: false,
  isEditing: false
})

defineEmits<Emits>()

const showEditModal = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editRating = ref(0)

const openEditModal = () => {
  editTitle.value = props.roadmap.title
  editDescription.value = props.roadmap.description
  editRating.value = props.roadmap.rating || 0
  showEditModal.value = true
}

const saveEdit = () => {
  // Emit event para atualizar no store
  // O parent vai fazer o update
  showEditModal.value = false
}

const setRating = (rating: number) => {
  editRating.value = rating
}
</script>

<template>
  <div class="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 space-y-4 group">
    <!-- Header com título e botões -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1 min-w-0 cursor-pointer group/content" @click="$emit('navigate')">
        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 dark:text-white break-words group-hover/content:text-blue-600 dark:group-hover/content:text-blue-400">
          {{ roadmap.title }}
        </h3>
        <p v-if="roadmap.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ roadmap.description }}
        </p>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <AppButton
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); openEditModal() }"
          title="Editar roadmap"
        >
          <PencilIcon class="w-4 h-4" />
        </AppButton>
        <AppButton
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); $emit('delete') }"
          title="Deletar roadmap"
        >
          <TrashIcon class="w-4 h-4 text-red-500" />
        </AppButton>
      </div>
    </div>

    <!-- Rating -->
    <div v-if="roadmap.rating" class="flex items-center gap-1">
      <div class="flex gap-0.5">
        <StarSolidIcon v-for="i in roadmap.rating" :key="i" class="w-4 h-4 text-yellow-400" />
        <StarIcon v-for="i in 5 - roadmap.rating" :key="`empty-${i}`" class="w-4 h-4 text-gray-300 dark:text-gray-600" />
      </div>
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ roadmap.rating }}/5</span>
    </div>

    <!-- Stats -->
    <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
      <div>
        <span class="font-semibold text-gray-900 dark:text-white">{{ stats.blocks }}</span>
        <span> módulos</span>
      </div>
      <div>
        <span class="font-semibold text-gray-900 dark:text-white">{{ stats.topics }}</span>
        <span> tópicos</span>
      </div>
    </div>

    <!-- Progress -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</span>
        <span class="text-sm font-bold text-gray-900 dark:text-white">{{ stats.percent }}%</span>
      </div>
      <AppProgressBar :value="stats.percent" />
    </div>

    <!-- Order controls -->
    <div v-if="canMoveUp || canMoveDown" class="flex gap-1 pt-2 border-t border-gray-300 dark:border-gray-700">
      <AppButton
        v-if="canMoveUp"
        variant="ghost"
        size="sm"
        @click="(e) => { e.stopPropagation(); $emit('moveUp') }"
        title="Mover para cima"
      >
        <ChevronUpIcon class="w-4 h-4" />
      </AppButton>
      <AppButton
        v-if="canMoveDown"
        variant="ghost"
        size="sm"
        @click="(e) => { e.stopPropagation(); $emit('moveDown') }"
        title="Mover para baixo"
      >
        <ChevronDownIcon class="w-4 h-4" />
      </AppButton>
    </div>

    <!-- Edit Modal -->
    <AppModal
      :open="showEditModal"
      title="Editar Roadmap"
      submit-label="Salvar"
      cancel-label="Cancelar"
      @submit="saveEdit"
      @cancel="showEditModal = false"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título
          </label>
          <input
            v-model="editTitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            v-model="editDescription"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avaliação
          </label>
          <div class="flex gap-2">
            <button
              v-for="i in 5"
              :key="i"
              @click="setRating(i)"
              class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <StarSolidIcon
                v-if="i <= editRating"
                class="w-5 h-5 text-yellow-400"
              />
              <StarIcon
                v-else
                class="w-5 h-5 text-gray-300 dark:text-gray-600"
              />
            </button>
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>
