<template>
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4">
        <AppSpinner />
        <p v-if="message" class="text-sm font-medium text-white">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import AppSpinner from '@/components/atoms/AppSpinner.vue'

interface Props {
  visible: boolean
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: ''
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
