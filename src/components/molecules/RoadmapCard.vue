<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Roadmap, RoadmapColor, RoadmapStatus } from '@/types'
import { PencilIcon, ChevronUpIcon, ChevronDownIcon, StarIcon, TrashIcon, CheckIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppProgressBar from '@/components/atoms/AppProgressBar.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import AppConfirmModal from '@/components/atoms/AppConfirmModal.vue'
import { useSettingsStore } from '@/stores/settings'

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
  'update-roadmap': [updates: { title: string; description: string; rating: number; status: RoadmapStatus }]
  delete: [password?: string]
  'mark-complete': []
  'mark-incomplete': []
  'export': []
}

const props = withDefaults(defineProps<Props>(), {
  canMoveUp: false,
  canMoveDown: false,
  isEditing: false
})

const emit = defineEmits<Emits>()
const settingsStore = useSettingsStore()

// Add complete functionality
const isCompleted = computed(() => {
  return props.stats.percent === 100
})

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const editTitle = ref('')
const editDescription = ref('')
const editRating = ref(0)
const editColor = ref<RoadmapColor>('blue')
const editStatus = ref<RoadmapStatus>('ativo')

const DESCRIPTION_MAX = 240

const hasDeletePassword = computed(() => Boolean(settingsStore.settings.deletePassword?.trim()))

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      return diffMinutes <= 1 ? 'Agora' : `Há ${diffMinutes} min`
    }
    return diffHours === 1 ? 'Há 1 hora' : `Há ${diffHours} horas`
  } else if (diffDays === 1) {
    return 'Ontem'
  } else if (diffDays < 7) {
    return `Há ${diffDays} dias`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`
  } else {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }
}

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

const colorHex = computed(() => {
  const map: Record<RoadmapColor, string> = {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    gray: '#6b7280'
  }
  return map[props.roadmap.color || 'blue']
})

const openEditModal = () => {
  editTitle.value = props.roadmap.title
  editDescription.value = props.roadmap.description
  editRating.value = props.roadmap.rating || 0
  editColor.value = props.roadmap.color || 'blue'
  editStatus.value = (props.roadmap.status || 'ativo') as RoadmapStatus
  showEditModal.value = true
}

const saveEdit = () => {
  emit('update-roadmap', {
    title: editTitle.value.trim() || props.roadmap.title,
    description: (editDescription.value || '').slice(0, DESCRIPTION_MAX),
    rating: Math.max(0, Math.min(5, editRating.value || 0)),
    status: editStatus.value
  })
  if (editColor.value !== props.roadmap.color) {
    emit('updateColor', editColor.value)
  }
  showEditModal.value = false
}

const setRating = (rating: number) => {
  editRating.value = rating
}

const displayRating = computed(() => props.roadmap.rating ?? 0)

const statusLabel = computed(() => {
  const map: Record<RoadmapStatus, string> = {
    ativo: 'Ativo',
    pausado: 'Pausado',
    concluido: 'Concluído'
  }
  return map[(props.roadmap.status || 'ativo') as RoadmapStatus]
})

const statusClasses = computed(() => {
  const s = (props.roadmap.status || 'ativo') as RoadmapStatus
  if (s === 'concluido') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
  if (s === 'pausado') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
})

const isExample = computed(() => {
  return props.roadmap.title === 'Como Aprender Qualquer Coisa'
})

const confirmDelete = () => {
  showDeleteConfirm.value = true
}

const handleDeleteConfirm = (password: string) => {
  showDeleteConfirm.value = false
  emit('delete', password)
}
</script>

<template>
  <div
    class="relative p-6 border-l-4 rounded-lg bg-white dark:bg-gray-800 group border border-gray-300 dark:border-gray-700 flex flex-col h-full cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all"
    :style="{ borderLeftColor: colorHex }"
    @click="$emit('navigate')"
  >
    <!-- Color indicator -->
    <div class="absolute top-0 left-0 w-1 h-full rounded-l" :style="{ backgroundColor: colorHex }" />

    <div class="flex-1 min-h-0 space-y-4">
      <!-- Header -->
      <div class="min-w-0 group/content">
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white break-words group-hover/content:text-blue-600 dark:group-hover/content:text-blue-400">
            {{ roadmap.title }}
          </h3>
          <div class="flex items-center gap-2 flex-shrink-0">
            <span v-if="isExample" class="text-xs px-2.5 py-1 rounded whitespace-nowrap bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200 font-semibold">
              📚 Exemplo
            </span>
            <span class="text-xs px-2 py-1 rounded whitespace-nowrap" :class="statusClasses">
              {{ statusLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-1">
        <div class="flex gap-0.5">
          <StarSolidIcon v-for="i in displayRating" :key="i" class="w-4 h-4 text-yellow-400" />
          <StarIcon v-for="i in 5 - displayRating" :key="`empty-${i}`" class="w-4 h-4 text-gray-300 dark:text-gray-600" />
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-400">{{ displayRating }}/5</span>
      </div>

      <p v-if="roadmap.description" class="text-sm text-gray-600 dark:text-gray-400 roadmap-desc-clamp">
        {{ roadmap.description }}
      </p>

      <!-- Category and Tags -->
      <div v-if="roadmap.category || (roadmap.tags && roadmap.tags.length > 0)" class="flex flex-wrap gap-2 mb-2">
        <span v-if="roadmap.category" class="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          {{ roadmap.category }}
        </span>
        <span 
          v-for="tag in (roadmap.tags || [])" 
          :key="tag" 
          class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Visibility -->
      <div v-if="roadmap.visibility === 'public'" class="flex items-center gap-1 mb-2">
        <AppIcon name="eye" size="xs" class="text-green-500" />
        <span class="text-xs text-green-600 dark:text-green-400">Público</span>
      </div>

      <!-- Last Update -->
      <div class="text-xs text-gray-500 dark:text-gray-400">
        Última atualização: {{ formatDate(roadmap.updatedAt) }}
      </div>

      <!-- Stats -->
      <div class="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ stats.blocks }}</span>
          <span class="ml-1">{{ pluralize(stats.blocks, 'módulo', 'módulos') }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ stats.topics }}</span>
          <span class="ml-1">{{ pluralize(stats.topics, 'tópico', 'tópicos') }}</span>
        </div>
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ stats.resources }}</span>
          <span class="ml-1">{{ pluralize(stats.resources, 'recurso', 'recursos') }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom section: progress + actions -->
    <div class="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
      <!-- Progress -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Progresso</span>
          <span class="text-sm font-bold text-gray-900 dark:text-white">{{ stats.percent }}%</span>
        </div>
        <AppProgressBar :value="stats.percent" />
      </div>

      <!-- Actions grouped -->
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1">
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
            @click="(e) => { e.stopPropagation(); $emit('export') }"
            title="Exportar roadmap"
            class="border border-blue-200"
          >
            <AppIcon name="download" size="sm" class="text-blue-600" />
          </AppButton>
          <AppButton
            :variant="isCompleted ? 'secondary' : 'ghost'"
            size="sm"
            @click="(e) => { e.stopPropagation(); $emit(isCompleted ? 'mark-incomplete' : 'mark-complete') }"
            :title="isCompleted ? 'Desmarcar como concluído' : 'Marcar como concluído'"
          >
            <CheckCircleIcon v-if="isCompleted" class="w-4 h-4" />
            <CheckIcon v-else class="w-4 h-4" />
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

        <div v-if="canMoveUp || canMoveDown" class="flex items-center gap-1">
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
      </div>
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
            :maxlength="DESCRIPTION_MAX"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          />
          <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {{ (editDescription?.length || 0) }}/{{ DESCRIPTION_MAX }}
          </p>
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

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="editStatus"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          >
            <option value="ativo">Ativo</option>
            <option value="pausado">Pausado</option>
            <option value="concluido">Concluído</option>
          </select>
        </div>

        <div class="text-xs text-gray-600 dark:text-gray-400">
          Senha para deletar roadmap: <span class="font-semibold">{{ hasDeletePassword ? 'configurada' : 'não configurada' }}</span>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style scoped>
.roadmap-desc-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
