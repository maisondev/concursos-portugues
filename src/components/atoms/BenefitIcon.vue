<script setup lang="ts">
withDefaults(defineProps<{
  icon: 'layers' | 'chart' | 'notebook' | 'star' | 'cloud' | 'shield'
  size?: number
}>(), {
  size: 48
})
</script>

<template>
  <div class="flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Layers Icon -->
    <svg v-if="icon === 'layers'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <path d="M24 8L8 16V24L24 32L40 24V16L24 8Z" fill="currentColor" opacity="0.6"/>
      <path d="M8 24L24 32L40 24" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M8 32L24 40L40 32" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>

    <!-- Chart Icon -->
    <svg v-if="icon === 'chart'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <rect x="8" y="28" width="6" height="12" rx="1" fill="currentColor"/>
      <rect x="18" y="20" width="6" height="20" rx="1" fill="currentColor"/>
      <rect x="28" y="12" width="6" height="28" rx="1" fill="currentColor"/>
      <line x1="6" y1="40" x2="36" y2="40" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>

    <!-- Notebook Icon -->
    <svg v-if="icon === 'notebook'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <rect x="8" y="6" width="32" height="36" rx="2" stroke="currentColor" stroke-width="2"/>
      <line x1="14" y1="6" x2="14" y2="42" stroke="currentColor" stroke-width="2"/>
      <line x1="18" y1="14" x2="36" y2="14" stroke="currentColor" stroke-width="1.5"/>
      <line x1="18" y1="22" x2="36" y2="22" stroke="currentColor" stroke-width="1.5"/>
      <line x1="18" y1="30" x2="36" y2="30" stroke="currentColor" stroke-width="1.5"/>
    </svg>

    <!-- Star Icon -->
    <svg v-if="icon === 'star'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <path d="M24 6L30.18 19.82H45L33.91 28.18L39.09 42L24 33.64L8.91 42L14.09 28.18L3 19.82H17.82L24 6Z" fill="currentColor"/>
    </svg>

    <!-- Cloud Icon -->
    <svg v-if="icon === 'cloud'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <path d="M36 18C37.6 14.4 34.4 10 30 10C27.6 8.8 24.8 8 22 8C14.8 8 8.8 14 8.8 21.2C4 22.8 2 26.4 2 30C2 35.2 6 39 11 39H36C41.2 39 45 35.2 45 30C45 25.2 41.2 21 36 18Z" fill="currentColor"/>
    </svg>

    <!-- Shield Icon -->
    <svg v-if="icon === 'shield'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <path d="M24 4L10 10V24C10 34 24 44 24 44C24 44 38 34 38 24V10L24 4Z" fill="currentColor" opacity="0.6" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      <path d="M18 24L22 28L30 20" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</template>
