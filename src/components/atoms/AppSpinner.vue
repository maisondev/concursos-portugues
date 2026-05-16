<template>
  <div class="flex items-center justify-center">
    <div class="relative w-12 h-12">
      <!-- Círculo externo -->
      <div class="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>

      <!-- Círculo animado -->
      <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>

      <!-- Círculo interno -->
      <div class="absolute inset-2 rounded-full bg-gradient-to-r from-primary/10 to-transparent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente de loading spinner moderno
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
