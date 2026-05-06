<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  submitLabel?: string
  cancelLabel?: string
}

withDefaults(defineProps<Props>(), {
  submitLabel: 'Salvar',
  cancelLabel: 'Cancelar'
})

defineEmits<{
  submit: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-in">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">{{ title }}</h2>

        <div class="mb-6">
          <slot />
        </div>

        <div class="flex gap-3 justify-end">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {{ cancelLabel }}
          </button>
          <button
            @click="$emit('submit')"
            class="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors font-medium"
          >
            {{ submitLabel }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
