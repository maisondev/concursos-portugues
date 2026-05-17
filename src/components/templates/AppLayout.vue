<script setup lang="ts">
import { useDailyLogStore } from '@/stores/dailyLog'
import AppNavBar from '@/components/templates/AppNavBar.vue'
import AppFooter from '@/components/templates/AppFooter.vue'

const dailyLogStore = useDailyLogStore()

dailyLogStore.initLogs()
</script>

<template>
  <div class="flex flex-col min-h-screen bg-light dark:bg-gray-900">
    <!-- Navigation Bar -->
    <AppNavBar />

    <!-- Main Content -->
    <main class="flex-1">
      <div class="max-w-[120rem] mx-auto w-full 2xl:px-6 min-[2560px]:max-w-[140rem] min-[2560px]:px-8 min-[3840px]:max-w-[160rem] min-[3840px]:px-10">
        <RouterView />
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
