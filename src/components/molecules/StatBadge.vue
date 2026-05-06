<script setup lang="ts">
import type { FunctionalComponent } from 'vue'

interface Props {
  label: string
  value: string | number
  icon?: FunctionalComponent
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

withDefaults(defineProps<Props>(), {
  color: 'blue'
})

const bgColors = {
  blue: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700',
  green: 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700',
  red: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700',
  yellow: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-700',
  purple: 'bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700'
}

const textColors = {
  blue: 'text-blue-700 dark:text-blue-300',
  green: 'text-green-700 dark:text-green-300',
  red: 'text-red-700 dark:text-red-300',
  yellow: 'text-yellow-700 dark:text-yellow-300',
  purple: 'text-purple-700 dark:text-purple-300'
}
</script>

<template>
  <div :class="['p-4 border rounded-lg', bgColors[color]]">
    <div class="flex items-center justify-between">
      <div>
        <p :class="['text-sm font-medium text-gray-600 dark:text-gray-400']">{{ label }}</p>
        <p :class="['text-3xl font-bold mt-1', textColors[color]]">{{ value }}</p>
      </div>
      <div v-if="icon" class="flex items-center justify-center">
        <component :is="icon" :class="['w-10 h-10', textColors[color], 'opacity-60']" />
      </div>
    </div>
  </div>
</template>
