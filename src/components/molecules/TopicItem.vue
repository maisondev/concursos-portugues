<script setup lang="ts">
import { computed } from 'vue'
import type { Topic } from '@/types'
import AppCheckbox from '@/components/atoms/AppCheckbox.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppTag from '@/components/atoms/AppTag.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'

interface Props {
  topic: Topic
  blockId: string
  index?: number
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0,
  total: 0
})

const emit = defineEmits<{
  'update:status': [value: string]
  open: []
  'move-up': []
  'move-down': []
}>()

const statusMap = {
  nao_iniciado: { color: 'gray' as const, label: 'Não iniciado' },
  em_andamento: { color: 'yellow' as const, label: 'Em andamento' },
  concluido: { color: 'green' as const, label: 'Concluído' }
}

const canMoveUp = computed(() => props.index > 0)
const canMoveDown = computed(() => props.index < (props.total ?? 0) - 1)

function handleStatusChange(newStatus: boolean | 'indeterminate') {
  let status = 'nao_iniciado'
  if (newStatus === true) {
    status = 'concluido'
  } else if (newStatus === 'indeterminate') {
    status = 'em_andamento'
  }
  emit('update:status', status)
}
</script>

<template>
  <div
    class="p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
  >
    <div class="flex items-start gap-3">
      <AppCheckbox
        :model-value="topic.status === 'concluido' ? true : topic.status === 'em_andamento' ? 'indeterminate' : false"
        @update:model-value="handleStatusChange"
        @click.stop
      />
      <div class="flex-1 min-w-0 cursor-pointer" @click="emit('open')">
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

      <!-- Move buttons -->
      <div class="flex gap-1">
        <AppButton
          v-if="canMoveUp"
          variant="ghost"
          size="sm"
          @click.stop="emit('move-up')"
          title="Mover tópico para cima"
        >
          <AppIcon name="chevron-up" size="sm" />
        </AppButton>
        <AppButton
          v-if="canMoveDown"
          variant="ghost"
          size="sm"
          @click.stop="emit('move-down')"
          title="Mover tópico para baixo"
        >
          <AppIcon name="chevron-down" size="sm" />
        </AppButton>
      </div>
    </div>
  </div>
</template>
