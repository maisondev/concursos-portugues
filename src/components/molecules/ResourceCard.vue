<script setup lang="ts">
import { ref } from 'vue'
import type { Resource } from '@/types'
import { openLocalPath } from '@/composables/useFileSystem'
import AppLink from '@/components/atoms/AppLink.vue'
import AppButton from '@/components/atoms/AppButton.vue'

interface Props {
  resource: Resource
  removable?: boolean
}

withDefaults(defineProps<Props>(), {
  removable: false
})

defineEmits<{
  remove: []
  toggleViewed: []
}>()

const isOpeningLocal = ref(false)

function getIcon(type: string): string {
  const icons = {
    youtube: '▶️',
    drive: '📁',
    document: '📄',
    link: '🔗',
    local: '💾'
  }
  return icons[type as keyof typeof icons] || '🔗'
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
  if (resource.type === 'local' && resource.localPath) {
    isOpeningLocal.value = true
    await openLocalPath(resource.localPath)
    isOpeningLocal.value = false
  }
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
    <div class="flex items-start justify-between gap-2">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-lg">{{ getIcon(resource.type) }}</span>
          <span class="text-xs font-medium" :class="resource.viewed ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'">
            {{ getTypeLabel(resource.type) }}
          </span>
          <span v-if="resource.duration" class="text-xs text-gray-500 dark:text-gray-500">{{ resource.duration }}</span>
          <span v-if="resource.viewed" class="text-xs font-semibold text-green-700 dark:text-green-300">✓ Visto</span>
        </div>

        <!-- Local resource (clickable to open) -->
        <button
          v-if="resource.type === 'local'"
          @click="handleClick"
          :disabled="isOpeningLocal"
          class="text-sm break-words text-blue-600 dark:text-blue-400 hover:underline transition-colors disabled:opacity-50 text-left"
          :class="resource.viewed ? 'opacity-70' : ''"
        >
          {{ resource.label }} {{ isOpeningLocal ? '⏳' : '📂' }}
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

      <div class="flex gap-1">
        <AppButton
          variant="ghost"
          size="sm"
          :class="resource.viewed ? 'text-green-600' : 'text-gray-600'"
          @click="$emit('toggleViewed')"
          :title="resource.viewed ? 'Marcar como não visto' : 'Marcar como visto'"
        >
          {{ resource.viewed ? '✓' : '○' }}
        </AppButton>
        <AppButton
          v-if="removable"
          variant="danger"
          size="sm"
          @click="$emit('remove')"
        >
          ✕
        </AppButton>
      </div>
    </div>
  </div>
</template>
