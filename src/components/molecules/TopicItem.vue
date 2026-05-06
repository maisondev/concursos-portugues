<script setup lang="ts">
import type { Topic } from '@/types'
import AppCheckbox from '@/components/atoms/AppCheckbox.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppTag from '@/components/atoms/AppTag.vue'

interface Props {
  topic: Topic
  blockId: string
}

defineProps<Props>()

defineEmits<{
  'update:status': [value: string]
  open: []
}>()

const statusMap = {
  nao_iniciado: { color: 'gray' as const, label: 'Não iniciado' },
  em_andamento: { color: 'yellow' as const, label: 'Em andamento' },
  concluido: { color: 'green' as const, label: 'Concluído' }
}

function handleStatusChange(newStatus: boolean | 'indeterminate') {
  let status = 'nao_iniciado'
  if (newStatus === true) {
    status = 'concluido'
  } else if (newStatus === 'indeterminate') {
    status = 'em_andamento'
  }
  emit('update:status', status)
}

const emit = defineEmits<{
  'update:status': [value: string]
  open: []
}>()
</script>

<template>
  <div
    class="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
    @click="$emit('open')"
  >
    <div class="flex items-start gap-3">
      <AppCheckbox
        :model-value="topic.status === 'concluido' ? true : topic.status === 'em_andamento' ? 'indeterminate' : false"
        @update:model-value="handleStatusChange"
        @click.stop
      />
      <div class="flex-1 min-w-0">
        <p class="font-medium text-gray-900 dark:text-white break-words">{{ topic.title }}</p>
        <div class="flex gap-2 mt-2 flex-wrap">
          <AppBadge :color="statusMap[topic.status].color" size="sm">
            {{ statusMap[topic.status].label }}
          </AppBadge>
          <AppTag
            v-if="topic.resources.length > 0"
            :label="`${topic.resources.length} recurso${topic.resources.length > 1 ? 's' : ''}`"
            color="blue"
            size="sm"
          />
          <AppTag
            v-if="topic.questoesSolvidas > 0"
            :label="`${topic.questoesSolvidas} questões`"
            color="green"
            size="sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
