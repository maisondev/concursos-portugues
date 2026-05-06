<script setup lang="ts">
interface Props {
  label: string
  removable?: boolean
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray'
}

withDefaults(defineProps<Props>(), {
  removable: false,
  color: 'blue'
})

defineEmits<{
  remove: []
}>()

const colorClasses = {
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
      colorClasses[color]
    ]"
  >
    {{ label }}
    <button
      v-if="removable"
      @click="$emit('remove')"
      class="ml-1 hover:opacity-70 transition-opacity"
    >
      ✕
    </button>
  </span>
</template>
