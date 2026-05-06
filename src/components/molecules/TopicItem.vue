<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Topic } from '@/types'
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import AppCheckbox from '@/components/atoms/AppCheckbox.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppTag from '@/components/atoms/AppTag.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppIcon from '@/components/atoms/AppIcon.vue'
import AppModal from '@/components/atoms/AppModal.vue'
import AppConfirmModal from '@/components/atoms/AppConfirmModal.vue'

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
  'update:title': [title: string]
  'delete': []
  open: []
  'move-up': []
  'move-down': []
}>()

const showEditModal = ref(false)
const showDeleteConfirm = ref(false)
const editTitle = ref(props.topic.title)

const statusMap = {
  nao_iniciado: { color: 'gray' as const, label: 'Não iniciado' },
  em_andamento: { color: 'yellow' as const, label: 'Em andamento' },
  concluido: { color: 'green' as const, label: 'Concluído' }
}

const resourceCounts = computed<Record<'youtube' | 'drive' | 'document' | 'link' | 'local', number>>(() => {
  return props.topic.resources.reduce(
    (acc, r) => {
      acc[r.type] += 1
      return acc
    },
    { youtube: 0, drive: 0, document: 0, link: 0, local: 0 }
  )
})

function typeLabel(type: keyof typeof resourceCounts.value): string {
  const map: Record<string, string> = {
    youtube: 'YouTube',
    drive: 'Drive',
    document: 'Doc',
    link: 'Link',
    local: 'Local'
  }
  return map[type as string] ?? String(type)
}

function typeColor(type: keyof typeof resourceCounts.value): 'blue' | 'purple' | 'yellow' | 'gray' | 'red' {
  if (type === 'youtube') return 'red'
  if (type === 'drive') return 'yellow'
  if (type === 'document') return 'purple'
  if (type === 'local') return 'gray'
  return 'blue'
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

function openEditModal() {
  editTitle.value = props.topic.title
  showEditModal.value = true
}

function saveTitle() {
  if (editTitle.value.trim()) {
    emit('update:title', editTitle.value.trim())
    showEditModal.value = false
  }
}

function confirmDelete() {
  showDeleteConfirm.value = true
}

function handleDeleteConfirm() {
  showDeleteConfirm.value = false
  emit('delete')
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
            v-for="type in (Object.keys(resourceCounts) as Array<keyof typeof resourceCounts>)"
            :key="type"
            v-show="resourceCounts[type] > 0"
            :label="`${resourceCounts[type]} ${typeLabel(type)}`"
            :color="typeColor(type)"
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

      <!-- Action buttons -->
      <div class="flex gap-1">
        <AppButton
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); openEditModal() }"
          title="Editar título"
        >
          <PencilIcon class="w-4 h-4" />
        </AppButton>
        <AppButton
          v-if="canMoveUp"
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); emit('move-up') }"
          title="Mover tópico para cima"
        >
          <AppIcon name="chevron-up" size="sm" />
        </AppButton>
        <AppButton
          v-if="canMoveDown"
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); emit('move-down') }"
          title="Mover tópico para baixo"
        >
          <AppIcon name="chevron-down" size="sm" />
        </AppButton>
        <AppButton
          variant="ghost"
          size="sm"
          @click="(e) => { e.stopPropagation(); confirmDelete() }"
          title="Deletar tópico"
        >
          <TrashIcon class="w-4 h-4 text-red-500" />
        </AppButton>
      </div>
    </div>
  </div>

  <!-- Edit Title Modal -->
  <AppModal
    :open="showEditModal"
    title="Editar Título do Tópico"
    submit-label="Salvar"
    cancel-label="Cancelar"
    @submit="saveTitle"
    @cancel="showEditModal = false"
  >
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Título
      </label>
      <input
        v-model="editTitle"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        @keyup.enter="saveTitle"
      />
    </div>
  </AppModal>

  <!-- Delete Confirm Modal -->
  <AppConfirmModal
    :open="showDeleteConfirm"
    title="Deletar Tópico"
    message="Tem certeza que deseja deletar este tópico? Todos os recursos associados também serão removidos."
    submit-label="Deletar"
    cancel-label="Cancelar"
    @submit="handleDeleteConfirm"
    @cancel="showDeleteConfirm = false"
  />
</template>
