<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

interface Props {
  open: boolean
  title: string
  message: string
  requirePassword?: boolean
  submitLabel?: string
  cancelLabel?: string
}

interface Emits {
  submit: [password?: string]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  requirePassword: false,
  submitLabel: 'Confirmar',
  cancelLabel: 'Cancelar'
})

const emit = defineEmits<Emits>()

const password = ref('')

watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      password.value = ''
    }
  }
)

const handleSubmit = () => {
  emit('submit', password.value)
}

const handleCancel = () => {
  password.value = ''
  emit('cancel')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    handleCancel()
    return
  }
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    handleSubmit()
  }
}

watch(
  () => props.open,
  (open) => {
    if (open) {
      window.addEventListener('keydown', onKeydown)
    } else {
      window.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm w-full mx-4 p-6 space-y-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {{ title }}
        </h2>

        <p class="text-gray-600 dark:text-gray-400">
          {{ message }}
        </p>

        <div v-if="requirePassword" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Digite sua senha para confirmar
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Sua senha"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            @keyup.enter="handleSubmit"
          />
        </div>

        <div class="flex gap-3 justify-end pt-4 border-t border-gray-300 dark:border-gray-700">
          <button
            @click="handleCancel"
            class="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            {{ cancelLabel }}
          </button>
          <button
            @click="handleSubmit"
            class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
          >
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.2s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>
