<script setup lang="ts">
interface Props {
  value: number
  color?: 'green' | 'yellow' | 'blue' | 'red'
  animated?: boolean
  showLabel?: boolean
}

withDefaults(defineProps<Props>(), {
  color: 'blue',
  animated: true,
  showLabel: false
})

const colorClasses = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500'
}

const trackClasses = {
  green: 'bg-green-100 dark:bg-green-900',
  yellow: 'bg-yellow-100 dark:bg-yellow-900',
  blue: 'bg-blue-100 dark:bg-blue-900',
  red: 'bg-red-100 dark:bg-red-900'
}
</script>

<template>
  <div>
    <div
      :class="[
        'w-full h-2 rounded-full overflow-hidden',
        trackClasses[color]
      ]"
    >
      <div
        :class="[
          'h-full transition-all duration-500',
          colorClasses[color],
          { 'animate-pulse': animated }
        ]"
        :style="{ width: `${Math.min(value, 100)}%` }"
      />
    </div>
    <div v-if="showLabel" class="mt-1 text-sm text-gray-600 dark:text-gray-400">
      {{ value }}%
    </div>
  </div>
</template>
