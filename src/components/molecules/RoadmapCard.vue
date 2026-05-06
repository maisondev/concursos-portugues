<script setup lang="ts">
import { ref } from 'vue'
import type { Roadmap, RoadmapColor } from '@/types'
import { PencilIcon, ChevronUpIcon, ChevronDownIcon, StarIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import AppButton from '@/components/atoms/AppButton.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import AppConfirmModal from '@/components/atoms/AppConfirmModal.vue'

interface Props {
  roadmap: Roadmap
  roadmapId: string
  stats: {
    blocks: number
    topics: number
    resources: number
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
  updateColor: [color: RoadmapColor]
  delete: [password?: string]
}

withDefaults(defineProps<Props>(), {
  canMoveUp: false,
  canMoveDown: false,
  isEditing: false
})

const emit = defineEmits<Emits>()

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editRating = ref(0)
const editColor = ref<RoadmapColor>('blue')

const colors: { color: RoadmapColor; label: string; class: string }[] = [
  { color: 'blue', label: 'Azul', class: 'bg-blue-500' },
  { color: 'red', label: 'Vermelho', class: 'bg-red-500' },
  { color: 'green', label: 'Verde', class: 'bg-green-500' },
  { color: 'yellow', label: 'Amarelo', class: 'bg-yellow-500' },
  { color: 'purple', label: 'Roxo', class: 'bg-purple-500' },
  { color: 'pink', label: 'Rosa', class: 'bg-pink-500' },
  { color: 'orange', label: 'Laranja', class: 'bg-orange-500' },
  { color: 'gray', label: 'Cinza', class: 'bg-gray-500' }
]

const getColorClass = (color?: RoadmapColor) => {
  const colorObj = colors.find(c => c.color === color)
  return colorObj?.class || colors[0].class
}

const openEditModal = () => {
  editTitle.value = props.roadmap.title
  editDescription.value = props.roadmap.description
  editRating.value = props.roadmap.rating || 0
  editColor.value = props.roadmap.color || 'blue'
  showEditModal.value = true
}

const saveEdit = () => {
  if (editColor.value !== props.roadmap.color) {
    emit('updateColor', editColor.value)
  }
  showEditModal.value = false
}

const setRating = (rating: number) => {
  editRating.value = rating
}

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = (password: string) => {
  showDeleteConfirm.value = false
  emit('delete', password)
}
</script>

<template>
  <div class="p-6 border-l-4 rounded-lg bg-white dark:bg-gray-800 space-y-4 group border border-gray-300 dark:border-gray-700" :class="[`border-l-${getColorClass(roadmap.color).split('-')[1]}-${getColorClass(roadmap.color).split('-')[2]}`]">
    <!-- Color indicator -->
    <div class="absolute top-0 left-0 w-1 h-full rounded-l" :class="getColorClass(roadmap.color)" />

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
          @click="(e) => { e.stopPropagation(); confirmDelete() }"
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
      <div>
        <span class="font-semibold text-gray-900 dark:text-white">{{ stats.resources }}</span>
        <span> recursos</span>
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

    <!-- Confirm Delete Modal -->
    <AppConfirmModal
      :open="showDeleteConfirm"
      title="Deletar Roadmap"
      message="Tem certeza que deseja deletar este roadmap? Esta ação é irreversível."
      require-password
      submit-label="Deletar"
      cancel-label="Cancelar"
      @submit="handleDeleteConfirm"
      @cancel="showDeleteConfirm = false"
    />

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

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cor
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="c in colors"
              :key="c.color"
              @click="editColor = c.color"
              :class="[
                c.class,
                'w-8 h-8 rounded-lg border-2 transition-all',
                editColor === c.color ? 'border-gray-900 dark:border-white' : 'border-transparent'
              ]"
              :title="c.label"
            />
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>
