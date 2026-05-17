<script setup lang="ts">
withDefaults(defineProps<{
  icon: 'instagram' | 'twitter' | 'email'
  size?: number
}>(), {
  size: 48
})
</script>

<template>
  <div class="flex items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <!-- Instagram Icon -->
    <svg v-if="icon === 'instagram'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <rect x="8" y="8" width="32" height="32" rx="6" stroke="currentColor" stroke-width="2"/>
      <circle cx="24" cy="24" r="8" stroke="currentColor" stroke-width="2"/>
      <circle cx="33" cy="15" r="1.5" fill="currentColor"/>
    </svg>

    <!-- Twitter/X Icon -->
    <svg v-if="icon === 'twitter'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <path d="M12 12L36 36M36 12L12 36" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>

    <!-- Email Icon -->
    <svg v-if="icon === 'email'" :width="size" :height="size" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-emerald-600 dark:text-emerald-500">
      <rect x="6" y="10" width="36" height="28" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M6 10L24 24L42 10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  </div>
</template>