<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Resource } from '@/types'
import { openLocalPath, selectLocalPath } from '@/composables/useFileSystem'
import AppLink from '@/components/atoms/AppLink.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'

interface Props {
  resource: Resource
  removable?: boolean
  canMove?: boolean
  index?: number
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
  canMove: false,
  index: 0,
  total: 0
})

const emit = defineEmits<{
  remove: []
  toggleViewed: []
  moveUp: []
  moveDown: []
  updateRating: [rating: number]
  updateResource: [updates: Partial<Resource>]
  open: []
}>()

const isOpeningLocal = ref(false)
const isSelectingLocalPath = ref(false)
const hoverRating = ref(0)
const showEditModal = ref(false)
const editLabel = ref('')
const editType = ref<Resource['type']>('link')
const editUrl = ref('')
const editDuration = ref('')
const editNotes = ref('')

function getIcon(type: string): string {
  const iconMap = {
    youtube: 'play',
    drive: 'folder',
    document: 'file',
    link: 'link',
    local: 'download'
  }
  return iconMap[type as keyof typeof iconMap] || 'link'
}

function getTypeLabel(type: string): string {
  const labels = {
    youtube: 'YouTube',
    drive: 'Google Drive',
    document: 'Documento',
    link: 'Link',
    local: 'Arquivo Local'
  }
  return labels[type as keyof typeof labels] || type
}

function getYoutubeVideoId(url?: string): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.hostname.includes('youtu.be')) {
      return parsedUrl.pathname.replace('/', '') || null
    }

    if (parsedUrl.hostname.includes('youtube.com')) {
      const fromQuery = parsedUrl.searchParams.get('v')
      if (fromQuery) return fromQuery

      const segments = parsedUrl.pathname.split('/').filter(Boolean)
      const embedIndex = segments.findIndex(segment => segment === 'embed' || segment === 'shorts')
      if (embedIndex >= 0 && segments[embedIndex + 1]) {
        return segments[embedIndex + 1]
      }
    }
  } catch {
    return null
  }

  return null
}

async function handleClick() {
  if (props.resource.localPath) {
    isOpeningLocal.value = true
    emit('open')
    await openLocalPath(props.resource.localPath)
    isOpeningLocal.value = false
  }
}

function handleExternalOpen() {
  emit('open')
}

const canMoveUp = computed(() => props.canMove && props.index > 0)
const canMoveDown = computed(() => props.canMove && props.index < (props.total ?? 0) - 1)

function setRating(rating: number) {
  emit('updateRating', rating)
}

function renderStars(rating: number, hover: number) {
  const displayRating = hover || rating
  return Array.from({ length: 5 }, (_, i) => i < displayRating ? '★' : '☆').join('')
}

const youtubeThumbnail = computed(() => {
  if (props.resource.type !== 'youtube') return null
  const videoId = getYoutubeVideoId(props.resource.url)
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null
})

function openEditModal() {
  editLabel.value = props.resource.label
  editType.value = props.resource.type
  editUrl.value = props.resource.type === 'local' ? (props.resource.localPath || '') : (props.resource.url || '')
  editDuration.value = props.resource.duration || ''
  editNotes.value = props.resource.notes || ''
  showEditModal.value = true
}

async function selectResourceLocalPath() {
  isSelectingLocalPath.value = true
  const path = await selectLocalPath()
  if (path) {
    editUrl.value = path
  }
  isSelectingLocalPath.value = false
}

function saveResourceEdit() {
  if (!editLabel.value.trim()) {
    alert('Preencha o título do recurso')
    return
  }

  if (editType.value !== 'local' && !editUrl.value.trim()) {
    alert('Preencha a URL do recurso')
    return
  }

  if (editType.value === 'local' && !editUrl.value.trim()) {
    alert('Selecione o caminho do arquivo ou pasta')
    return
  }

  emit('updateResource', {
    type: editType.value,
    label: editLabel.value.trim(),
    url: editType.value === 'local' ? undefined : editUrl.value.trim(),
    localPath: editType.value === 'local' ? editUrl.value.trim() : undefined,
    duration: editDuration.value.trim() || undefined,
    notes: editNotes.value.trim() || undefined
  })

  showEditModal.value = false
}
</script>

<template>
  <div
    :class="[
      'border rounded-lg transition-all overflow-hidden flex flex-col',
      resource.viewed
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 opacity-60'
        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-700'
    ]"
  >
    <!-- YouTube Thumbnail with Title Overlay -->
    <div v-if="youtubeThumbnail" class="relative w-full aspect-video overflow-hidden bg-gray-800 group">
      <img
        :src="youtubeThumbnail"
        :alt="`Preview do vídeo ${resource.label}`"
        class="w-full h-full object-contain"
        loading="lazy"
      />
      <!-- Title overlay on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
        <p class="text-white text-sm font-medium p-3 line-clamp-2">{{ resource.label }}</p>
      </div>
      <!-- Play icon -->
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
        <div class="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-lg">▶</span>
        </div>
      </div>
    </div>

    <!-- Card content -->
    <div class="p-4 flex-1 flex flex-col"

      <!-- Header: Type and metadata -->
      <div class="flex items-center gap-2 mb-2">
        <AppIcon :name="getIcon(resource.type)" size="sm" class="text-gray-600 dark:text-gray-400" />
        <span class="text-xs font-medium" :class="resource.viewed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
          {{ getTypeLabel(resource.type) }}
        </span>
        <span v-if="resource.duration" class="text-xs text-gray-500 dark:text-gray-500">{{ resource.duration }}</span>
        <span v-if="resource.viewed" class="text-xs font-semibold text-green-700 dark:text-green-300">✓ Visto</span>
      </div>

      <!-- Resource Label/Link (hide for YouTube as title is on thumbnail) -->
      <div v-if="resource.type !== 'youtube'" class="mb-2">
        <!-- Local resource (clickable to open) -->
        <button
          v-if="resource.localPath"
          @click="handleClick"
          :disabled="isOpeningLocal"
          class="text-sm break-words text-blue-600 dark:text-blue-400 hover:underline transition-colors disabled:opacity-50 text-left"
          :class="resource.viewed ? 'opacity-70' : ''"
        >
          {{ resource.label }}
          <AppIcon v-if="!isOpeningLocal" name="download" size="xs" class="inline ml-1" />
          <span v-else class="ml-1 text-xs">⏳</span>
        </button>

        <!-- External resource (link) -->
        <AppLink
          v-else
          :href="resource.url || '#'"
          external
          class="text-sm break-words"
          :class="resource.viewed ? 'opacity-70' : ''"
          @click="handleExternalOpen"
        >
          {{ resource.label }}
        </AppLink>
      </div>

      <!-- For YouTube: show title below thumbnail if no thumbnail -->
      <div v-if="resource.type === 'youtube' && !youtubeThumbnail" class="mb-2">
        <AppLink
          :href="resource.url || '#'"
          external
          class="text-sm break-words font-medium"
          :class="resource.viewed ? 'opacity-70' : ''"
          @click="handleExternalOpen"
        >
          {{ resource.label }}
        </AppLink>
      </div>

      <!-- Rating Stars -->
      <div class="mb-2 flex items-center gap-1">
        <div
          class="flex gap-0.5 cursor-pointer select-none"
          @mouseleave="hoverRating = 0"
        >
          <button
            v-for="star in 5"
            :key="star"
            @click="setRating(star)"
            @mouseenter="hoverRating = star"
            :class="[
              'text-xs transition-colors',
              star <= (hoverRating || resource.rating)
                ? 'text-yellow-400 dark:text-yellow-300'
                : 'text-gray-300 dark:text-gray-600'
            ]"
            :title="`${star} estrela${star !== 1 ? 's' : ''}`"
          >
            ★
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between gap-1 mt-auto">
      <div class="flex gap-1">
        <AppButton
          variant="ghost"
          size="sm"
          :class="resource.viewed ? 'text-green-600' : 'text-gray-600'"
          @click="emit('toggleViewed')"
          :title="resource.viewed ? 'Marcar como não visto' : 'Marcar como visto'"
        >
          <AppIcon :name="resource.viewed ? 'check-circle' : 'check'" size="sm" />
        </AppButton>
        <AppButton
          variant="ghost"
          size="sm"
          class="text-gray-600 dark:text-gray-400"
          @click="openEditModal"
          title="Editar recurso"
        >
          <AppIcon name="pencil" size="sm" />
        </AppButton>
        <AppButton
          v-if="canMoveUp"
          variant="ghost"
          size="sm"
          class="text-gray-600 dark:text-gray-400"
          @click="(e) => { e.stopPropagation(); emit('moveUp') }"
          title="Mover para cima"
        >
          <AppIcon name="chevron-up" size="sm" />
        </AppButton>
        <AppButton
          v-if="canMoveDown"
          variant="ghost"
          size="sm"
          class="text-gray-600 dark:text-gray-400"
          @click="(e) => { e.stopPropagation(); emit('moveDown') }"
          title="Mover para baixo"
        >
          <AppIcon name="chevron-down" size="sm" />
        </AppButton>
      </div>
        <AppButton
          v-if="removable"
          variant="danger"
          size="sm"
          @click="emit('remove')"
          title="Remover recurso"
        >
          <AppIcon name="trash" size="sm" />
        </AppButton>
      </div>
    </div>
  </div>

  <AppModal
    :open="showEditModal"
    title="Editar Recurso"
    submit-label="Salvar"
    cancel-label="Cancelar"
    @submit="saveResourceEdit"
    @cancel="showEditModal = false"
  >
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tipo
        </label>
        <select
          v-model="editType"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="youtube">YouTube</option>
          <option value="drive">Google Drive</option>
          <option value="document">Documento</option>
          <option value="link">Link</option>
          <option value="local">Arquivo Local</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Título
        </label>
        <input
          v-model="editLabel"
          type="text"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div v-if="editType !== 'local'">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          URL
        </label>
        <input
          v-model="editUrl"
          type="url"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div v-else class="space-y-2">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Caminho local
        </label>
        <input
          v-model="editUrl"
          type="text"
          readonly
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white opacity-70"
        />
        <AppButton
          variant="secondary"
          size="sm"
          class="w-full"
          :loading="isSelectingLocalPath"
          @click="selectResourceLocalPath"
        >
          {{ isSelectingLocalPath ? 'Selecionando...' : 'Selecionar pasta' }}
        </AppButton>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Duração
        </label>
        <input
          v-model="editDuration"
          type="text"
          placeholder="Ex: 18 min"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Anotações do recurso
        </label>
        <textarea
          v-model="editNotes"
          rows="6"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Resumo, pontos importantes, dúvidas, timestamp do vídeo, etc."
        />
      </div>
    </div>
  </AppModal>
</template>
