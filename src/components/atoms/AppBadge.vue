<script setup lang="ts">
interface Props {
  color?: 'green' | 'yellow' | 'red' | 'blue' | 'gray' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'gray',
  size: 'md',
  dot: false
})

const colorClasses = {
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm'
}

const dotColor = {
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  gray: 'bg-gray-600',
  purple: 'bg-purple-600'
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-2 font-medium rounded-full',
      colorClasses[color],
      sizeClasses[size]
    ]"
  >
    <span v-if="dot" :class="['w-2 h-2 rounded-full', dotColor[color]]" />
    <slot />
  </span>
</template>
