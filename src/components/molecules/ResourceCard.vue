<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Resource } from '@/types'
import { openLocalPath } from '@/composables/useFileSystem'
import AppLink from '@/components/atoms/AppLink.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'

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
}>()

const isOpeningLocal = ref(false)
const hoverRating = ref(0)

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

async function handleClick() {
  if (props.resource.type === 'local' && props.resource.localPath) {
    isOpeningLocal.value = true
    await openLocalPath(props.resource.localPath)
    isOpeningLocal.value = false
  }
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
</script>

<template>
  <div
    :class="[
      'p-3 border rounded-lg transition-all',
      resource.viewed
        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 opacity-60'
        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-700'
    ]"
  >
    <!-- Header: Type and metadata -->
    <div class="flex items-center gap-2 mb-2">
      <AppIcon :name="getIcon(resource.type)" size="sm" class="text-gray-600 dark:text-gray-400" />
      <span class="text-xs font-medium" :class="resource.viewed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
        {{ getTypeLabel(resource.type) }}
      </span>
      <span v-if="resource.duration" class="text-xs text-gray-500 dark:text-gray-500">{{ resource.duration }}</span>
      <span v-if="resource.viewed" class="text-xs font-semibold text-green-700 dark:text-green-300">✓ Visto</span>
    </div>

    <!-- Resource Label/Link -->
    <div class="mb-2">
      <!-- Local resource (clickable to open) -->
      <button
        v-if="resource.type === 'local'"
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
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ resource.rating > 0 ? `${resource.rating}/5` : 'Avaliar' }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-between gap-1">
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
</template>
