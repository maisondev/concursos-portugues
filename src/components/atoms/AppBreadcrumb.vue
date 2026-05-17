<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppIcon from '@/components/atoms/AppIcon.vue'

interface Crumb {
  label: string
  action?: () => void
}

interface Props {
  crumbs: Crumb[]
}

defineProps<Props>()
const router = useRouter()

function handleClick(crumb: Crumb) {
  if (crumb.action) {
    crumb.action()
  }
}
</script>

<template>
  <div class="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 overflow-x-auto pb-2">
    <button
      @click="handleClick(crumbs[0])"
      class="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 whitespace-nowrap"
    >
      <AppIcon name="home" size="sm" />
      <span class="hidden sm:inline">{{ crumbs[0].label }}</span>
    </button>
    <template v-for="(crumb, idx) in crumbs.slice(1)" :key="idx">
      <span class="flex-shrink-0">•</span>
      <button
        v-if="crumb.action"
        @click="handleClick(crumb)"
        class="text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
      >
        {{ crumb.label }}
      </button>
      <span v-else class="font-medium text-gray-900 dark:text-white whitespace-nowrap">
        {{ crumb.label }}
      </span>
    </template>
  </div>
</template>